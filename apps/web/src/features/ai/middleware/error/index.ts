import type { NextRequest } from 'next/server'

import type { Handler } from '../../types'

/**
 * 错误处理中间件
 */
export const withAIErrorHandling = (handler: Handler) => {
  return async (req: NextRequest, context?: unknown) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return new Response(error instanceof Error ? error.message : 'Unknown error', {
        status: 500
      })
    }
  }
}
