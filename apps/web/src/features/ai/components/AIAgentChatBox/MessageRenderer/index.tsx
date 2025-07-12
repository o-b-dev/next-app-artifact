import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { RotateCcw } from 'lucide-react'
import { match, P } from 'ts-pattern'

import Markdown from '@/features/markdown/components'

import AskForConfirmationTool from './AskForConfirmationTool'
import CalculatorTool from './CalculatorTool'
import GetCurrentTimeTool from './GetCurrentTimeTool'
import GetLocationTool from './GetLocationTool'
import GetWeatherTool from './GetWeatherTool'
import type { MessagePartRendererProps, MessageRendererProps, RegenerateButtonProps, ToolRendererProps } from './types'

function ToolRenderer({ part, onAddToolResult }: ToolRendererProps) {
  // 类型守卫：确保这是一个工具类型的消息部分
  if (!('toolCallId' in part) || !('state' in part)) {
    return null
  }

  const toolProps = {
    callId: part.toolCallId,
    state: part.state,
    input: part.input,
    output: part.output,
    errorText: part.errorText,
    onAddToolResult
  }

  return match(part)
    .with({ type: 'tool-askForConfirmation' }, () => <AskForConfirmationTool {...toolProps} />)
    .with({ type: 'tool-getLocation' }, () => <GetLocationTool {...toolProps} />)
    .with({ type: 'tool-getWeatherInformation' }, () => <GetWeatherTool {...toolProps} />)
    .with({ type: 'tool-calculator' }, () => <CalculatorTool {...toolProps} />)
    .with({ type: 'tool-getCurrentTime' }, () => <GetCurrentTimeTool {...toolProps} />)
    .otherwise(() => null)
}

function MessagePartRenderer({ part, index, onAddToolResult }: MessagePartRendererProps) {
  return match(part)
    .with({ type: 'step-start' }, () =>
      index > 0 ? <div key={index} className="my-4 border-t border-gray-200 dark:border-gray-700" /> : null
    )
    .with({ type: 'text' }, () => {
      // 类型守卫：确保这是一个文本类型的消息部分
      if (!('text' in part)) {
        return null
      }
      return (
        <div key={index} className="text-sm leading-relaxed">
          <Markdown content={part.text} />
        </div>
      )
    })
    .with(
      P.union(
        { type: 'tool-askForConfirmation' },
        { type: 'tool-getLocation' },
        { type: 'tool-getWeatherInformation' },
        { type: 'tool-calculator' },
        { type: 'tool-getCurrentTime' }
      ),
      () => <ToolRenderer key={index} part={part} onAddToolResult={onAddToolResult} />
    )
    .otherwise(() => null)
}

function RegenerateButton({
  message,
  messageIndex,
  totalMessages,
  status,
  error,
  onRegenerate
}: RegenerateButtonProps) {
  const shouldShow =
    message.role === 'assistant' && messageIndex === totalMessages - 1 && status !== 'streaming' && !error

  if (!shouldShow) return null

  return (
    <div className="pl-4 pt-2">
      <Button size="sm" variant="outline" onClick={onRegenerate} className="flex items-center gap-1">
        <RotateCcw className="h-3 w-3" />
        重新生成
      </Button>
    </div>
  )
}

export function MessageRenderer({
  message,
  messageIndex,
  totalMessages,
  status,
  error,
  onRegenerate,
  onAddToolResult
}: MessageRendererProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
          {message.role === 'user' ? '用户' : 'AI'}
        </Badge>
      </div>

      <div className="space-y-2 pl-4">
        {message.parts.map((part, index) => (
          <MessagePartRenderer key={index} part={part} index={index} onAddToolResult={onAddToolResult} />
        ))}
      </div>

      <RegenerateButton
        message={message}
        messageIndex={messageIndex}
        totalMessages={totalMessages}
        status={status}
        error={error}
        onRegenerate={onRegenerate}
      />
    </div>
  )
}
