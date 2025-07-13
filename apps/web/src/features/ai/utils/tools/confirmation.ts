import z from 'zod'

// 确认工具
export const askForConfirmation = {
  description: '向用户请求确认，用于需要用户授权的操作',
  inputSchema: z.object({
    message: z.string().describe('需要用户确认的消息内容')
  })
}
