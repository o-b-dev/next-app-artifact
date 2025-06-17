import { ClientProviders } from './client'
import { ServerProviders } from './server'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ServerProviders>
      <ClientProviders>{children}</ClientProviders>
    </ServerProviders>
  )
}
