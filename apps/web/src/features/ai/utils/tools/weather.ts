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
