import { memo } from 'react'
import ReactMarkdown from 'react-markdown'

import { components } from '../constant/components'

/**
 * Markdown 渲染组件 - Props
 */
export interface MarkdownProps {
  content: string
}

/**
 * Markdown 渲染组件
 */
const Markdown = memo<MarkdownProps>(
  ({ content }) => {
    return <ReactMarkdown components={components}>{content}</ReactMarkdown>
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false
    return true
  }
)

Markdown.displayName = 'Markdown'

export default Markdown
