import { memo } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { MessageSquare, Paperclip } from 'lucide-react'
import type { Task, Priority } from '../../types/task'

const PRIORITY_CLASS: Record<Priority, string> = {
  high:   'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low:    'bg-green-100 text-green-800',
}

const AVATAR_BG   = ['bg-violet-100', 'bg-blue-100', 'bg-green-100', 'bg-pink-100', 'bg-amber-100']
const AVATAR_TEXT = ['text-violet-700', 'text-blue-700', 'text-green-700', 'text-pink-700', 'text-amber-700']
const AVATARS     = ['AR', 'MK', 'SO', 'JL', 'TP']

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggle: (id: number, completed: boolean) => void
}

function TaskCard({ task, index, onEdit, onDelete, onToggle }: TaskCardProps) {
  const ai = task.userId % 5

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
              ? 'shadow-xl border-indigo-200 rotate-1 scale-[1.02] cursor-grabbing'
              : 'border-gray-100 hover:border-indigo-200 cursor-grab'
            }
          `}
        >
          <p className={`text-[13px] font-medium leading-snug mb-2.5 ${
            task.completed ? 'line-through opacity-40 text-gray-800' : 'text-gray-900'
          }`}>
            {task.title}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${AVATAR_BG[ai]} ${AVATAR_TEXT[ai]}`}>
                {AVATARS[ai]}
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

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
            <span className="text-[11px] text-gray-400">{task.date}</span>
            <div className="flex items-center gap-2 text-gray-400">
              <span className="flex items-center gap-0.5 text-[11px]">
                <MessageSquare size={11} /> {task.comments}
              </span>
              <span className="flex items-center gap-0.5 text-[11px]">
                <Paperclip size={11} /> {task.attachments}
              </span>
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
