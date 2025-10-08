import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

import type { EditorTextAreaProps } from '../types'
import { MockDataButton } from './MockDataButton'
import { SlateEditor } from './SlateEditor'

interface EditorCardProps extends EditorTextAreaProps {
  title?: string
  description?: string
}

export const EditorCard = ({
  value,
  onChange,
  placeholder = '输入一些文本...',
  className = '',
  title = 'Slate 编辑器 Demo',
  description = '这是一个基于Slate.js构建的受控富文本编辑器示例。支持字符串输入，通过\\n区分换行。'
}: EditorCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-2xl">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm">
              编辑器
            </label>
            <SlateEditor value={value} onChange={onChange} placeholder={placeholder} className={className} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium leading-none sm:text-sm">Mock数据</label>
            <MockDataButton onTextChange={onChange || (() => {})} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
