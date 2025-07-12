import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'

export function useChatState() {
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

  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  return {
    messages,
    status,
    error,
    isRetrying,
    sendMessage,
    addToolResult,
    stop,
    setMessages,
    setError,
    setIsRetrying
  }
}
