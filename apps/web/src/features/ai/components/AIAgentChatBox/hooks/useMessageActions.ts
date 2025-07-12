import type { UIMessage } from 'ai'
import { useCallback } from 'react'

interface UseMessageActionsProps {
  messages: UIMessage[]
  sendMessage: (message: { text: string }) => Promise<void>
  setError: (error: string | null) => void
  setIsRetrying: (isRetrying: boolean) => void
}

export function useMessageActions({ messages, sendMessage, setError, setIsRetrying }: UseMessageActionsProps) {
  const handleSendMessage = useCallback(
    async (text: string) => {
      setError(null)
      try {
        await sendMessage({ text })
      } catch {
        setError('发送消息失败，请重试')
      }
    },
    [sendMessage, setError]
  )

  const handleRegenerate = useCallback(() => {
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
  }, [messages, sendMessage, setError])

  const handleRetry = useCallback(async () => {
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
  }, [messages, sendMessage, setError, setIsRetrying])

  return {
    handleSendMessage,
    handleRegenerate,
    handleRetry
  }
}
