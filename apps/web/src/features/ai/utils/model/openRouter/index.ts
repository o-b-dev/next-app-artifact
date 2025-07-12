import { openrouter } from '@openrouter/ai-sdk-provider'

export type OpenRouterModel =
  | 'qwen/qwen3-4b:free'
  | 'google/gemini-2.0-flash-exp:free'
  | 'qwen/qwen2.5-vl-72b-instruct:free'
  | 'openrouter/cypher-alpha:free'
  | 'deepseek/deepseek-chat-v3-0324:free'

const getOpenRouterModel = (modelName: OpenRouterModel = 'deepseek/deepseek-chat-v3-0324:free') => {
  return openrouter(modelName)
}

export { getOpenRouterModel }
