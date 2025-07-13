import z from 'zod'

// 位置获取工具
export const getLocation = {
  description: '获取用户位置信息，需要用户确认授权',
  inputSchema: z.object({})
}
