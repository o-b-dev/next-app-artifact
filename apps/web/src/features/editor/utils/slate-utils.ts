import type { Descendant } from 'slate'
import { Element, Node, Text } from 'slate'

/**
 * 将字符串转换为Slate节点
 */
export const stringToSlateNodes = (text: string): Descendant[] => {
  // 确保text不为null或undefined
  const safeText = text || ''

  // 如果文本为空，返回一个包含空文本的段落
  if (safeText === '') {
    return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
  }

  const lines = safeText.split('\n')

  // 如果分割后没有行，返回一个空段落
  if (lines.length === 0) {
    return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
  }

  // 为每一行创建段落节点
  const nodes = lines.map((line) => ({
    type: 'paragraph' as const,
    children: [{ text: line || '' }] // 确保每行都有文本，即使是空字符串
  }))

  // 最终检查：确保至少有一个节点
  if (nodes.length === 0) {
    return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
  }

  return nodes
}

/**
 * 将Slate节点转换为字符串
 */
export const slateNodesToString = (nodes: Descendant[]): string => {
  if (!nodes || nodes.length === 0) {
    return ''
  }

  return nodes
    .map((node) => {
      if (Node.isNode(node) && Element.isElement(node) && node.type === 'paragraph') {
        return node.children.map((child) => (Node.isNode(child) && Text.isText(child) ? child.text : '')).join('')
      }
      return ''
    })
    .join('\n')
}

/**
 * 验证并修复Slate节点结构
 */
export const validateSlateNodes = (nodes: Descendant[]): Descendant[] => {
  if (!nodes || nodes.length === 0) {
    return [{ type: 'paragraph' as const, children: [{ text: '' }] }]
  }

  return nodes.map((node) => {
    if (Node.isNode(node) && Element.isElement(node)) {
      return {
        ...node,
        children: node.children.length > 0 ? node.children : [{ text: '' }]
      }
    }
    return node
  })
}

/**
 * 计算文本统计信息
 */
export const calculateTextStats = (text: string) => {
  const lines = text.split('\n')
  const words = text.split(/\s+/).filter((word) => word.length > 0)
  const newlines = text.split('').filter((char) => char === '\n').length

  return {
    characters: text.length,
    lines: lines.length,
    words: words.length,
    newlines
  }
}
