import { askForConfirmation } from './confirmation'
import { getLocation } from './location'
import { calculator } from './math'
import { webSearch } from './search'
import { getCurrentTime } from './time'
import { getWeatherInformation } from './weather'

// 导出所有工具
export const tools = {
  getWeatherInformation,
  askForConfirmation,
  getLocation,
  getCurrentTime,
  calculator,
  webSearch
}
