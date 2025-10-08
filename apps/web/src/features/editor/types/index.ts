import type { Descendant } from 'slate'

export interface EditorTextAreaProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  prefix?: string // 可选的 prefix 文本
  onPrefixRemove?: () => void // 删除 prefix 的回调
}

export interface TextStatsProps {
  text: string
}

export interface TextPreviewProps {
  text: string
}

export interface TextValueDisplayProps {
  text: string
}

export type SlateNode = Descendant
