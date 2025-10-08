import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import type { TextPreviewProps } from '../types'

export const TextPreview = ({ text }: TextPreviewProps) => {
  const lines = text.split('\n')

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">文本预览</CardTitle>
        <CardDescription className="text-xs sm:text-sm">按行显示文本内容，便于查看换行效果</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="max-h-64 space-y-1 overflow-auto sm:space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs sm:text-sm">
              <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium sm:h-6 sm:w-6">
                {index + 1}
              </span>
              <span className="text-foreground break-words">{line || '(空行)'}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
