import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { RotateCcw } from 'lucide-react'
import { memo } from 'react'
import { match, P } from 'ts-pattern'

import Markdown from '@/features/markdown/components'

import AskForConfirmationTool from './AskForConfirmationTool'
import CalculatorTool from './CalculatorTool'
import GenerateImageTool from './GenerateImageTool'
import GetCurrentTimeTool from './GetCurrentTimeTool'
import GetLocationTool from './GetLocationTool'
import GetWeatherTool from './GetWeatherTool'
import type { MessagePartRendererProps, MessageRendererProps, RegenerateButtonProps, ToolRendererProps } from './types'

const ToolRenderer = memo(({ part, onAddToolResult }: ToolRendererProps) => {
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
    .with({ type: 'tool-generateImage' }, () => <GenerateImageTool {...toolProps} />)
    .otherwise(() => null)
})

ToolRenderer.displayName = 'ToolRenderer'

const MessagePartRenderer = memo(({ part, index, onAddToolResult }: MessagePartRendererProps) => {
  const type = part.type
  return match(type)
    .with('step-start', () => index > 0 && <Separator key={index} className="my-4" />)
    .with('text', () => {
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
        'tool-askForConfirmation',
        'tool-getLocation',
        'tool-getWeatherInformation',
        'tool-calculator',
        'tool-getCurrentTime',
        'tool-generateImage'
      ),
      () => <ToolRenderer key={index} part={part} onAddToolResult={onAddToolResult} />
    )
    .otherwise(() => null)
})

MessagePartRenderer.displayName = 'MessagePartRenderer'

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
    <div className="pl-4">
      <Button size="sm" variant="secondary" onClick={onRegenerate} className="flex items-center gap-1 py-1 text-xs">
        <RotateCcw className="size-3" />
        重新生成
      </Button>
    </div>
  )
}

export const MessageRenderer = memo(
  ({ message, messageIndex, totalMessages, status, error, onRegenerate, onAddToolResult }: MessageRendererProps) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
            {message.role === 'user' ? '用户' : 'AI'}
          </Badge>

          <RegenerateButton
            message={message}
            messageIndex={messageIndex}
            totalMessages={totalMessages}
            status={status}
            error={error}
            onRegenerate={onRegenerate}
          />
        </div>

        <div className="space-y-2 pl-4">
          {message.parts.map((part, index) => (
            <MessagePartRenderer key={index} part={part} index={index} onAddToolResult={onAddToolResult} />
          ))}
        </div>
      </div>
    )
  }
)

MessageRenderer.displayName = 'MessageRenderer'
