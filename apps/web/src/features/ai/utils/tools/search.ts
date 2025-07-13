import { tool } from 'ai'
import z from 'zod'

// 使用 SearchAPI.io 的 DuckDuckGo 搜索工具
export const webSearch = tool({
  description: '搜索网络信息，获取最新的网页搜索结果',
  inputSchema: z.object({
    query: z.string().describe('搜索查询词，如：最新AI技术发展、React 18新特性等'),
    num_results: z.number().optional().default(5).describe('返回结果数量，默认5个')
  }),
  execute: async ({ query, num_results = 5 }: { query: string; num_results?: number }) => {
    try {
      // 使用 SearchAPI.io 的 DuckDuckGo 引擎
      const url = 'https://www.searchapi.io/api/v1/search'
      const params = new URLSearchParams({
        engine: 'duckduckgo',
        q: query,
        api_key: 'fnCj8cwCrGhqvUCLEYvcFpEy'
      })

      const response = await fetch(`${url}?${params}`)

      if (!response.ok) {
        throw new Error(`搜索请求失败: ${response.status}`)
      }

      const data = (await response.json()) as {
        organic_results?: Array<{
          title: string
          link: string
          snippet: string
        }>
        answer_box?: {
          answer: string
        }
        related_questions?: Array<{
          question: string
        }>
      }

      let results = `关于"${query}"的搜索结果：\n\n`

      // 添加答案框（如果有）
      if (data.answer_box?.answer) {
        results += `📖 即时答案: ${data.answer_box.answer}\n\n`
      }

      // 添加有机搜索结果
      if (data.organic_results && data.organic_results.length > 0) {
        results += `🔗 搜索结果:\n`
        data.organic_results.slice(0, num_results).forEach((result, index) => {
          results += `${index + 1}. ${result.title}\n`
          results += `   ${result.snippet}\n`
          results += `   🔗 ${result.link}\n\n`
        })
      }

      // 添加相关问题（如果有）
      if (data.related_questions && data.related_questions.length > 0) {
        results += `❓ 相关问题:\n`
        data.related_questions.slice(0, 3).forEach((item, index) => {
          results += `${index + 1}. ${item.question}\n`
        })
        results += '\n'
      }

      // 如果没有找到结果，提供备用方案
      if (!data.answer_box?.answer && (!data.organic_results || data.organic_results.length === 0)) {
        results += `未找到关于"${query}"的直接搜索结果。\n`
        results += `建议：\n`
        results += `1. 尝试使用更具体的关键词\n`
        results += `2. 检查拼写是否正确\n`
        results += `3. 使用不同的搜索词组合\n`
      }

      return results
    } catch (error) {
      throw new Error(`搜索失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
})
