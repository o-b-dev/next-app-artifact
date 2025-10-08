import type { Editor } from 'slate'
import { Editor as SlateEditor, Element, Node, Range, Text, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

/**
 * 检查第一个段落是否有 prefix
 */
const hasPrefix = (editor: Editor): boolean => {
  try {
    const firstParagraph = Node.get(editor, [0])
    if (Element.isElement(firstParagraph) && firstParagraph.type === 'paragraph') {
      const firstChild = firstParagraph.children[0]
      return firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix'
    }
  } catch {
    // 节点不存在
  }
  return false
}

/**
 * 检查选区是否覆盖或包含 prefix
 */
const selectionCoversPrefix = (editor: Editor): boolean => {
  const { selection } = editor
  if (!selection || Range.isCollapsed(selection)) return false

  if (!hasPrefix(editor)) return false

  try {
    const [start] = Range.edges(selection)
    const prefixPath = [0, 0]

    // 如果选区的起点在第一个段落
    if (start.path[0] === 0) {
      // 如果起点在 prefix 位置（[0, 0]）或更前面
      if (start.path.length === 2 && start.path[1] === 0) {
        return true
      }
      // 如果起点在段落级别（[0]），说明选中了整个段落
      if (start.path.length === 1) {
        return true
      }
    }

    // 检查 prefix 路径是否在选区范围内
    return Range.includes(selection, SlateEditor.start(editor, prefixPath))
  } catch {
    return false
  }
}

/**
 * 自定义插件：防止 prefix 被删除和编辑
 */
export const withPrefix = (editor: Editor) => {
  const {
    isInline,
    deleteBackward,
    deleteForward,
    deleteFragment,
    insertText,
    insertBreak,
    insertData,
    setFragmentData,
    apply,
    normalizeNode
  } = editor

  // 标记 prefix 为行内元素
  editor.isInline = (element) => {
    return element.type === 'prefix' ? true : isInline(element)
  }

  // 自定义标准化逻辑，防止 Slate 破坏 prefix 结构
  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    // 如果是 prefix 节点，跳过所有标准化
    if (Element.isElement(node) && node.type === 'prefix') {
      return
    }

    // 如果是包含 prefix 的段落，完全跳过标准化以防止 unwrapNodes 错误
    if (Element.isElement(node) && node.type === 'paragraph') {
      // 检查是否是第一个段落
      if (path.length === 1 && path[0] === 0) {
        const firstChild = node.children[0]

        // 如果第一个子节点是 prefix
        if (firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix') {
          // 确保 prefix 后面有至少一个文本节点
          if (node.children.length < 2) {
            Transforms.insertNodes(editor, { text: '' }, { at: [...path, 1] })
            return
          }

          // 确保 prefix 后面的节点是文本节点
          const secondChild = node.children[1]
          if (!Text.isText(secondChild)) {
            // 如果第二个子节点不是文本节点，替换为文本节点
            Transforms.removeNodes(editor, { at: [...path, 1] })
            Transforms.insertNodes(editor, { text: '' }, { at: [...path, 1] })
            return
          }

          // 确保只有两个子节点：prefix 和文本
          // 如果有多余的节点，移除它们或合并到文本节点
          if (node.children.length > 2) {
            // 收集所有额外的文本内容
            const extraText = node.children
              .slice(2)
              .map((child) => (Text.isText(child) ? child.text : ''))
              .join('')

            // 如果有额外的文本，合并到第二个子节点
            if (extraText) {
              const currentText = Text.isText(secondChild) ? secondChild.text : ''
              Transforms.delete(editor, { at: [...path, 2], distance: node.children.length - 2 })
              Transforms.insertText(editor, extraText, { at: [...path, 1, currentText.length] })
              return
            } else {
              // 删除多余的节点
              for (let i = node.children.length - 1; i >= 2; i--) {
                Transforms.removeNodes(editor, { at: [...path, i] })
              }
              return
            }
          }

          // 完全跳过这个段落的标准化，防止 Slate 的 unwrapNodes 操作
          return
        }
      }
    }

    // 对于其他节点，调用原始的 normalizeNode
    normalizeNode(entry)
  }

  // 防止删除包含 prefix 的片段（全选删除、范围删除等）
  editor.deleteFragment = (direction) => {
    // 如果选区覆盖了 prefix，阻止删除
    if (selectionCoversPrefix(editor)) {
      // 不执行删除操作
      return
    }

    deleteFragment(direction)
  }

  // 防止在输入时删除 prefix（全选后输入等）
  editor.insertText = (text, options) => {
    const { selection } = editor

    // 如果有选区且覆盖了 prefix
    if (selection && !Range.isCollapsed(selection) && selectionCoversPrefix(editor)) {
      // 先删除选区（会被 deleteFragment 拦截保护 prefix）
      Transforms.delete(editor)
      // 然后在当前位置插入文本
      editor.insertText(text, options)
      return
    }

    // 检查是否尝试在 prefix 之前插入文本
    if (selection && Range.isCollapsed(selection) && hasPrefix(editor)) {
      const [start] = Range.edges(selection)

      // 如果光标在第一个段落
      if (start.path[0] === 0) {
        // 如果光标在段落开始位置 [0] 或在 prefix 位置 [0, 0]
        if (start.path.length === 1 || (start.path.length >= 2 && start.path[1] === 0)) {
          // 移动光标到 prefix 后面再插入
          try {
            const afterPrefixPath = [0, 1, 0]
            Transforms.select(editor, {
              anchor: { path: afterPrefixPath, offset: 0 },
              focus: { path: afterPrefixPath, offset: 0 }
            })
          } catch {
            // 如果路径不存在，阻止插入
            return
          }
        }
      }
    }

    insertText(text, options)
  }

  // 防止在 prefix 位置按 Enter
  editor.insertBreak = () => {
    const { selection } = editor
    if (selection && hasPrefix(editor)) {
      const [start] = Range.edges(selection)

      // 如果光标在第一个段落
      if (start.path[0] === 0) {
        // 如果光标在段落开始 [0] 或 prefix 位置 [0, 0] 或 prefix 内部
        if (start.path.length === 1 || (start.path.length >= 2 && start.path[1] === 0)) {
          // 移动到 prefix 后面再插入换行
          try {
            const afterPrefixPath = [0, 1, 0]
            Transforms.select(editor, {
              anchor: { path: afterPrefixPath, offset: 0 },
              focus: { path: afterPrefixPath, offset: 0 }
            })
          } catch {
            // 如果路径不存在，阻止操作
            return
          }
        }
      }
    }

    insertBreak()
  }

  // 防止退格删除 prefix
  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (!selection || !Range.isCollapsed(selection)) {
      deleteBackward(unit)
      return
    }

    const [start] = Range.edges(selection)

    // 如果不在第一个段落，继续正常删除
    if (start.path[0] !== 0 && start.path[0] !== 1) {
      deleteBackward(unit)
      return
    }

    try {
      // 检查第一个段落的第一个子节点是否是 prefix
      const firstParagraphPath = [0]
      const firstParagraph = Node.get(editor, firstParagraphPath)

      if (!Element.isElement(firstParagraph) || firstParagraph.type !== 'paragraph') {
        deleteBackward(unit)
        return
      }

      const firstChild = firstParagraph.children[0]

      // 如果第一个子节点不是 prefix，继续正常删除
      if (!firstChild || !Element.isElement(firstChild) || firstChild.type !== 'prefix') {
        deleteBackward(unit)
        return
      }

      // 以下是有 prefix 的情况

      // 1. 检查光标是否在 prefix 内部 [0, 0, x]
      if (start.path[0] === 0 && start.path.length >= 2 && start.path[1] === 0) {
        // 阻止在 prefix 内部删除
        return
      }

      // 2. 检查光标是否在 prefix 之后的第一个文本节点的开头 [0, 1, 0] offset=0
      if (start.path[0] === 0 && start.path.length === 3 && start.path[1] === 1 && start.offset === 0) {
        // 阻止删除，这会影响到 prefix
        return
      }

      // 3. 检查光标是否在第一个段落的第一个位置（这种情况不应该发生，但保险起见）
      if (start.path[0] === 0 && start.path.length === 2 && start.path[1] === 1 && start.offset === 0) {
        // 阻止删除
        return
      }

      // 4. 检查是否在第二个段落的开头按退格（即将合并到第一个段落）
      if (start.path[0] === 1 && start.offset === 0) {
        // 检查第一个段落的 prefix 后的文本内容
        const textAfterPrefix = firstParagraph.children[1]
        if (textAfterPrefix && Text.isText(textAfterPrefix) && textAfterPrefix.text === '') {
          // 执行正常的删除（合并段落）
          deleteBackward(unit)
          // 合并后，确保光标在 prefix 之后
          setTimeout(() => {
            try {
              const afterPrefixNode = Node.get(editor, [0, 1])
              if (Text.isText(afterPrefixNode)) {
                Transforms.select(editor, {
                  anchor: { path: [0, 1, 0], offset: 0 },
                  focus: { path: [0, 1, 0], offset: 0 }
                })
                ReactEditor.focus(editor)
              }
            } catch {
              // 如果路径不存在，尝试重新聚焦
              try {
                ReactEditor.focus(editor)
              } catch {
                // 忽略错误
              }
            }
          }, 0)
          return
        }
        // 如果第一行有内容，阻止合并，因为这可能导致问题
        return
      }

      // 其他情况继续正常删除
      deleteBackward(unit)
    } catch (error) {
      // 发生错误时，为了安全起见阻止删除
      console.warn('Error in deleteBackward:', error)
      return
    }
  }

  // 防止前向删除 prefix
  editor.deleteForward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      try {
        const [start] = Range.edges(selection)

        // 检查是否在第一个段落
        if (start.path[0] === 0) {
          const firstParagraphPath = [0]
          const firstParagraph = Node.get(editor, firstParagraphPath)

          if (Element.isElement(firstParagraph) && firstParagraph.type === 'paragraph') {
            const firstChild = firstParagraph.children[0]

            // 如果第一个子节点是 prefix
            if (firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix') {
              // 如果光标在段落开始位置 [0] 或 prefix 位置 [0, 0]
              if (
                start.path.length === 1 ||
                (start.path.length === 2 && start.path[1] === 0) ||
                (start.path.length === 3 && start.path[1] === 0)
              ) {
                return
              }
            }
          }
        }
      } catch {
        // 节点不存在，继续正常删除
      }
    }

    deleteForward(unit)
  }

  // 拦截粘贴操作，防止覆盖 prefix 或在 prefix 之前粘贴
  editor.insertData = (data) => {
    const { selection } = editor

    if (selection && hasPrefix(editor)) {
      // 如果选区覆盖了 prefix
      if (!Range.isCollapsed(selection) && selectionCoversPrefix(editor)) {
        // 移动光标到 prefix 后面，而不是删除 prefix
        try {
          const afterPrefixPath = [0, 1, 0]
          Transforms.select(editor, {
            anchor: { path: afterPrefixPath, offset: 0 },
            focus: { path: afterPrefixPath, offset: 0 }
          })
        } catch {
          // 如果路径不存在，阻止操作
          return
        }
      }

      // 如果光标在 prefix 之前（单点光标）
      if (Range.isCollapsed(selection)) {
        const [start] = Range.edges(selection)

        // 如果光标在第一个段落的开始或 prefix 位置
        if (start.path[0] === 0) {
          if (start.path.length === 1 || (start.path.length >= 2 && start.path[1] === 0)) {
            // 移动光标到 prefix 后面再粘贴
            try {
              const afterPrefixPath = [0, 1, 0]
              Transforms.select(editor, {
                anchor: { path: afterPrefixPath, offset: 0 },
                focus: { path: afterPrefixPath, offset: 0 }
              })
            } catch {
              // 如果路径不存在，阻止操作
              return
            }
          }
        }
      }
    }

    insertData(data)
  }

  // 拦截复制/剪切操作，防止包含 prefix 的内容被复制或剪切
  editor.setFragmentData = (data) => {
    const { selection } = editor

    // 如果选区覆盖了 prefix，不允许设置片段数据（阻止剪切）
    if (selection && selectionCoversPrefix(editor)) {
      // 不执行原始的 setFragmentData，这样剪切操作就不会生效
      return
    }

    setFragmentData(data)
  }

  // 拦截所有对编辑器的操作，防止通过底层 API 删除或在 prefix 之前插入
  editor.apply = (operation) => {
    if (!hasPrefix(editor)) {
      apply(operation)
      return
    }

    // 如果是删除节点的操作，检查是否试图删除 prefix 或第一个段落
    if (operation.type === 'remove_node') {
      try {
        const node = Node.get(editor, operation.path)
        if (Element.isElement(node) && node.type === 'prefix') {
          // 阻止删除 prefix 节点
          return
        }
        // 如果试图删除第一个段落
        if (operation.path.length === 1 && operation.path[0] === 0) {
          if (Element.isElement(node) && node.type === 'paragraph') {
            const firstChild = node.children[0]
            if (firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix') {
              // 阻止删除包含 prefix 的第一个段落
              return
            }
          }
        }
        // 如果试图删除第一个段落中 prefix 后的文本节点 [0, 1]
        if (operation.path.length === 2 && operation.path[0] === 0 && operation.path[1] === 1) {
          // 检查第一个段落是否有 prefix
          try {
            const firstParagraph = Node.get(editor, [0])
            if (Element.isElement(firstParagraph) && firstParagraph.type === 'paragraph') {
              const firstChild = firstParagraph.children[0]
              if (firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix') {
                // 阻止删除 prefix 后的文本节点
                return
              }
            }
          } catch {
            // 忽略
          }
        }
      } catch {
        // 节点可能不存在，继续
      }
    }

    // 如果是删除文本或合并节点的操作，检查是否影响 prefix
    if (operation.type === 'remove_text' || operation.type === 'merge_node') {
      // 检查操作路径是否是 prefix 或包含 prefix
      if (operation.path[0] === 0 && operation.path.length >= 2 && operation.path[1] === 0) {
        // 操作在 prefix 节点上，阻止
        return
      }
      // 如果是合并节点操作，且目标是第一个段落
      if (operation.type === 'merge_node' && operation.path.length === 1 && operation.path[0] === 1) {
        // 这会将第二个段落合并到第一个段落，需要特别处理
        // 允许合并，但确保之后的标准化会修复结构
      }
    }

    // 如果是插入文本的操作，检查是否试图在 prefix 之前插入
    if (operation.type === 'insert_text') {
      // 检查操作路径，如果在第一个段落
      if (operation.path[0] === 0) {
        // 如果试图在 prefix 位置 [0, 0] 插入，阻止
        if (operation.path.length >= 2 && operation.path[1] === 0) {
          return
        }
        // 如果试图在段落开始位置插入（意味着在 prefix 之前）
        if (operation.path.length === 2 && operation.path[1] === 0 && operation.offset === 0) {
          return
        }
      }
    }

    // 如果是插入节点的操作，检查是否试图在 prefix 之前插入
    if (operation.type === 'insert_node') {
      // 检查操作路径，如果在第一个段落
      if (operation.path[0] === 0) {
        // 如果试图在 prefix 位置或之前插入节点，阻止
        if (operation.path.length >= 2 && operation.path[1] === 0) {
          return
        }
      }
    }

    // 如果是分割节点操作，检查是否在第一个段落的 prefix 位置
    if (operation.type === 'split_node') {
      if (operation.path[0] === 0) {
        // 如果试图在 prefix 位置分割，阻止
        if (operation.path.length >= 2 && operation.path[1] === 0) {
          return
        }
      }
    }

    apply(operation)
  }

  return editor
}
