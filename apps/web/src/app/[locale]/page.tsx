import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Progress } from '@workspace/ui/components/progress'
import { useTranslations } from 'next-intl'

import { Link } from '@/features/i18n'

export default function HomePage() {
  const t = useTranslations('HomePage')
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button size="sm">{t('button')}</Button>
        <Input placeholder="Input" />
        <Progress value={50} />
      </div>

      <div className="fixed bottom-12 right-1/2 flex translate-x-1/2 gap-2">
        <Link href="/agent">
          <Button variant="link">Agent</Button>
        </Link>
        <Link href="/artifact">
          <Button variant="link">Artifact</Button>
        </Link>
      </div>
    </div>
  )
}
