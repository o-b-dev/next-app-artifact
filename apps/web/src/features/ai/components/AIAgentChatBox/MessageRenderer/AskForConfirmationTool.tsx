import { Button } from '@workspace/ui/components/button'
import { Loader2 } from 'lucide-react'
import { match } from 'ts-pattern'

import type { ToolStateProps } from './types'

// 确认工具组件
export default function AskForConfirmationTool({
  callId,
  state,
  input,
  output,
  errorText,
  onAddToolResult
}: ToolStateProps) {
  return match(state)
    .with('input-streaming', () => (
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在准备确认请求...
      </div>
    ))
    .with('input-available', () => (
      <div className="space-y-3">
        <div className="bg-muted/50 rounded-lg p-3 text-sm">{(input as { message: string })?.message}</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              void onAddToolResult({
                toolCallId: callId,
                output: 'Yes, confirmed.'
              })
            }
          >
            确认
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void onAddToolResult({
                toolCallId: callId,
                output: 'No, denied'
              })
            }
          >
            拒绝
          </Button>
        </div>
      </div>
    ))
    .with('output-available', () => (
      <div className="text-sm text-green-600 dark:text-green-400">位置访问已允许: {output as string}</div>
    ))
    .with('output-error', () => <div className="text-sm text-red-600 dark:text-red-400">错误: {errorText}</div>)
    .otherwise(() => null)
}
