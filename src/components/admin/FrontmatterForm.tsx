'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

interface FrontmatterFormProps {
  defaultValues?: {
    title: string
    description: string
    date: string
    createdDate?: string
    publishedDate?: string
    tags: string[]
    published: boolean
  }
  onChange?: (data: any) => void
}

export interface FrontmatterFormRef {
  getValues: () => any
}

const FrontmatterForm = forwardRef<FrontmatterFormRef, FrontmatterFormProps>(
  ({ defaultValues, onChange }, ref) => {
    const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
    } = useForm({
      defaultValues: {
        title: defaultValues?.title || '',
        description: defaultValues?.description || '',
        date: defaultValues?.date || new Date().toISOString().split('T')[0],
        createdDate: defaultValues?.createdDate || '',
        publishedDate: defaultValues?.publishedDate || '',
        tags: defaultValues?.tags || [],
        published: defaultValues?.published ?? true,
      },
    })

    const [tagInput, setTagInput] = useState('')
    const tags = watch('tags')
    const published = watch('published')

    // 监听所有字段变化
    const watchedValues = watch()

    // 当字段值变化时，通知父组件
    useEffect(() => {
      if (onChange) {
        onChange(watchedValues)
      }
    }, [watchedValues, onChange])

    // 当 defaultValues 变化时，更新表单值
    useEffect(() => {
      if (defaultValues) {
        setValue('title', defaultValues.title || '')
        setValue('description', defaultValues.description || '')
        setValue('date', defaultValues.date || new Date().toISOString().split('T')[0])
        setValue('createdDate', defaultValues.createdDate || '')
        setValue('publishedDate', defaultValues.publishedDate || '')
        setValue('tags', defaultValues.tags || [])
        setValue('published', defaultValues.published ?? true)
      }
    }, [defaultValues, setValue])

    // 自动设置发布日期为当前日期（当发布状态变为 true 时）
    useEffect(() => {
      if (published && !watchedValues.publishedDate) {
        const today = new Date().toISOString().split('T')[0]
        setValue('publishedDate', today)
      }
    }, [published, setValue])

    // 暴露获取值的方法
    useImperativeHandle(ref, () => ({
      getValues: () => {
        const pd = watchedValues.publishedDate || ''
        return {
          title: watchedValues.title || '',
          description: watchedValues.description || '',
          date: pd,  // date 始终与 publishedDate 保持一致
          createdDate: watchedValues.createdDate || '',
          publishedDate: pd,
          tags: watchedValues.tags || [],
          published: watchedValues.published ?? true,
        }
      },
    }))

    const addTag = () => {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setValue('tags', [...tags, tagInput.trim()])
        setTagInput('')
      }
    }

    const removeTag = (tagToRemove: string) => {
      setValue(
        'tags',
        tags.filter((tag) => tag !== tagToRemove)
      )
    }

    return (
      <form className="space-y-4">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('title', { required: '标题不能为空' })}
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="文章标题"
          />
          {errors.title && errors.title.type === 'required' && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium mb-1">描述</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="文章简短描述"
          />
        </div>

        {/* 标签 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">标签</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="输入标签，按回车添加"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 创建日期和发布日期（可编辑） */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              创建日期
            </label>
            <input
              {...register('createdDate')}
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              发布日期 <span className="text-gray-400 text-xs">(客户端显示)</span>
            </label>
            <input
              {...register('publishedDate')}
              type="date"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 发布状态 */}
        <div className="flex items-center gap-2">
          <input
            {...register('published')}
            type="checkbox"
            id="published"
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="published" className="text-sm font-medium">
            立即发布
          </label>
        </div>
      </form>
    )
  }
)

FrontmatterForm.displayName = 'FrontmatterForm'

export default FrontmatterForm
