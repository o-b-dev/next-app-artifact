import type { UIMessage } from 'ai'
import { convertToModelMessages, smoothStream, stepCountIs, streamText } from 'ai'
import z from 'zod'

import { withAIErrorHandling } from '../../middleware'
import { getGoogleModel } from '../../utils/model'
import { tools } from '../../utils/tools'

// 输入验证模式
const requestSchema = z.object({
  messages: z.array(z.unknown()).min(1, '至少需要一条消息'),
  options: z
    .object({
      maxSteps: z.number().min(1).max(10).optional().default(5),
      temperature: z.number().min(0).max(2).optional().default(0.7)
    })
    .optional()
    .default({})
})

export const POST = withAIErrorHandling(async (req: Request) => {
  try {
    // 验证请求方法
    if (req.method !== 'POST') {
      return new Response('只支持 POST 请求', { status: 405 })
    }

    // 解析和验证请求体
    const body = (await req.json()) as unknown
    const validatedData = requestSchema.parse(body)
    const { messages, options } = validatedData

    // 检查消息数量限制
    if (messages.length > 100) {
      return new Response('消息数量超过限制', { status: 400 })
    }

    // 获取模型配置
    const model = getGoogleModel()

    // 创建流式响应
    const result = streamText({
      model,
      system: `你是一个智能AI助手，具有以下特点：
                1. 始终用中文回复
                2. 回答要准确、有用、友好
                3. 使用工具时要先询问用户确认
                4. 天气查询支持中文城市名称
                5. 位置获取需要用户授权
                6. 回答要简洁明了，避免冗长
                7. 可以使用计算器进行数学计算
                8. 可以查询当前时间信息
                9. 图片生成规则：
                   - 当使用图片生成工具时，必须使用 Markdown 格式显示图片
                   - 格式：![图片描述](图片URL)
                   - 示例：![生成的图片](http://localhost:8001/generated-images/generated-1234567890-abc123.png)
                   - 不要只返回URL，必须用完整的Markdown图片语法
                   - 图片描述应该简洁描述图片内容
                10. 搜索功能规则：
                    - 当使用搜索工具时，必须保留并显示所有原文链接
                    - 搜索结果要包含完整的标题、摘要和链接
                    - 所有链接必须使用 Markdown 格式：[标题](链接)
                    - 引用信息时要注明来源链接
                    - 如果搜索结果包含即时答案，优先展示
                    - 确保所有链接都是可点击的完整URL
                    - 不要只显示纯文本链接，必须使用 Markdown 链接格式`,
      messages: convertToModelMessages(messages as UIMessage[]),
      temperature: options.temperature,
      experimental_transform: smoothStream({
        delayInMs: 20, // 稍微减少延迟，提升响应速度
        chunking: (buffer: string) => {
          if (buffer.length === 0) return null

          // 智能分块策略
          // 优先在标点符号处分割
          const punctuationIndex = buffer.search(/[。！？，；：]/)
          if (punctuationIndex > 0 && punctuationIndex <= 8) {
            return buffer.slice(0, punctuationIndex + 1)
          }

          // 优先在空格处分割（英文）
          const spaceIndex = buffer.indexOf(' ')
          if (spaceIndex > 0 && spaceIndex <= 6) {
            return buffer.slice(0, spaceIndex + 1)
          }

          // 根据文本长度动态调整分割大小
          let chunkSize: number
          if (buffer.length <= 3) {
            chunkSize = buffer.length // 短文本直接返回
          } else if (buffer.length <= 10) {
            chunkSize = Math.min(3, buffer.length) // 中等文本，每次2-3个字符
          } else {
            // 长文本使用更小的分割，确保平滑
            chunkSize = Math.min(2, buffer.length)
          }

          return buffer.slice(0, chunkSize)
        }
      }),
      tools,
      stopWhen: stepCountIs(options.maxSteps)
    })

    // 返回流式响应
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Agent API 错误:', error)

    // 处理验证错误
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: '请求参数验证失败',
          details: error.errors
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // 处理其他错误
    return new Response(
      JSON.stringify({
        error: '服务器内部错误',
        message: error instanceof Error ? error.message : '未知错误'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
