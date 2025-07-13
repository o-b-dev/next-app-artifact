import type { UIMessage } from 'ai'

// 预设操作配置类型
export interface PresetAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  prompt: string
  color: string
}

// 消息部分的类型
export type MessagePart = UIMessage['parts'][number]

// 工具结果参数类型
export interface ToolResultParams {
  toolCallId: string
  output: string
}
