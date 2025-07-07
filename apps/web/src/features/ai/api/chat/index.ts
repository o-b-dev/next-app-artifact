import type { UIMessage } from 'ai'
import { convertToModelMessages, streamText } from 'ai'

import { withAIErrorHandling } from '../../middleware'
import { getGoogleModel } from '../../utils/model'

export const POST = withAIErrorHandling(async (req: Request) => {
  const { messages } = (await req.json()) as { messages: UIMessage[] }

  const result = streamText({
    model: getGoogleModel(),
    system: 'You are a helpful assistant.',
    messages: convertToModelMessages(messages)
  })

  return result.toUIMessageStreamResponse()
})
