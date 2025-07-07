'use client'

import { cn } from '@workspace/ui/lib/utils'
import { useEffect, useRef, useState } from 'react'
import type { RunnerProps } from 'react-runner'

export interface ArtifactRenderProps extends RunnerProps {
  code: string
}

interface IframeReadyMessage {
  type: 'IFRAME_READY'
}

function isIframeReadyMessage(data: unknown): data is IframeReadyMessage {
  return (
    data !== null &&
    typeof data === 'object' &&
    'type' in data &&
    (data as Record<string, unknown>).type === 'IFRAME_READY'
  )
}

export default function ArtifactRender({ code }: ArtifactRenderProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isIframeReady, setIsIframeReady] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 验证消息来源
      if (event.origin !== 'http://localhost:3000') {
        return
      }

      // 检查是否是 iframe 准备就绪消息
      if (isIframeReadyMessage(event.data)) {
        setIsIframeReady(true)
      }
    }

    // 监听来自 iframe 的消息
    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    if (isIframeReady && iframeRef.current && code) {
      // iframe 准备好后发送代码
      iframeRef.current.contentWindow?.postMessage(
        {
          type: 'ARTIFACT_CODE',
          code: code
        },
        'http://localhost:3000'
      )
    }
  }, [isIframeReady, code])

  return (
    <div className="w-full rounded border border-zinc-500 bg-zinc-900 p-4">
      <p className={cn('flex min-h-[70vh] w-full items-center justify-center text-center', isIframeReady && 'hidden')}>
        loading...
      </p>
      <iframe
        ref={iframeRef}
        src="http://localhost:3000"
        className={cn('min-h-[70vh] w-full', !isIframeReady && 'hidden')}
        title="Artifact Preview"
      />
    </div>
  )
}
