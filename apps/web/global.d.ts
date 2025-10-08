import type { BaseEditor } from 'slate'
import type { HistoryEditor } from 'slate-history'
import type { ReactEditor } from 'slate-react'

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

type ParagraphElement = { type: 'paragraph'; children: (CustomText | PrefixInline)[] }
type PrefixInline = { type: 'prefix'; prefix: string; children: [CustomText] }
type CustomElement = ParagraphElement | PrefixInline
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}
