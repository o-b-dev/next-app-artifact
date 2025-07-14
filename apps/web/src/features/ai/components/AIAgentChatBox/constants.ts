import { Calculator, Clock, Cloud, ImageIcon, MapPin, MessageSquare, Search, Sparkles } from 'lucide-react'

import type { PresetAction } from './types'

// 预设操作配置
export const PRESET_ACTIONS: PresetAction[] = [
  {
    id: 'search',
    title: '网络搜索',
    description: '搜索最新的网络信息',
    icon: Search,
    prompt: '请帮我搜索最新的AI技术发展趋势',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'weather',
    title: '查询天气',
    description: '获取指定城市的天气信息',
    icon: Cloud,
    prompt: '请帮我查询北京的天气情况',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'location',
    title: '获取位置',
    description: '获取用户当前位置信息',
    icon: MapPin,
    prompt: '请帮我获取当前位置信息',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'chat',
    title: '智能对话',
    description: '与AI进行自然语言对话',
    icon: MessageSquare,
    prompt: '你好，请介绍一下你自己',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'creative',
    title: '创意助手',
    description: '获取创意灵感和建议',
    icon: Sparkles,
    prompt: '请给我一些关于产品设计的创意建议',
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    id: 'calculator',
    title: '计算器',
    description: '执行数学计算',
    icon: Calculator,
    prompt: '请帮我计算 25 * 4 + 100 / 2',
    color: 'bg-indigo-500 hover:bg-indigo-600'
  },
  {
    id: 'time',
    title: '时间查询',
    description: '获取当前时间信息',
    icon: Clock,
    prompt: '请告诉我现在的时间',
    color: 'bg-teal-500 hover:bg-teal-600'
  },
  {
    id: 'image',
    title: '图片生成',
    description: '根据提示词生成图片',
    icon: ImageIcon,
    prompt: '请帮我生成一张小狗图片',
    color: 'bg-pink-500 hover:bg-pink-600'
  }
]
