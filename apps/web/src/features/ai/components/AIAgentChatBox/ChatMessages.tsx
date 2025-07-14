import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import type { ChatStatus, UIMessage } from 'ai'
import { AlertCircle, MessageSquare, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { MessageRenderer } from './MessageRenderer'
import type { ToolResultParams } from './types'

interface ChatMessagesProps {
  messages: UIMessage[]
  status: ChatStatus
  error: string | null
  onRegenerate: () => void
  onAddToolResult: (params: ToolResultParams) => void
  onNewChat: () => void
}

export function ChatMessages({ messages, status, error, onRegenerate, onAddToolResult, onNewChat }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <Card className="mb-4 flex-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <CardTitle className="text-base">AI 助手</CardTitle>
            {status === 'streaming' && (
              <Badge variant="secondary" className="text-xs">
                正在输出...
              </Badge>
            )}
          </div>

          {/* New Chat 按钮 */}
          {messages.length > 0 && (
            <Button onClick={onNewChat} disabled={status === 'streaming'}>
              <Plus className="h-3 w-3" />
              新建聊天
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>开始与AI助手对话，或选择上方的预设操作</p>
              </div>
            ) : (
              messages.map((message, messageIndex) => (
                <MessageRenderer
                  key={message.id}
                  message={message}
                  messageIndex={messageIndex}
                  totalMessages={messages.length}
                  status={status}
                  error={error}
                  onRegenerate={onRegenerate}
                  onAddToolResult={onAddToolResult}
                />
              ))
            )}

            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
