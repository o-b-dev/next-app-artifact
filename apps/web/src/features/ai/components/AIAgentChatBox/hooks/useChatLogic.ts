import { useChatControl } from './useChatControl'
import { useChatState } from './useChatState'
import { useMessageActions } from './useMessageActions'

export function useChatLogic() {
  const {
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
  } = useChatState()

  const { handleSendMessage, handleRegenerate, handleRetry } = useMessageActions({
    messages,
    sendMessage,
    setError,
    setIsRetrying
  })

  const { handleStop, handleNewChat, handleAddToolResult } = useChatControl({
    status,
    stop,
    setMessages,
    setError,
    setIsRetrying,
    addToolResult
  })

  return {
    messages,
    status,
    error,
    isRetrying,
    handleSendMessage,
    handleStop,
    handleRegenerate,
    handleRetry,
    handleNewChat,
    handleAddToolResult
  }
}
