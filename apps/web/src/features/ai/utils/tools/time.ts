import z from 'zod'

// 时间查询工具
export const getCurrentTime = {
  description: '获取当前时间信息',
  inputSchema: z.object({
    timezone: z.string().optional().describe('时区，默认为北京时间')
  }),
  execute: ({ timezone = 'Asia/Shanghai' }: { timezone?: string }) => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }

    return new Intl.DateTimeFormat('zh-CN', options).format(now)
  }
}
