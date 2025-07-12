# AIAgentChatBox Hooks

这个目录包含了 AIAgentChatBox 组件的所有自定义 Hook，每个 Hook 都有明确的职责分工。

## Hook 结构

### 1. useChatState
**职责**: 管理聊天的基础状态
- 聊天消息列表
- 聊天状态（streaming, idle 等）
- 错误状态
- 重试状态
- 提供基础的聊天操作方法

### 2. useMessageActions
**职责**: 处理消息相关的操作
- 发送消息
- 重新生成消息
- 重试失败的消息

### 3. useChatControl
**职责**: 处理聊天控制操作
- 停止生成
- 新建聊天
- 工具结果处理

### 4. useToolActions
**职责**: 处理工具调用的相关操作
- 工具结果处理
- 确认/拒绝操作

### 5. useErrorHandling
**职责**: 处理错误状态和错误恢复
- 错误状态管理
- 错误清除
- 错误重试逻辑

### 6. useChatLogic
**职责**: 组合所有 Hook，提供统一的接口
- 组合所有子 Hook
- 提供完整的聊天功能接口

## 使用方式

```typescript
// 在组件中使用
import { useChatLogic } from './hooks/useChatLogic'

export function MyComponent() {
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
  
  // 使用这些方法和状态
}
```

## 设计原则

1. **单一职责**: 每个 Hook 只负责一个特定的功能领域
2. **可复用性**: Hook 之间松耦合，可以独立使用
3. **可测试性**: 每个 Hook 都可以独立测试
4. **可维护性**: 清晰的职责分工，便于维护和扩展 