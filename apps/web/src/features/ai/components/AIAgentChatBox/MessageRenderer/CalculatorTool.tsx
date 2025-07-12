import { Calculator, Loader2 } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 计算器工具组件
export default function CalculatorTool({ state, input, output, errorText }: Omit<ToolStateProps, 'callId'>) {
  const expression = (input as { expression: string })?.expression

  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在准备计算...
      </div>
    ))
    .with('input-available', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Calculator className="h-4 w-4" />
        正在计算 {expression}...
      </div>
    ))
    .with('output-available', () => <div className="text-sm">计算结果: {String(output)}</div>)
    .with('output-error', () => <div className="text-sm text-red-600 dark:text-red-400">计算错误: {errorText}</div>)
    .otherwise(() => null)
}
