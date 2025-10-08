import type { Editor } from 'slate'
import { Editor as SlateEditor, Element, Node, Range, Transforms } from 'slate'

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

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)

      try {
        // 检查第一个段落的第一个子节点是否是 prefix
        const firstParagraphPath = [0]
        const firstParagraph = Node.get(editor, firstParagraphPath)

        if (Element.isElement(firstParagraph) && firstParagraph.type === 'paragraph') {
          const firstChild = firstParagraph.children[0]

          // 如果第一个子节点是 prefix
          if (firstChild && Element.isElement(firstChild) && firstChild.type === 'prefix') {
            // 检查光标是否在 prefix 之后的第一个位置 [0, 1, 0]
            if (start.path[0] === 0 && start.path.length === 3 && start.path[1] === 1 && start.offset === 0) {
              return
            }

            // 检查光标是否在 prefix 内部 [0, 0]
            if (start.path[0] === 0 && start.path.length >= 2 && start.path[1] === 0) {
              return
            }
          }
        }
      } catch {
        // 节点不存在，继续正常删除
      }
    }

    deleteBackward(unit)
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

    // 如果是删除节点的操作，检查是否试图删除 prefix
    if (operation.type === 'remove_node') {
      try {
        const node = Node.get(editor, operation.path)
        if (Element.isElement(node) && node.type === 'prefix') {
          // 阻止删除 prefix 节点
          return
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
