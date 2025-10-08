import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import type { TextStatsProps } from '../types'
import { calculateTextStats } from '../utils/slate-utils'

export const TextStats = ({ text }: TextStatsProps) => {
  const stats = calculateTextStats(text)

  return (
    <Card className="md:col-span-2 xl:col-span-1">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">文本统计</CardTitle>
        <CardDescription className="text-xs sm:text-sm">文本的基本统计信息</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-primary text-2xl font-bold">{stats.characters}</div>
            <div className="text-muted-foreground text-xs">字符数</div>
          </div>
          <div className="space-y-1">
            <div className="text-primary text-2xl font-bold">{stats.lines}</div>
            <div className="text-muted-foreground text-xs">行数</div>
          </div>
          <div className="space-y-1">
            <div className="text-primary text-2xl font-bold">{stats.words}</div>
            <div className="text-muted-foreground text-xs">单词数</div>
          </div>
          <div className="space-y-1">
            <div className="text-primary text-2xl font-bold">{stats.newlines}</div>
            <div className="text-muted-foreground text-xs">换行符</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
