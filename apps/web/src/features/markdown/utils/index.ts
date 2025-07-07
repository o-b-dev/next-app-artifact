import { marked } from 'marked'

/**
 * 将 Markdown 以块的形式返回
 * @param markdown - Markdown 文本
 * @returns 块数组
 */
export const parseMarkdownIntoBlocks = (markdown: string): string[] => {
  const tokens = marked.lexer(markdown)
  return tokens.map((token) => token.raw)
}
