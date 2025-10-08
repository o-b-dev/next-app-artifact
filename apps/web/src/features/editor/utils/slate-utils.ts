import type { Descendant } from 'slate'
import { Element, Node, Text } from 'slate'

/**
 * 将字符串转换为Slate节点
 */
export const stringToSlateNodes = (text: string, prefix?: string): Descendant[] => {
  // 确保text不为null或undefined
  const safeText = text || ''

  const lines = safeText === '' ? [''] : safeText.split('\n')

  // 为每一行创建段落节点
  const paragraphs = lines.map((line, index) => {
    const children: any[] = []

    // 如果有 prefix 且是第一行，在行首添加 prefix 作为行内元素
    if (index === 0 && prefix) {
      children.push({
        type: 'prefix' as const,
        prefix,
        children: [{ text: '' }]
      })
    }

    // 添加文本内容
    children.push({ text: line || '' })

    return {
      type: 'paragraph' as const,
      children
    }
  })

  return paragraphs
}

/**
 * 将Slate节点转换为字符串（跳过 prefix 节点）
 */
export const slateNodesToString = (nodes: Descendant[]): string => {
  if (!nodes || nodes.length === 0) {
    return ''
  }

  return nodes
    .map((node) => {
      if (Node.isNode(node) && Element.isElement(node) && node.type === 'paragraph') {
        // 过滤掉 prefix 行内元素，只保留文本节点
        return node.children
          .filter((child) => {
            // 跳过 prefix 节点
            if (Node.isNode(child) && Element.isElement(child) && child.type === 'prefix') {
              return false
            }
            return true
          })
          .map((child) => (Node.isNode(child) && Text.isText(child) ? child.text : ''))
          .join('')
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
