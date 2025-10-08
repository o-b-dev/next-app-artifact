import { Button } from '@workspace/ui/components/button'

import {
  generateCodeExample,
  generateFakerText,
  generateRandomText,
  generateTextByType,
  generateUserInfo
} from '../utils/mock-data'

interface MockDataButtonProps {
  onTextChange: (text: string) => void
  className?: string
}

export const MockDataButton = ({ onTextChange, className = '' }: MockDataButtonProps) => {
  const handleRandomText = () => {
    const randomText = generateRandomText()
    onTextChange(randomText)
  }

  const handleEmptyText = () => {
    onTextChange('')
  }

  const handleMultilineText = () => {
    const multilineText = generateTextByType('multiline')
    onTextChange(multilineText)
  }

  const handleLongText = () => {
    const longText = generateTextByType('long')
    onTextChange(longText)
  }

  const handleSpecialChars = () => {
    const specialText = generateTextByType('special')
    onTextChange(specialText)
  }

  const handleFakerText = () => {
    const fakerText = generateFakerText()
    onTextChange(fakerText)
  }

  const handleUserInfo = () => {
    const userInfo = generateUserInfo()
    onTextChange(userInfo)
  }

  const handleCodeExample = () => {
    const codeExample = generateCodeExample()
    onTextChange(codeExample)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleRandomText} className="text-xs">
          随机文本
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmptyText} className="text-xs">
          清空
        </Button>
        <Button variant="outline" size="sm" onClick={handleMultilineText} className="text-xs">
          多行文本
        </Button>
        <Button variant="outline" size="sm" onClick={handleLongText} className="text-xs">
          长文本
        </Button>
        <Button variant="outline" size="sm" onClick={handleSpecialChars} className="text-xs">
          特殊字符
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" size="sm" onClick={handleFakerText} className="text-xs">
          Faker文本
        </Button>
        <Button variant="secondary" size="sm" onClick={handleUserInfo} className="text-xs">
          用户信息
        </Button>
        <Button variant="secondary" size="sm" onClick={handleCodeExample} className="text-xs">
          代码示例
        </Button>
      </div>
    </div>
  )
}
