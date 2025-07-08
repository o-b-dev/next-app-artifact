import { google } from '@ai-sdk/google'

type GoogleModel = Parameters<typeof google>[0]

/**
 * 获取 Google 模型
 * @param modelName 模型名称
 */
export const getGoogleModel = (modelName: GoogleModel = 'gemini-2.5-flash') => {
  return google(modelName)
}
