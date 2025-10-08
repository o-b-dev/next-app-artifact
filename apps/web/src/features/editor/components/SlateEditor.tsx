'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Descendant } from 'slate'
import { createEditor, Transforms } from 'slate'
import { withHistory } from 'slate-history'
import type { RenderElementProps } from 'slate-react'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

import type { EditorTextAreaProps } from '../types'
import { slateNodesToString, stringToSlateNodes, validateSlateNodes } from '../utils/slate-utils'
import { withPrefix } from '../utils/withPrefix'
import { PrefixElement } from './PrefixElement'

export const SlateEditor = ({
  value,
  onChange,
  placeholder = '输入一些文本...',
  className = '',
  prefix,
  onPrefixRemove
}: EditorTextAreaProps) => {
  const [editor] = useState(() => withPrefix(withReact(withHistory(createEditor()))))

  // 使用 ref 来跟踪内部状态，避免不必要的重新渲染
  const isInternalChangeRef = useRef(false)

  // 捕获初始值，只在组件首次挂载时使用
  const initialValueRef = useRef<{ value: string; prefix: string | undefined }>({
    value,
    prefix
  })

  // 将字符串值转换为 Slate 节点（只在组件挂载时计算一次）
  const slateValue = useMemo(() => {
    try {
      const nodes = stringToSlateNodes(initialValueRef.current.value, initialValueRef.current.prefix)
      // 验证节点结构
      if (!nodes || nodes.length === 0) {
        return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
      }
      return nodes
    } catch (error) {
      console.warn('Error converting to slate nodes:', error)
      return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
    }
  }, [])

  // 自定义元素渲染
  const renderElement = useCallback(
    (props: RenderElementProps) => {
      if (props.element.type === 'prefix') {
        return <PrefixElement {...props} onRemove={onPrefixRemove} />
      }
      return <div {...props.attributes}>{props.children}</div>
    },
    [onPrefixRemove]
  )

  // 处理编辑器内容变化
  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      try {
        // 标记为内部变化
        isInternalChangeRef.current = true

        // 确保新值不为空且结构正确
        if (!newValue || newValue.length === 0) {
          newValue = [{ type: 'paragraph' as const, children: [{ text: '' }] }]
        }

        // 验证每个节点都有正确的结构
        const validatedValue = validateSlateNodes(newValue)
        const stringValue = slateNodesToString(validatedValue)

        // 只有当值真正改变时才调用 onChange
        if (stringValue !== value) {
          try {
            onChange?.(stringValue)
          } catch (onChangeError) {
            console.warn('Error in onChange callback:', onChangeError)
          }
        }

        // 重置标志
        isInternalChangeRef.current = false
      } catch (error) {
        console.warn('Error handling change:', error)
        isInternalChangeRef.current = false
        try {
          onChange?.('')
        } catch (onChangeError) {
          console.warn('Error in onChange callback during error recovery:', onChangeError)
        }
      }
    },
    [onChange, value]
  )

  // 处理编辑器点击，确保焦点在正确位置
  const handleEditorClick = useCallback(() => {
    if (prefix) {
      try {
        // 如果编辑器没有焦点，将焦点设置到 prefix 后面
        if (!ReactEditor.isFocused(editor)) {
          ReactEditor.focus(editor)
          // 尝试将光标移动到 prefix 后面
          setTimeout(() => {
            try {
              Transforms.select(editor, {
                anchor: { path: [0, 1, 0], offset: 0 },
                focus: { path: [0, 1, 0], offset: 0 }
              })
            } catch {
              // 如果路径不存在，不处理
            }
          }, 0)
        }
      } catch {
        // 忽略错误
      }
    }
  }, [editor, prefix])

  // 处理焦点事件，确保光标在正确位置
  const handleEditorFocus = useCallback(() => {
    if (prefix) {
      setTimeout(() => {
        try {
          const { selection } = editor
          if (selection) {
            const [start] = [selection.anchor]
            // 如果光标在 prefix 位置或之前，移动到 prefix 后面
            if (start.path[0] === 0 && start.path.length >= 2 && start.path[1] === 0) {
              Transforms.select(editor, {
                anchor: { path: [0, 1, 0], offset: 0 },
                focus: { path: [0, 1, 0], offset: 0 }
              })
            }
          }
        } catch {
          // 忽略错误
        }
      }, 0)
    }
  }, [editor, prefix])

  return (
    <Slate editor={editor} initialValue={slateValue} onChange={handleChange} key={prefix || 'no-prefix'}>
      <Editable
        renderElement={renderElement}
        placeholder={placeholder}
        className={cn(
          'border-input bg-background ring-offset-background min-h-[150px] w-full rounded-md border px-2 py-2 text-xs sm:min-h-[200px] sm:px-3 sm:text-sm',
          'placeholder:text-muted-foreground',
          'ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none',
          className
        )}
        onClick={handleEditorClick}
        onFocus={handleEditorFocus}
        onKeyDown={(event) => {
          // 处理Enter键
          if (event.key === 'Enter') {
            if (event.shiftKey) {
              // Shift+Enter: 插入换行符
              event.preventDefault()
              editor.insertText('\n')
            }
            // 普通Enter键: 让Slate默认处理（创建新段落）
          }
        }}
      />
    </Slate>
  )
}
