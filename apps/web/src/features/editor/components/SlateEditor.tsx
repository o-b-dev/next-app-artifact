'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Descendant } from 'slate'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'

import type { EditorTextAreaProps } from '../types'
import { slateNodesToString, stringToSlateNodes, validateSlateNodes } from '../utils/slate-utils'

export const SlateEditor = ({
  value,
  onChange,
  placeholder = '输入一些文本...',
  className = ''
}: EditorTextAreaProps) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())))

  // 使用 ref 来跟踪内部状态，避免不必要的重新渲染
  const isInternalChangeRef = useRef(false)

  // 将字符串值转换为 Slate 节点
  const slateValue = useMemo(() => {
    try {
      const nodes = stringToSlateNodes(value)
      // 验证节点结构
      if (!nodes || nodes.length === 0) {
        return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
      }
      return nodes
    } catch (error) {
      console.warn('Error converting to slate nodes:', error)
      return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
    }
  }, [value])

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

  return (
    <Slate
      editor={editor}
      initialValue={slateValue}
      onChange={handleChange}
      key={value} // 使用 key 强制在外部值变化时重新挂载
    >
      <Editable
        placeholder={placeholder}
        className={cn(
          'border-input bg-background ring-offset-background min-h-[150px] w-full rounded-md border px-2 py-2 text-xs sm:min-h-[200px] sm:px-3 sm:text-sm',
          'placeholder:text-muted-foreground',
          'ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-none',
          className
        )}
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
