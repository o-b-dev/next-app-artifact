import { Clock, Loader2 } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 图片生成工具组件
export default function GenerateImageTool({ state, output, errorText }: Omit<ToolStateProps, 'callId' | 'input'>) {
  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在生成图片...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Clock className="h-4 w-4" />
        正在生成图片...
      </div>
    ))
    .with('output-available', () => (
      <div className="text-sm">图片生成成功: {String((output as { imageUrl: string }).imageUrl)}</div>
    ))
    .with('output-error', () => (
      <div className="text-sm text-red-600 dark:text-red-400">图片生成时出错: {errorText}</div>
    ))
    .otherwise(() => null)
}
