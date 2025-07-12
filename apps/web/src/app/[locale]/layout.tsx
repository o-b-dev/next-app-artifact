import '@/app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

import { AppProviders } from '@/features/common/components/providers'
import SwitchTheme from '@/features/common/components/theme'
import { hasLocale } from '@/features/i18n/lib'
import { routing } from '@/features/i18n/utils/routing'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <AppProviders>
          <SwitchTheme />
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
