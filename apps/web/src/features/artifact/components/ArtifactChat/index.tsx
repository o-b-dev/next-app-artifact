'use client'

import { useChat } from '@ai-sdk/react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useForm } from 'react-hook-form'

import Markdown from '@/features/markdown/components'

// 定义表单数据类型
interface MessageFormData {
  message: string
}

export default function ArtifactChat() {
  const { messages, sendMessage, stop } = useChat()

  // 初始化表单
  const form = useForm<MessageFormData>({
    defaultValues: {
      message: ''
    }
  })

  const handleSubmit = async (data: MessageFormData) => {
    // 基本验证
    if (!data.message.trim()) {
      form.setError('message', { message: '请输入消息内容' })
      return
    }

    if (data.message.length > 1000) {
      form.setError('message', { message: '消息长度不能超过1000个字符' })
      return
    }

    try {
      await sendMessage({
        text: data.message
      })
      form.reset() // 重置表单
    } catch (error) {
      console.error('发送消息失败:', error)
      form.setError('message', { message: '发送失败，请重试' })
    }
  }

  return (
    <div className="stretch mx-auto flex w-full flex-col gap-4 pb-24 pt-12">
      {messages.map((message) => (
        <div
          key={message.id}
          className="flex flex-col gap-2 whitespace-pre-wrap rounded border border-zinc-800 bg-zinc-900 p-2"
        >
          <strong className="border-zinc-750 border-b pb-2 text-sm text-zinc-400">
            {message.role === 'user' ? 'User: ' : 'AI: '}
          </strong>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return (
                  <div key={`${message.id}-${i}`}>
                    <Markdown content={part.text} />
                  </div>
                )
            }
          })}
        </div>
      ))}

      <div className="bg-background fixed bottom-0 left-1/2 w-full max-w-screen-lg -translate-x-1/2 p-4">
        <form onSubmit={(e) => void form.handleSubmit(handleSubmit)(e)} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="请输入您的消息..."
              {...form.register('message', {
                required: '请输入消息内容',
                maxLength: {
                  value: 1000,
                  message: '消息长度不能超过1000个字符'
                }
              })}
              className={form.formState.errors.message ? 'border-red-500' : ''}
              // 不需要自动填充
              autoComplete="off"
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-red-500">{form.formState.errors.message.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '发送中...' : '发送'}
            </Button>
            {form.formState.isSubmitting && (
              <Button type="button" variant="destructive" onClick={() => void stop()}>
                停止
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
