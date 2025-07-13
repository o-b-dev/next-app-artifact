import z from 'zod'

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
