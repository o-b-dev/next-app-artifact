import { Loader2, MapPin } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 位置工具组件
export default function GetLocationTool({ state, output, errorText }: Omit<ToolStateProps, 'callId' | 'input'>) {
  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在准备位置请求...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4" />
        正在获取位置信息...
      </div>
    ))
    .with('output-available', () => <div className="text-sm">位置: {String(output)}</div>)
    .with('output-error', () => (
      <div className="text-sm text-red-600 dark:text-red-400">获取位置时出错: {errorText}</div>
    ))
    .otherwise(() => null)
}
