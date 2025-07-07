'use client'

import { Button } from '@workspace/ui/components/button'
import * as React from 'react'
import type { RunnerProps } from 'react-runner'
import { useRunner } from 'react-runner'

export interface ArtifactRenderProps extends RunnerProps {
  code: string
}

const scope = {
  import: {
    react: React,
    '@workspace/ui': {
      Button
    }
  }
}

// 加载动画组件
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500"></div>
        </div>
        <div className="animate-pulse text-sm text-zinc-500">正在渲染代码...</div>
      </div>
    </div>
  )
}

export default function ArtifactRender({ code }: ArtifactRenderProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const { element, error } = useRunner({
    code,
    scope
  })

  // 监听渲染状态
  React.useEffect(() => {
    if (element || error) {
      // 添加一个小延迟让加载动画更自然
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsLoading(true)
    }
  }, [element, error])

  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
      <h2 className="rounded-t-lg border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700">
        ✨ Artifact 渲染
      </h2>
      <div className="p-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">❌</div>
              <div className="text-sm font-medium text-red-700">渲染错误</div>
            </div>
            <div className="mt-2 rounded bg-red-100 p-2 font-mono text-sm text-red-600">{error}</div>
          </div>
        ) : (
          <div className="min-h-[100px]">{element}</div>
        )}
      </div>
    </div>
  )
}
