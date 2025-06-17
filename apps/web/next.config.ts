import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  transpilePackages: ['@workspace/ui']
}

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/features/i18n/utils/request.ts',
  experimental: {
    createMessagesDeclaration: './src/features/i18n/messages/en.json'
  }
})
export default withNextIntl(nextConfig)
