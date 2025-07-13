import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import type { ChatStatus } from 'ai'
import { AlertCircle, Loader2, Send, Square } from 'lucide-react'
import { useState } from 'react'

interface ChatInputProps {
  status: ChatStatus
  error: string | null
  isRetrying: boolean
  onSendMessage: (text: string) => Promise<void> | void
  onStop: () => Promise<void> | void
  onRetry: () => Promise<void> | void
}

export function ChatInput({ status, error, isRetrying, onSendMessage, onStop, onRetry }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('') // 发送后立即清空输入框
    }
  }

  const renderInputButton = () => {
    if (status === 'streaming' || status === 'submitted') {
      return (
        <Button type="button" onClick={onStop} className="flex items-center gap-1">
          <Square className="h-4 w-4" />
          停止
        </Button>
      )
    }

    if (error) {
      return (
        <Button type="button" onClick={onRetry} className="flex items-center gap-1">
          {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4" />}
          重试
        </Button>
      )
    }

    return (
      <Button type="submit">
        <Send className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="bg-background border-border fixed bottom-0 left-0 w-full border-t p-4 pt-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="输入您的问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status === 'streaming'}
          className="flex-1"
        />
        {renderInputButton()}
      </form>
    </div>
  )
}
