import z from 'zod'

// 天气数据模拟
const weatherData = {
  北京: ['晴天', '多云', '阴天', '小雨', '雪'],
  上海: ['晴天', '多云', '阴天', '小雨', '雾'],
  广州: ['晴天', '多云', '阴天', '大雨', '雷阵雨'],
  深圳: ['晴天', '多云', '阴天', '小雨', '台风'],
  杭州: ['晴天', '多云', '阴天', '小雨', '雪'],
  成都: ['晴天', '多云', '阴天', '小雨', '雾'],
  西安: ['晴天', '多云', '阴天', '小雨', '雪'],
  武汉: ['晴天', '多云', '阴天', '大雨', '雷阵雨'],
  南京: ['晴天', '多云', '阴天', '小雨', '雾'],
  重庆: ['晴天', '多云', '阴天', '小雨', '雾']
}

// 获取天气信息的工具
export const getWeatherInformation = {
  description: '获取指定城市的天气信息，支持中文城市名称',
  inputSchema: z.object({
    city: z.string().describe('城市名称，如：北京、上海、广州等')
  }),
  execute: async ({ city }: { city: string }) => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cityWeather = weatherData[city as keyof typeof weatherData]
    if (!cityWeather) {
      throw new Error(`暂不支持 ${city} 的天气查询，支持的城市包括：${Object.keys(weatherData).join('、')}`)
    }

    const weather = cityWeather[Math.floor(Math.random() * cityWeather.length)]
    const temperature = Math.floor(Math.random() * 30) + 5 // 5-35度
    const humidity = Math.floor(Math.random() * 40) + 40 // 40-80%

    return `${city}今天天气${weather}，温度${temperature}°C，湿度${humidity}%`
  }
}

// 确认工具
export const askForConfirmation = {
  description: '向用户请求确认，用于需要用户授权的操作',
  inputSchema: z.object({
    message: z.string().describe('需要用户确认的消息内容')
  })
}

// 位置获取工具
export const getLocation = {
  description: '获取用户位置信息，需要用户确认授权',
  inputSchema: z.object({})
}

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

// 计算器工具
export const calculator = {
  description: '执行基本的数学计算',
  inputSchema: z.object({
    expression: z.string().describe('数学表达式，如：2 + 3 * 4')
  }),
  execute: ({ expression }: { expression: string }) => {
    try {
      // 安全地评估数学表达式
      const sanitizedExpression = expression.replace(/[^0-9+\-*/().]/g, '')
      const result = eval(sanitizedExpression) as number

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('计算结果无效')
      }

      return `${expression} = ${result}`
    } catch (error) {
      throw new Error(`计算错误：${error instanceof Error ? error.message : '表达式无效'}`)
    }
  }
}

// 导出所有工具
export const tools = {
  getWeatherInformation,
  askForConfirmation,
  getLocation,
  getCurrentTime,
  calculator
}
