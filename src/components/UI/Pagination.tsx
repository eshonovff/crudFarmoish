import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTaskStore } from '../../store/taskStore'
import { PAGE_SIZE } from '../../constants'

export default function Pagination() {
  const page       = useTaskStore((s) => s.page)
  const totalTasks = useTaskStore((s) => s.totalTasks)
  const setPage    = useTaskStore((s) => s.setPage)

  const totalPages = Math.ceil(totalTasks / PAGE_SIZE)
  const canPrev    = page > 0
  const canNext    = page < totalPages - 1

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pb-6">
      <button
        onClick={() => setPage(page - 1)}
        disabled={!canPrev}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`w-8 h-8 text-sm rounded-lg transition-colors ${
              i === page
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setPage(page + 1)}
        disabled={!canNext}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
