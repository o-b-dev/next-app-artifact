import type messages from '@/features/i18n/messages/en.json'
// import type { formats } from '@/features/i18n/utils/request'
import type { routing } from '@/features/i18n/utils/routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    // Formats: typeof formats
  }
}
