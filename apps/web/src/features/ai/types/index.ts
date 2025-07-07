import type { NextRequest } from 'next/server'

/**
 * api 处理函数类型
 */
export type Handler = (req: NextRequest, context?: unknown) => Promise<Response>
