import type { UIMessage } from 'ai'

import type { MessagePart, ToolResultParams } from '../types'

// 工具状态组件
export interface ToolStateProps {
  callId: string
  state: string
  input?: unknown
  output?: unknown
  errorText?: string
  onAddToolResult: (params: ToolResultParams) => void
}

// 工具渲染器组件
export interface ToolRendererProps {
  part: MessagePart
  onAddToolResult: (params: ToolResultParams) => void
}

// 消息部分渲染器组件
export interface MessagePartRendererProps {
  part: MessagePart
  index: number
  onAddToolResult: (params: ToolResultParams) => void
}

// 重新生成按钮组件
export interface RegenerateButtonProps {
  message: UIMessage
  messageIndex: number
  totalMessages: number
  status: string
  error: string | null
  onRegenerate: () => void
}

// 主消息渲染器组件
export interface MessageRendererProps {
  message: UIMessage
  messageIndex: number
  totalMessages: number
  status: string
  error: string | null
  onRegenerate: () => void
  onAddToolResult: (params: ToolResultParams) => void
}
