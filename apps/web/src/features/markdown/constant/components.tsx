import type { ComponentType, HTMLAttributes } from 'react'

import MarkdownCode from '../components/kit/code'

/**
 * ReactMarkdown 的 components
 */
export const components: {
  [key in keyof HTMLElementTagNameMap]?: ComponentType<HTMLAttributes<HTMLElementTagNameMap[key]>>
} = {
  code: MarkdownCode,

  p: ({ children, ...props }) => (
    <div className="leading-7" {...props}>
      {children}
    </div>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="mt-10 scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="mt-8 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight transition-colors first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 scroll-m-20 text-lg font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-4 scroll-m-20 text-base font-semibold tracking-tight" {...props}>
      {children}
    </h4>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props}>
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }) => (
    <ul className="ml-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  a: ({ children, ...props }) => (
    <a className="text-primary font-medium underline underline-offset-4" {...props}>
      {children}
    </a>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="even:bg-muted m-0 border-t p-0" {...props}>
      {children}
    </tr>
  )
}
