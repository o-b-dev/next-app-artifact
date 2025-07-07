'use client'

import { useEffect, useState } from 'react'

import ArtifactRender from '@/components/ArtifactRender'

interface ArtifactMessage {
  type: 'ARTIFACT_CODE'
  code: string
}

function isArtifactMessage(data: unknown): data is ArtifactMessage {
  return (
    data !== null &&
    typeof data === 'object' &&
    'type' in data &&
    'code' in data &&
    (data as Record<string, unknown>).type === 'ARTIFACT_CODE' &&
    typeof (data as Record<string, unknown>).code === 'string'
  )
}

export default function Home() {
  const [code, setCode] = useState('<div>等待接收代码...</div>')

  useEffect(() => {
    // 向父窗口发送准备就绪信号
    const notifyParentReady = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'IFRAME_READY'
          },
          'http://localhost:3001'
        )
      }
    }

    // 页面加载完成后发送准备信号
    notifyParentReady()

    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源（可选，增加安全性）
      if (event.origin !== 'http://localhost:3001') {
        return
      }

      // 检查消息类型和结构
      if (isArtifactMessage(event.data)) {
        setCode(event.data.code)
      }
    }

    // 添加消息监听器
    window.addEventListener('message', handleMessage)

    // 清理函数
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Artifact Preview Ifreme</h1>

      <ArtifactRender code={code} />
    </div>
  )
}
