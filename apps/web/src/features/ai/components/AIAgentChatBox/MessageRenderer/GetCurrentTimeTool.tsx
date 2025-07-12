import { Clock, Loader2 } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 时间工具组件
export default function GetCurrentTimeTool({ state, output, errorText }: Omit<ToolStateProps, 'callId' | 'input'>) {
  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在获取时间信息...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        正在查询当前时间...
      </div>
    ))
    .with('output-available', () => <div className="text-sm">当前时间: {String(output)}</div>)
    .with('output-error', () => (
      <div className="text-sm text-red-600 dark:text-red-400">获取时间时出错: {errorText}</div>
    ))
    .otherwise(() => null)
}
