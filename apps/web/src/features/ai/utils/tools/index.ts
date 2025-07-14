import { askForConfirmation } from './confirmation'
import { generateImage } from './image'
import { getLocation } from './location'
import { calculator } from './math'
import { google_search } from './search'
import { getCurrentTime } from './time'
import { getWeatherInformation } from './weather'

// 导出所有工具
export const tools = {
  getWeatherInformation,
  askForConfirmation,
  getLocation,
  getCurrentTime,
  calculator,
  webSearch: google_search,
  generateImage
}
