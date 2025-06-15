import type { Messages } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { hasLocale } from '../lib'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  // 获取语言包
  const messages = (await import(`../messages/${locale}.json`)) as { default: Messages }

  return {
    locale,
    messages: messages.default
  }
})
