'use client'

interface TagFilterProps {
  tags: string[]
  selectedTag?: string
  onTagChange: (tag?: string) => void
}

export function TagFilter({ tags, selectedTag, onTagChange }: TagFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Filter by Tags
      </h3>
      <ul
        className="flex flex-wrap gap-2"
        role="list"
        aria-label="Tags filter"
      >
        {/* 全部选项 */}
        <li>
          <button
            onClick={() => onTagChange(undefined)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !selectedTag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-pressed={!selectedTag}
          >
            All
          </button>
        </li>

        {/* 标签列表 */}
        {tags.map((tag) => (
          <li key={tag}>
            <button
              onClick={() => onTagChange(tag)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
              aria-pressed={selectedTag === tag}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
