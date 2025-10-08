import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import type { TextValueDisplayProps } from '../types'

export const TextValueDisplay = ({ text }: TextValueDisplayProps) => {
  // 格式化JSON显示
  const formatTextForDisplay = (text: string) => {
    try {
      // 将文本按行分割并格式化
      const lines = text.split('\n')
      const formattedLines = lines.map((line, index) => {
        const escapedLine = line.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\t/g, '\\t').replace(/\r/g, '\\r')

        return `  "${escapedLine}"${index < lines.length - 1 ? ',' : ''}`
      })

      return `[\n${formattedLines.join('\n')}\n]`
    } catch {
      return JSON.stringify(text, null, 2)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">当前文本值</CardTitle>
        <CardDescription className="text-xs sm:text-sm">以JSON格式显示当前编辑器的文本内容</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="bg-muted text-muted-foreground max-h-64 overflow-auto rounded-md border p-2 text-xs sm:p-4">
          <pre className="whitespace-pre-wrap break-words font-mono leading-relaxed">{formatTextForDisplay(text)}</pre>
        </div>
      </CardContent>
    </Card>
  )
}
