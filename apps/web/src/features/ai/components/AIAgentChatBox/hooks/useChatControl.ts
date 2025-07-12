import type { UIMessage } from 'ai'
import { useCallback } from 'react'

interface UseChatControlProps {
  status: string
  stop: () => void
  setMessages: (messages: UIMessage[]) => void
  setError: (error: string | null) => void
  setIsRetrying: (isRetrying: boolean) => void
  addToolResult: (params: { toolCallId: string; output: string }) => void
}

export function useChatControl({
  status,
  stop,
  setMessages,
  setError,
  setIsRetrying,
  addToolResult
}: UseChatControlProps) {
  const handleStop = useCallback(() => {
    void stop()
  }, [stop])

  const handleNewChat = useCallback(() => {
    // 重置所有状态
    setMessages([])
    setError(null)
    setIsRetrying(false)
    // 停止当前生成（如果有的话）
    if (status === 'streaming') {
      void stop()
    }
  }, [status, stop, setMessages, setError, setIsRetrying])

  const handleAddToolResult = useCallback(
    (params: { toolCallId: string; output: string }) => {
      void addToolResult(params)
    },
    [addToolResult]
  )

  return {
    handleStop,
    handleNewChat,
    handleAddToolResult
  }
}
