# Prefix 行内元素功能

## 概述

Slate 编辑器现在支持在第一行最前方添加一个固定的 prefix 行内元素。这个元素具有以下特点：

- ✅ 始终在第一行（第一个段落）最前方
- ✅ 是行内元素，不会独占一行
- ✅ 不能在它之前插入任何内容
- ✅ 默认不可编辑和删除
- ✅ 点击 prefix 标签可删除
- ✅ 如果在其他行出现会被自动移除
- ✅ 内容和 prefix 在同一行显示

## 使用方法

### 基本用法

```tsx
import { SlateEditor } from '@/features/editor/components/SlateEditor'

function MyComponent() {
  const [value, setValue] = useState('这是一些文本')
  const [showPrefix, setShowPrefix] = useState(true)

  return (
    <SlateEditor
      value={value}
      onChange={setValue}
      prefix={showPrefix ? '提示：' : undefined}
      onPrefixRemove={() => setShowPrefix(false)}
      placeholder="输入一些文本..."
    />
  )
}
```

### 属性说明

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `value` | `string` | ✅ | 编辑器的文本内容 |
| `onChange` | `(value: string) => void` | ❌ | 内容变化回调 |
| `prefix` | `string` | ❌ | prefix 文本内容（如果不传或为 undefined，则不显示 prefix） |
| `onPrefixRemove` | `() => void` | ❌ | 点击 prefix 时的回调，通常用于隐藏 prefix |
| `placeholder` | `string` | ❌ | 占位符文本 |
| `className` | `string` | ❌ | 自定义样式类 |

## 行为特性

### 1. 行内显示
prefix 是一个行内元素（inline element），与文本内容在同一行显示，不会独占一行。

### 2. 初始位置
prefix 在创建时会被放置在第一个段落的第一个位置。

### 3. 删除保护
- 用户无法通过键盘删除 prefix
- 当光标在 prefix 后第一个位置时，按 Backspace 不会删除 prefix
- Delete 键也无法删除 prefix

### 4. 点击删除
点击 prefix 标签会触发 `onPrefixRemove` 回调，你可以在回调中更新状态来隐藏 prefix。这是删除 prefix 的唯一方式。

### 5. 编辑限制
prefix 元素设置了 `contentEditable={false}`，用户无法直接编辑其内容。

## 样式定制

prefix 使用了 Tailwind CSS 类进行样式设置，渲染为行内的 `<span>` 元素。你可以通过修改 `PrefixElement.tsx` 来自定义样式：

```tsx
// apps/web/src/features/editor/components/PrefixElement.tsx
<span {...attributes} contentEditable={false} className="select-none">
  <span
    onClick={(e) => {
      e.stopPropagation()
      onRemove?.()
    }}
    className="inline-flex cursor-pointer items-center rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
    contentEditable={false}
  >
    {prefixText}
  </span>
  {children}
</span>
```

注意：
- 外层 `<span>` 包裹整个 prefix 元素（包括其空的文本子节点）
- 内层 `<span>` 是实际显示的 prefix 标签
- 整个元素设置为 `contentEditable={false}` 防止编辑

## 实现原理

### 1. 类型定义
在 `global.d.ts` 中扩展了 Slate 的类型系统，将 prefix 定义为行内元素：

```typescript
type ParagraphElement = { type: 'paragraph'; children: (CustomText | PrefixInline)[] }
type PrefixInline = { type: 'prefix'; prefix: string; children: [CustomText] }
type CustomElement = ParagraphElement | PrefixInline
```

注意：
- `PrefixInline` 是段落的子元素，而不是独立的块级元素
- 段落的 `children` 可以包含文本节点或 prefix 节点

### 2. 自定义插件
`withPrefix` 插件（位于 `apps/web/src/features/editor/utils/withPrefix.ts`）重写了以下编辑器方法：

- `isInline`: 标记 prefix 为行内元素
- `deleteBackward`: 防止通过 Backspace 删除 prefix
- `deleteForward`: 防止通过 Delete 删除 prefix

注意：为了避免规范化循环，我们不在 `normalizeNode` 中强制移动 prefix。prefix 的位置由初始创建时的 `stringToSlateNodes` 函数控制。

### 3. 节点转换
- `stringToSlateNodes`: 将字符串转换为 Slate 节点时，在第一个段落的开头添加 prefix 行内元素
- `slateNodesToString`: 将 Slate 节点转换为字符串时，过滤掉段落中的 prefix 行内元素

### 4. 模块结构
```
apps/web/src/features/editor/
├── components/
│   ├── PrefixElement.tsx    # Prefix 渲染组件
│   └── SlateEditor.tsx       # 主编辑器组件
├── utils/
│   ├── withPrefix.ts         # Prefix 插件逻辑
│   └── slate-utils.ts        # 节点转换工具
└── types/
    └── index.ts              # 类型定义
```

## 示例

查看 `apps/web/src/app/[locale]/input/page.tsx` 获取完整的使用示例。

运行应用后访问 `/input` 路径即可看到 prefix 功能的演示。

