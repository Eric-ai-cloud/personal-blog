'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useState, useCallback } from 'react'
import ImageResizeExtension from './ImageResizeExtension'

const lowlight = createLowlight(common)

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageResizeExtension,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        editor?.chain().focus().setImage({ src: data.url, width: 400 }).run()
      } else {
        alert('上传失败: ' + data.error)
      }
    } catch (error) {
      console.error('上传失败:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-100 dark:bg-gray-800 border-b p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bold')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          粗体
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('italic')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          斜体
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          列表
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('codeBlock')
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-200'
          }`}
        >
          代码块
        </button>
        <label className="px-3 py-1 rounded bg-white dark:bg-gray-700 hover:bg-gray-200 cursor-pointer">
          上传图片
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
        {uploading && <span className="text-sm text-gray-500">上传中...</span>}
      </div>

      {/* 编辑器内容 */}
      <EditorContent
        editor={editor}
        className="prose dark:prose-invert max-w-none p-4 min-h-[400px]"
      />
      
      {/* 图片操作提示 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 px-4 py-2 text-sm text-blue-800 dark:text-blue-200">
        💡 提示：点击图片选中后，可通过拖拽右下角或左下角的蓝色手柄来调整图片大小
      </div>
    </div>
  )
}
