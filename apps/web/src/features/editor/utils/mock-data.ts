import { fakerZH_CN as faker } from '@faker-js/faker'

/**
 * Mock数据生成工具
 */

// 预定义的文本模板
const TEXT_TEMPLATES = [
  '欢迎使用Slate编辑器！\n开始输入您的文本...\n支持多行文本编辑',
  '这是一个多行文本示例\n第二行内容\n第三行内容\n第四行内容',
  'The quick brown fox jumps over the lazy dog.\nThis is a sample text for testing.\nIt contains common English words.\nPerfect for demonstration purposes.',
  'Hello World!\nThis is a test message.\nLine 3\nLine 4\nLine 5',
  '中文测试文本\n包含多行内容\n用于演示编辑器功能\n支持换行显示',
  '代码示例：\nfunction hello() {\n  console.log("Hello World!");\n  return true;\n}',
  '空文本',
  '单行文本内容',
  '很长的文本行，用于测试自动换行功能，这行文本应该会在显示时自动换行，以便更好地展示编辑器的换行处理能力。\n第二行\n第三行',
  '特殊字符测试：\n!@#$%^&*()\n[]{}|\\:";\'<>?,./\n\t制表符测试\n\r回车符测试'
]

/**
 * 生成随机文本
 */
export const generateRandomText = (): string => {
  const randomIndex = Math.floor(Math.random() * TEXT_TEMPLATES.length)
  return TEXT_TEMPLATES[randomIndex]
}

/**
 * 生成指定类型的文本
 */
export const generateTextByType = (type: 'empty' | 'single' | 'multiline' | 'long' | 'special'): string => {
  switch (type) {
    case 'empty':
      return ''
    case 'single':
      return '单行文本内容'
    case 'multiline':
      return '多行文本示例\n第二行\n第三行\n第四行'
    case 'long':
      return '这是一个很长的文本行，用于测试编辑器的自动换行功能和文本处理能力。这行文本应该会在显示时自动换行，以便更好地展示编辑器的换行处理能力。\n第二行也很长，包含了很多文字内容，用于测试长文本的处理效果。\n第三行\n第四行\n第五行'
    case 'special':
      return '特殊字符测试：\n!@#$%^&*()\n[]{}|\\:";\'<>?,./\n\t制表符\n\r回车符\n\n空行测试'
    default:
      return generateRandomText()
  }
}

/**
 * 生成随机长度的文本
 */
export const generateRandomLengthText = (): string => {
  const lengths = ['short', 'medium', 'long']
  const randomLength = lengths[Math.floor(Math.random() * lengths.length)]

  switch (randomLength) {
    case 'short':
      return '短文本'
    case 'medium':
      return '中等长度的文本内容\n包含两行'
    case 'long':
      return '这是一个很长的文本内容，用于测试编辑器的处理能力。\n第二行也很长，包含了很多文字内容。\n第三行\n第四行\n第五行\n第六行\n第七行\n第八行\n第九行\n第十行'
    default:
      return generateRandomText()
  }
}

/**
 * 使用Faker生成随机文本
 */
export const generateFakerText = (): string => {
  const textTypes = ['lorem', 'sentence', 'paragraph', 'address', 'company', 'product']
  const randomType = textTypes[Math.floor(Math.random() * textTypes.length)]

  switch (randomType) {
    case 'lorem':
      return faker.lorem.paragraphs(3, '\n')
    case 'sentence':
      return faker.lorem.sentences(5, '\n')
    case 'paragraph':
      return faker.lorem.paragraphs(2, '\n')
    case 'address':
      return `${faker.location.streetAddress()}\n${faker.location.city()}\n${faker.location.country()}`
    case 'company':
      return `${faker.company.name()}\n${faker.company.catchPhrase()}\n${faker.company.buzzPhrase()}`
    case 'product':
      return `${faker.commerce.productName()}\n${faker.commerce.productDescription()}\n价格: ${faker.commerce.price()}`
    default:
      return faker.lorem.paragraphs(2, '\n')
  }
}

/**
 * 生成随机用户信息
 */
export const generateUserInfo = (): string => {
  return `用户信息：\n姓名: ${faker.person.fullName()}\n邮箱: ${faker.internet.email()}\n电话: ${faker.phone.number()}\n地址: ${faker.location.streetAddress()}\n公司: ${faker.company.name()}`
}

/**
 * 生成随机代码示例
 */
export const generateCodeExample = (): string => {
  const codeTypes = ['javascript', 'python', 'html', 'css']
  const randomType = codeTypes[Math.floor(Math.random() * codeTypes.length)]

  switch (randomType) {
    case 'javascript':
      return `// JavaScript 示例\nfunction ${faker.hacker.verb()}() {\n  const ${faker.hacker.noun()} = "${faker.lorem.word()}";\n  console.log(${faker.hacker.noun()});\n  return true;\n}`
    case 'python':
      return `# Python 示例\ndef ${faker.hacker.verb()}():\n    ${faker.hacker.noun()} = "${faker.lorem.word()}"\n    print(${faker.hacker.noun()})\n    return True`
    case 'html':
      return `<!-- HTML 示例 -->\n<div class="${faker.lorem.word()}">\n  <h1>${faker.lorem.sentence()}</h1>\n  <p>${faker.lorem.paragraph()}</p>\n</div>`
    case 'css':
      return `/* CSS 示例 */\n.${faker.lorem.word()} {\n  color: ${faker.color.rgb()};\n  font-size: ${faker.number.int({ min: 12, max: 24 })}px;\n  margin: ${faker.number.int({ min: 0, max: 20 })}px;\n}`
    default:
      return `// 代码示例\nconst ${faker.hacker.noun()} = "${faker.lorem.word()}";`
  }
}
