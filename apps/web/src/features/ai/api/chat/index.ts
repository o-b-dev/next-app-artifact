import type { UIMessage } from 'ai'
import { convertToModelMessages, streamText } from 'ai'

import { getDeepSeekModel } from '../../utils'

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: UIMessage[] }

  const result = streamText({
    model: getDeepSeekModel(),
    messages: convertToModelMessages(messages)
  })

  return result.toUIMessageStreamResponse()
}
