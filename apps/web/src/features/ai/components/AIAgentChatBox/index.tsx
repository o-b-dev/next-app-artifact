'use client'

import { ChatInput } from './ChatInput'
import { ChatMessages } from './ChatMessages'
import { useChatLogic } from './hooks/useChatLogic'
import { PresetActions } from './PresetActions'

export default function AIAgentChatBox() {
  const {
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
  } = useChatLogic()

  // 预设操作点击
  const handlePresetAction = (prompt: string) => {
    void handleSendMessage(prompt)
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl flex-col">
      {/* 预设操作区域 */}
      {messages.length === 0 && (
        <PresetActions onActionClick={handlePresetAction} isDisabled={status === 'streaming'} />
      )}

      {/* 聊天消息区域 */}
      {messages.length !== 0 && (
        <ChatMessages
          messages={messages}
          status={status}
          error={error}
          onRegenerate={handleRegenerate}
          onAddToolResult={handleAddToolResult}
          onNewChat={handleNewChat}
        />
      )}

      {/* 固定输入区域 */}
      <ChatInput
        status={status}
        error={error}
        isRetrying={isRetrying}
        onSendMessage={handleSendMessage}
        onStop={handleStop}
        onRetry={handleRetry}
      />
    </div>
  )
}
