import { memo } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import type { Task, Priority } from '../../types/task'

const PRIORITY_CLASS: Record<Priority, string> = {
  high:   'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low:    'bg-green-100 text-green-800',
}

const AVATARS = ['AR', 'MK', 'SO', 'JL', 'TP']

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggle: (id: number, completed: boolean) => void
}

function TaskCard({ task, index, onEdit, onDelete, onToggle }: TaskCardProps) {
  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group bg-white rounded-lg p-3.5 mb-2.5 border select-none
            transition-all duration-150
            ${snapshot.isDragging
              ? 'shadow-xl border-indigo-200 rotate-1 scale-[1.02] cursor-grabbing opacity-80'
              : 'border-gray-100 hover:border-indigo-200 cursor-grab'
            }
          `}
        >
          <p className={`text-[13px] font-medium leading-snug mb-2.5 ${
            task.completed ? 'line-through opacity-50 text-gray-800' : 'text-gray-900'
          }`}>
            {task.title}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                {AVATARS[task.userId % 5]}
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize ${PRIORITY_CLASS[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <ActionBtn title={task.completed ? 'Reopen' : 'Complete'} textColor="text-gray-500"
                onClick={() => onToggle(task.id, !task.completed)}>
                {task.completed ? '↺' : '✓'}
              </ActionBtn>
              <ActionBtn title="Edit" textColor="text-gray-500" onClick={() => onEdit(task)}>
                ✏
              </ActionBtn>
              <ActionBtn title="Delete" textColor="text-red-400" onClick={() => onDelete(task.id)}>
                ✕
              </ActionBtn>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

function ActionBtn({ children, onClick, title, textColor }: {
  children: React.ReactNode
  onClick: () => void
  title: string
  textColor: string
}) {
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      className={`w-[26px] h-[26px] flex items-center justify-center rounded text-[13px] bg-transparent border-none cursor-pointer hover:bg-gray-100 transition-colors ${textColor}`}
    >
      {children}
    </button>
  )
}

export default memo(TaskCard)
