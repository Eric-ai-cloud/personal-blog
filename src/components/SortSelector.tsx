'use client'

interface SortSelectorProps {
  sortBy: 'newest' | 'oldest'
  onSortChange: (sort: 'newest' | 'oldest') => void
}

export function SortSelector({ sortBy, onSortChange }: SortSelectorProps) {
  return (
    <div className="mb-6">
      <label htmlFor="sort-select" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        aria-label="Sort articles by"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  )
}
