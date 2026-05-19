import { memo, useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import type { Task, Priority } from '../../types/task'

const PRIORITY_STYLES: Record<Priority, { bg: string; color: string }> = {
  high:   { bg: '#FEE2E2', color: '#991B1B' },
  medium: { bg: '#FEF3C7', color: '#92400E' },
  low:    { bg: '#D1FAE5', color: '#065F46' },
}

const AVATAR_BG    = ['#EDE9FE', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#FEF3C7']
const AVATAR_COLOR = ['#6D28D9', '#1D4ED8', '#065F46', '#9D174D', '#92400E']
const AVATARS      = ['AR', 'MK', 'SO', 'JL', 'TP']

interface TaskCardProps {
  task: Task
  index: number
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onToggle: (id: number, completed: boolean) => void
}

function TaskCard({ task, index, onEdit, onDelete, onToggle }: TaskCardProps) {
  const [hover, setHover] = useState(false)
  const p = PRIORITY_STYLES[task.priority]
  const ai = task.userId % 5

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            ...provided.draggableProps.style,
            background: '#fff',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 10,
            border: hover || snapshot.isDragging ? '1px solid #C7D2FE' : '1px solid #F3F4F6',
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            transition: 'border-color 0.15s',
            opacity: snapshot.isDragging ? 0.85 : 1,
            userSelect: 'none',
            boxShadow: snapshot.isDragging ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
          }}
        >
          {/* Title */}
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: '#111',
            marginBottom: 10,
            lineHeight: 1.45,
            textDecoration: task.completed ? 'line-through' : 'none',
            opacity: task.completed ? 0.45 : 1,
          }}>
            {task.title}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Avatar + Priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: AVATAR_BG[ai], color: AVATAR_COLOR[ai],
                fontSize: 10, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {AVATARS[ai]}
              </div>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 10,
                background: p.bg, color: p.color, fontWeight: 600,
              }}>
                {task.priority}
              </span>
            </div>

            {/* Hover actions */}
            <div style={{
              display: 'flex', gap: 2,
              opacity: hover ? 1 : 0,
              transition: 'opacity 0.15s',
            }}>
              <ActionBtn
                title={task.completed ? 'Reopen' : 'Complete'}
                color="#6B7280"
                onClick={() => onToggle(task.id, !task.completed)}
              >
                {task.completed ? '↺' : '✓'}
              </ActionBtn>
              <ActionBtn title="Edit" color="#6B7280" onClick={() => onEdit(task)}>
                ✏
              </ActionBtn>
              <ActionBtn title="Delete" color="#EF4444" onClick={() => onDelete(task.id)}>
                ✕
              </ActionBtn>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

function ActionBtn({
  children, onClick, title, color,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  color: string
}) {
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{
        width: 26, height: 26, border: 'none', borderRadius: 4,
        background: 'transparent', cursor: 'pointer',
        fontSize: 13, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
    </button>
  )
}

export default memo(TaskCard)
