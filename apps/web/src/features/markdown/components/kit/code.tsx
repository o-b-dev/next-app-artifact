import { cn } from '@workspace/ui/lib/utils'
import useCreation from 'ahooks/lib/useCreation'
import type { HTMLAttributes } from 'react'
import { memo } from 'react'

/**
 * Markdown 代码块组件 - Props
 */
interface MarkdownCodeProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean
}

/**
 * Markdown 代码块组件
 */
const MarkdownCode = memo<MarkdownCodeProps>(({ inline, className, children, ...props }) => {
  const inlineCode = useCreation(() => {
    if (inline === void 0 && typeof children === 'string' && !children.includes('\n')) {
      return children
    }

    return inline
  }, [children, inline])

  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  if (!inlineCode) {
    return (
      <div className="not-prose mt-4 flex flex-col">
        {language && (
          <div className="flex items-center justify-between rounded-t-xl border border-zinc-200 bg-zinc-100 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="text-sm text-zinc-500">{language}</div>
          </div>
        )}

        <pre
          {...props}
          className={cn(
            'w-full overflow-x-auto rounded-b-xl border border-t-0 border-zinc-200 p-4 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50',
            !language && 'rounded-t-xl border-t'
          )}
        >
          <code className="whitespace-pre-wrap break-words">{children}</code>
        </pre>
      </div>
    )
  }

  return (
    <code className={`${className} rounded-sm bg-zinc-100 px-1.5 py-1 text-sm dark:bg-zinc-800`} {...props}>
      {children}
    </code>
  )
})

MarkdownCode.displayName = 'MarkdownCode'

export default MarkdownCode
