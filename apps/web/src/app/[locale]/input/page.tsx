'use client'

import { useState } from 'react'

import { EditorCard, TextPreview, TextStats, TextValueDisplay } from '@/features/editor'

export default function Page() {
  const [textValue, setTextValue] = useState<string>('欢迎使用Slate编辑器！\n开始输入您的文本...\n支持多行文本编辑')
  const [prefixValue, setTextWithPrefix] = useState<string>('这是带有 prefix 的编辑器示例')
  const [showPrefix, setShowPrefix] = useState(true)

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue)
  }

  const handlePrefixTextChange = (newValue: string) => {
    setTextWithPrefix(newValue)
  }

  const handlePrefixRemove = () => {
    setShowPrefix(false)
  }

  return (
    <div className="container mx-auto max-w-7xl p-3 sm:p-6">
      {/* 主编辑器 - 全宽 */}
      <div className="mb-4 sm:mb-6">
        <h2 className="mb-2 text-lg font-semibold">标准编辑器</h2>
        <EditorCard value={textValue} onChange={handleTextChange} placeholder="输入一些文本..." />
      </div>

      {/* 带 Prefix 的编辑器 */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">带 Prefix 的编辑器</h2>
          {!showPrefix && (
            <button
              onClick={() => setShowPrefix(true)}
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
            >
              显示 Prefix
            </button>
          )}
        </div>
        <EditorCard
          value={prefixValue}
          onChange={handlePrefixTextChange}
          placeholder="在 prefix 后输入文本..."
          prefix={showPrefix ? '提示：' : undefined}
          onPrefixRemove={handlePrefixRemove}
        />
        <p className="mt-2 text-xs text-gray-500">
          点击蓝色标签可以删除 prefix，prefix 始终保持在第一行最前方且不可编辑
        </p>
      </div>

      {/* 信息展示区域 - Grid布局 */}
      <div className="space-y-4 sm:space-y-6">
        {/* 标准编辑器信息展示 */}
        <div>
          <h3 className="mb-3 text-base font-semibold sm:text-lg">标准编辑器信息</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <TextValueDisplay text={textValue} />
            <TextPreview text={textValue} />
            <TextStats text={textValue} />
          </div>
        </div>

        {/* 带 Prefix 编辑器信息展示 */}
        <div>
          <h3 className="mb-3 text-base font-semibold sm:text-lg">带 Prefix 编辑器信息</h3>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            <TextValueDisplay text={prefixValue} />
            <TextPreview text={prefixValue} />
            <TextStats text={prefixValue} />
          </div>
        </div>
      </div>
    </div>
  )
}
