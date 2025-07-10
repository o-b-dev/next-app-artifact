import type { UIMessage } from 'ai'
import { convertToModelMessages, smoothStream, streamText } from 'ai'

import { withAIErrorHandling } from '../../middleware'
import { getGoogleModel } from '../../utils/model'

export const POST = withAIErrorHandling(async (req: Request) => {
  const { messages } = (await req.json()) as { messages: UIMessage[] }

  const result = streamText({
    model: getGoogleModel(),
    system: `No markdown formatting, give me the answer in plain text.`,
    messages: convertToModelMessages(messages),

    experimental_transform: smoothStream({
      delayInMs: 25,
      chunking: (buffer: string) => {
        if (buffer.length === 0) return null

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
    })
  })

  return result.toUIMessageStreamResponse()
})
