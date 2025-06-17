'use client'

import { ThemeProvider } from 'next-themes'
import * as React from 'react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange enableColorScheme>
      {children}
    </ThemeProvider>
  )
}
