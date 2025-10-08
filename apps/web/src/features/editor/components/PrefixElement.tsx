'use client'

import type { RenderElementProps } from 'slate-react'

interface PrefixElementProps extends RenderElementProps {
  onRemove?: () => void
}

export const PrefixElement = ({ attributes, children, element, onRemove }: PrefixElementProps) => {
  if (element.type !== 'prefix') return null

  const prefixText = 'prefix' in element ? element.prefix : ''

  return (
    <span {...attributes} contentEditable={false} className="inline-block select-none">
      <span
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onRemove?.()
        }}
        onMouseDown={(e) => {
          // 防止默认的选择和拖拽行为
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          // 阻止所有键盘事件
          e.preventDefault()
          e.stopPropagation()
        }}
        className="inline-flex cursor-pointer items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
        contentEditable={false}
      >
        {prefixText}
        {/* children 必须渲染，但用户看不到，是 Slate 的要求 */}
        <span className="absolute h-0 w-0 select-none opacity-0">{children}</span>
      </span>
    </span>
  )
}
