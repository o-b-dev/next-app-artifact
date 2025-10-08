'use client'

import { useState } from 'react'

import { EditorCard, TextPreview, TextStats, TextValueDisplay } from '@/features/editor'

export default function Page() {
  const [textValue, setTextValue] = useState<string>('欢迎使用Slate编辑器！\n开始输入您的文本...\n支持多行文本编辑')

  const handleTextChange = (newValue: string) => {
    setTextValue(newValue)
  }

  return (
    <div className="container mx-auto max-w-7xl p-3 sm:p-6">
      {/* 主编辑器 - 全宽 */}
      <div className="mb-4 sm:mb-6">
        <EditorCard value={textValue} onChange={handleTextChange} placeholder="输入一些文本..." />
      </div>

      {/* 信息展示区域 - Grid布局 */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {/* 文本值展示卡片 */}
        <TextValueDisplay text={textValue} />

        {/* 文本预览卡片 */}
        <TextPreview text={textValue} />

        {/* 统计信息卡片 */}
        <TextStats text={textValue} />
      </div>
    </div>
  )
}
