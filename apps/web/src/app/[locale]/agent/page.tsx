'use client'

import AIAgentChatBox from '@/features/ai/components/AIAgentChatBox'

export default function AgentPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI 智能助手</h1>
        <p className="text-muted-foreground mt-2">与AI助手进行智能对话，获取天气信息、位置服务等</p>
      </div>
      <AIAgentChatBox />
    </div>
  )
}
