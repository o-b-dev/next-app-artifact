import { Cloud, Loader2 } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 天气工具组件
export default function GetWeatherTool({ state, input, output, errorText }: Omit<ToolStateProps, 'callId'>) {
  const city = (input as { city: string })?.city

  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在准备天气查询...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Cloud className="h-4 w-4" />
        正在获取 {city} 的天气信息...
      </div>
    ))
    .with('output-available', () => (
      <div className="text-sm">
        {city} 的天气: {String(output)}
      </div>
    ))
    .with('output-error', () => (
      <div className="text-sm text-red-600 dark:text-red-400">
        获取 {city} 天气时出错: {errorText}
      </div>
    ))
    .otherwise(() => null)
}
