'use client'

import { useChat } from '@ai-sdk/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'
import {
  AlertCircle,
  Calculator,
  Clock,
  Cloud,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Square
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Markdown from '@/features/markdown/components'

// 预设操作配置
const presetActions = [
  {
    id: 'weather',
    title: '查询天气',
    description: '获取指定城市的天气信息',
    icon: Cloud,
    prompt: '请帮我查询北京的天气情况',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'location',
    title: '获取位置',
    description: '获取用户当前位置信息',
    icon: MapPin,
    prompt: '请帮我获取当前位置信息',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'chat',
    title: '智能对话',
    description: '与AI进行自然语言对话',
    icon: MessageSquare,
    prompt: '你好，请介绍一下你自己',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'creative',
    title: '创意助手',
    description: '获取创意灵感和建议',
    icon: Sparkles,
    prompt: '请给我一些关于产品设计的创意建议',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'calculator',
    title: '计算器',
    description: '执行数学计算',
    icon: Calculator,
    prompt: '请帮我计算 25 * 4 + 100 / 2',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'time',
    title: '时间查询',
    description: '获取当前时间信息',
    icon: Clock,
    prompt: '请告诉我现在的时间',
    color: 'bg-teal-500 hover:bg-teal-600'
  }
]

// 定义消息部分的类型
type MessagePart = UIMessage['parts'][0]

export default function AIAgentChatBox() {
  const { messages, sendMessage, addToolResult, status, stop, setMessages } = useChat({
    maxSteps: 5,
    transport: new DefaultChatTransport({
      api: '/api/agent'
    }),

    // run client-side tools that are automatically executed:
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['北京', '上海', '广州', '深圳', '杭州']
        return cities[Math.floor(Math.random() * cities.length)]
      }
    }
  })

  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handlePresetAction = (prompt: string) => {
    setInput(prompt)
    setError(null)
    sendMessage({ text: prompt }).catch(() => {
      setError('发送消息失败，请重试')
    })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setError(null)
      sendMessage({ text: input }).catch(() => {
        setError('发送消息失败，请重试')
      })
      setInput('') // 发送后立即清空输入框
    }
  }

  const handleStop = () => {
    void stop()
  }

  const handleRegenerate = () => {
    setError(null)
    // 重新发送最后一条用户消息
    const lastUserMessage = messages.filter((msg) => msg.role === 'user').pop()

    if (lastUserMessage) {
      const textPart = lastUserMessage.parts.find((part) => part.type === 'text')
      if (textPart && 'text' in textPart) {
        sendMessage({ text: textPart.text }).catch(() => {
          setError('重新生成失败，请重试')
        })
      }
    }
  }

  const handleRetry = async () => {
    if (!error) return

    setIsRetrying(true)
    setError(null)

    try {
      // 重新发送最后一条用户消息
      const lastUserMessage = messages.filter((msg) => msg.role === 'user').pop()

      if (lastUserMessage) {
        const textPart = lastUserMessage.parts.find((part) => part.type === 'text')
        if (textPart && 'text' in textPart) {
          await sendMessage({ text: textPart.text })
        }
      }
    } catch {
      setError('重试失败，请稍后再试')
    } finally {
      setIsRetrying(false)
    }
  }

  const handleNewChat = () => {
    // 重置所有状态
    setMessages([])
    setInput('')
    setError(null)
    setIsRetrying(false)
    // 停止当前生成（如果有的话）
    if (status === 'streaming') {
      void stop()
    }
  }

  const renderMessagePart = (part: MessagePart, index: number) => {
    switch (part.type) {
      case 'step-start':
        return index > 0 ? <div key={index} className="my-4 border-t border-gray-200 dark:border-gray-700" /> : null

      case 'text':
        return (
          <div key={index} className="text-sm leading-relaxed">
            <Markdown content={part.text} />
          </div>
        )

      case 'tool-askForConfirmation': {
        const callId = part.toolCallId

        switch (part.state) {
          case 'input-streaming':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在准备确认请求...
              </div>
            )
          case 'input-available':
            return (
              <div key={callId} className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-3 text-sm">{(part.input as { message: string })?.message}</div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      void addToolResult({
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
                      void addToolResult({
                        toolCallId: callId,
                        output: 'No, denied'
                      })
                    }
                  >
                    拒绝
                  </Button>
                </div>
              </div>
            )
          case 'output-available':
            return (
              <div key={callId} className="text-sm text-green-600 dark:text-green-400">
                位置访问已允许: {part.output as string}
              </div>
            )
          case 'output-error':
            return (
              <div key={callId} className="text-sm text-red-600 dark:text-red-400">
                错误: {part.errorText}
              </div>
            )
        }
        break
      }

      case 'tool-getLocation': {
        const callId = part.toolCallId

        switch (part.state) {
          case 'input-streaming':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在准备位置请求...
              </div>
            )
          case 'input-available':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                正在获取位置信息...
              </div>
            )
          case 'output-available':
            return (
              <div key={callId} className="text-sm">
                位置: {String(part.output)}
              </div>
            )
          case 'output-error':
            return (
              <div key={callId} className="text-sm text-red-600 dark:text-red-400">
                获取位置时出错: {part.errorText}
              </div>
            )
        }
        break
      }

      case 'tool-getWeatherInformation': {
        const callId = part.toolCallId

        switch (part.state) {
          case 'input-streaming':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在准备天气查询...
              </div>
            )
          case 'input-available':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Cloud className="h-4 w-4" />
                正在获取 {(part.input as { city: string })?.city} 的天气信息...
              </div>
            )
          case 'output-available':
            return (
              <div key={callId} className="text-sm">
                {(part.input as { city: string })?.city} 的天气: {String(part.output)}
              </div>
            )
          case 'output-error':
            return (
              <div key={callId} className="text-sm text-red-600 dark:text-red-400">
                获取 {(part.input as { city: string })?.city} 天气时出错: {part.errorText}
              </div>
            )
        }
        break
      }

      case 'tool-calculator': {
        const callId = part.toolCallId

        switch (part.state) {
          case 'input-streaming':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在准备计算...
              </div>
            )
          case 'input-available':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Calculator className="h-4 w-4" />
                正在计算 {(part.input as { expression: string })?.expression}...
              </div>
            )
          case 'output-available':
            return (
              <div key={callId} className="text-sm">
                计算结果: {String(part.output)}
              </div>
            )
          case 'output-error':
            return (
              <div key={callId} className="text-sm text-red-600 dark:text-red-400">
                计算错误: {part.errorText}
              </div>
            )
        }
        break
      }

      case 'tool-getCurrentTime': {
        const callId = part.toolCallId

        switch (part.state) {
          case 'input-streaming':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在获取时间信息...
              </div>
            )
          case 'input-available':
            return (
              <div key={callId} className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                正在查询当前时间...
              </div>
            )
          case 'output-available':
            return (
              <div key={callId} className="text-sm">
                当前时间: {String(part.output)}
              </div>
            )
          case 'output-error':
            return (
              <div key={callId} className="text-sm text-red-600 dark:text-red-400">
                获取时间时出错: {part.errorText}
              </div>
            )
        }
        break
      }
    }
  }

  // 渲染操作按钮（仅用于输入框旁边）
  const renderInputButton = () => {
    if (status === 'streaming') {
      return (
        <Button type="button" onClick={handleStop} className="flex items-center gap-1">
          <Square className="h-4 w-4" />
          停止
        </Button>
      )
    }

    if (error) {
      return (
        <Button type="button" onClick={() => void handleRetry()} className="flex items-center gap-1">
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
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      {/* 预设操作区域 */}
      {messages.length === 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {presetActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="flex h-auto flex-col items-start gap-2 p-4 text-left"
                    onClick={() => handlePresetAction(action.prompt)}
                    disabled={status === 'streaming'}
                  >
                    <div className="flex w-full items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-muted-foreground text-xs">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 聊天消息区域 */}
      {messages.length !== 0 && (
        <Card className="mb-4 flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <CardTitle className="text-base">AI 助手</CardTitle>
                {status === 'streaming' && (
                  <Badge variant="secondary" className="text-xs">
                    正在思考...
                  </Badge>
                )}
              </div>

              {/* New Chat 按钮 */}
              {messages.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNewChat}
                  className="flex items-center gap-1"
                  disabled={status === 'streaming'}
                >
                  <Plus className="h-3 w-3" />
                  新建聊天
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[calc(100vh-300px)] pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <p>开始与AI助手对话，或选择上方的预设操作</p>
                  </div>
                ) : (
                  messages.map((message, messageIndex) => (
                    <div key={message.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                          {message.role === 'user' ? '用户' : 'AI'}
                        </Badge>
                      </div>
                      <div className="space-y-2 pl-4">
                        {message.parts.map((part, index) => renderMessagePart(part, index))}
                      </div>

                      {/* 在AI消息下方显示重新生成按钮 */}
                      {message.role === 'assistant' &&
                        messageIndex === messages.length - 1 &&
                        status !== 'streaming' &&
                        !error && (
                          <div className="pl-4 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleRegenerate}
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              重新生成
                            </Button>
                          </div>
                        )}
                    </div>
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
      )}

      {/* 固定输入区域 */}
      <div className="bg-background border-border fixed bottom-0 left-0 w-full border-t p-4 pt-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
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
    </div>
  )
}
