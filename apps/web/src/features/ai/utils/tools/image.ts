import { generateText, tool } from 'ai'
import fs from 'fs'
import path from 'path'
import z from 'zod'

import { getGoogleModel } from '../model'

export const generateImage = tool({
  description: '生成图片，返回的图片URL需要使用Markdown格式显示：![图片描述](图片URL)',
  inputSchema: z.object({
    prompt: z.string().describe('生成图片的提示词')
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string().describe('包含Markdown格式图片链接的消息'),
    imageUrl: z.string().optional().describe('图片的URL地址'),
    fileName: z.string().optional().describe('保存的文件名'),
    filePath: z.string().optional().describe('文件的本地路径')
  }),
  execute: async ({ prompt }: { prompt: string }) => {
    const result = await generateText({
      model: getGoogleModel('gemini-2.0-flash-preview-image-generation'),
      providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] }
      },
      prompt
    })

    for (const file of result.files) {
      if (file.mediaType.startsWith('image/')) {
        // 生成唯一的文件名
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const extension = file.mediaType.split('/')[1] || 'png'
        const fileName = `generated-${timestamp}-${randomId}.${extension}`

        // 确保 public 目录存在
        const publicDir = path.join(process.cwd(), 'public', 'generated-images')
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true })
        }

        // 保存图片文件
        const filePath = path.join(publicDir, fileName)

        if (file.uint8Array) {
          // 使用二进制数据保存
          fs.writeFileSync(filePath, file.uint8Array)
        } else if (file.base64) {
          // 使用 base64 数据保存
          const base64Data = file.base64.replace(/^data:image\/\w+;base64,/, '')
          const buffer = Buffer.from(base64Data, 'base64')
          fs.writeFileSync(filePath, buffer)
        }

        // 返回可访问的 URL
        const imageUrl = `http://localhost:8001/generated-images/${fileName}`

        return {
          success: true,
          message: `图片生成成功！请使用以下Markdown格式显示图片：![生成的图片](${imageUrl})`,
          imageUrl,
          fileName,
          filePath
        }
      }
    }

    return {
      success: false,
      message: '未找到生成的图片'
    }
  }
})
