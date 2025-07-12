import { deepseek } from '@ai-sdk/deepseek'

type DeepSeekModel = Parameters<typeof deepseek>[0]

export const getDeepSeekModel = (modelName: DeepSeekModel = 'deepseek-chat') => {
  return deepseek(modelName)
}
