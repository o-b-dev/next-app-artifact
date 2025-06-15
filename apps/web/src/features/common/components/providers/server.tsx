import { NextIntlClientProvider } from 'next-intl'

export function ServerProviders({ children }: { children: React.ReactNode }) {
  return <NextIntlClientProvider>{children}</NextIntlClientProvider>
}
