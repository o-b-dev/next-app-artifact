import type { Descendant } from 'slate'

export interface EditorTextAreaProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
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
