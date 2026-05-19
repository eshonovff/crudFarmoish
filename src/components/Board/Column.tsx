import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import TaskCard from '../Card/TaskCard'
import type { Task, ColumnId } from '../../types/task'

const COL_PAGE = 4

const COL_CONFIG: Record<ColumnId, { label: string; color: string; bg: string; titleClass: string }> = {
  design:   { label: 'Design',    color: '#7C3AED', bg: '#F5F3FF', titleClass: 'text-violet-600' },
  frontend: { label: 'Front-End', color: '#2563EB', bg: '#EFF6FF', titleClass: 'text-blue-600'   },
  backend:  { label: 'Back-End',  color: '#D97706', bg: '#FFFBEB', titleClass: 'text-amber-600'  },
  testing:  { label: 'Testing',   color: '#DC2626', bg: '#FEF2F2', titleClass: 'text-red-600'    },
}

interface ColumnProps {
  columnId: ColumnId
  tasks: Task[]
  onAdd: (columnId: ColumnId) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggle: (id: number, completed: boolean) => void
}

export default function Column({ columnId, tasks, onAdd, onEdit, onDelete, onToggle }: ColumnProps) {
  const col = COL_CONFIG[columnId]
  const [visible, setVisible] = useState(COL_PAGE)

  const shown   = tasks.slice(0, visible)
  const hasMore = tasks.length > visible
  const hidden  = tasks.length - visible

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="rounded-xl p-3.5 flex flex-col min-h-[380px] border transition-all duration-150"
          style={{
            borderTopWidth:  3,
            borderTopColor:  col.color,
            background:      snapshot.isDraggingOver ? col.bg    : '#F9FAFB',
            borderColor:     snapshot.isDraggingOver ? col.color : '#F3F4F6',
            borderStyle:     snapshot.isDraggingOver ? 'dashed'  : 'solid',
            borderTopStyle:  'solid',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 text-sm font-semibold ${col.titleClass}`}>
              {col.label}
              <span className="bg-gray-200 text-gray-500 text-[11px] font-normal rounded-full px-2 py-0.5">
                {tasks.length}
              </span>
            </div>
            <button
              onClick={() => onAdd(columnId)}
              className="w-7 h-7 rounded-md border border-gray-200 bg-white text-gray-500 text-lg leading-none flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="flex-1">
            {shown.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-xs gap-2">
                <span className="text-3xl opacity-40">📋</span>
                No tasks
              </div>
            )}
            {shown.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggle={onToggle}
              />
            ))}
            {provided.placeholder}
          </div>

          {hasMore && (
            <button
              onClick={() => setVisible((v) => v + COL_PAGE)}
              className="mt-1 mb-2 w-full py-1.5 text-[12px] text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600 transition-colors"
            >
              ▼ Show more ({hidden})
            </button>
          )}

          <button
            onClick={() => onAdd(columnId)}
            className="mt-auto py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-[13px] text-gray-400 flex items-center justify-center gap-1.5 hover:border-gray-300 hover:text-gray-500 transition-colors cursor-pointer bg-transparent"
          >
            + Add new task
          </button>
        </div>
      )}
    </Droppable>
  )
}
