import { Loader2, Search } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 搜索工具组件
export default function WebSerchTool({ state, output, errorText }: Omit<ToolStateProps, 'callId' | 'input'>) {
  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在准备搜索请求...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Search className="h-4 w-4" />
        正在搜索网络信息...
      </div>
    ))
    .with('output-available', () => (
      <div className="text-sm">{`搜索到 ${(output as { sources: { url: string }[] })?.sources?.length} 条结果`}</div>
    ))
    .with('output-error', () => (
      <div className="text-sm text-red-600 dark:text-red-400">获取搜索结果时出错: {errorText}</div>
    ))
    .otherwise(() => null)
}
