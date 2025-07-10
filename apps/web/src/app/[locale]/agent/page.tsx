'use client'

import AIChatBox from '@/features/ai/components/AIChatBox'

export default function AgentPage() {
  return (
    <>
      <h3 className="text-2xl font-bold">Agent</h3>
      <AIChatBox autoScroll messageBoxClassName="border-none bg-transparent" chatApi="/api/agent" />
    </>
  )
}
