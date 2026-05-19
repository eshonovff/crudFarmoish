import { Droppable } from '@hello-pangea/dnd'
import TaskCard from '../Card/TaskCard'
import type { Task, ColumnId } from '../../types/task'

const COL_CONFIG: Record<ColumnId, { label: string; color: string; bg: string }> = {
  design:   { label: 'Design',    color: '#7C3AED', bg: '#F5F3FF' },
  frontend: { label: 'Front-End', color: '#2563EB', bg: '#EFF6FF' },
  backend:  { label: 'Back-End',  color: '#D97706', bg: '#FFFBEB' },
  testing:  { label: 'Testing',   color: '#DC2626', bg: '#FEF2F2' },
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

  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            background: snapshot.isDraggingOver ? col.bg : '#F9FAFB',
            borderRadius: 12,
            padding: 14,
            minHeight: 380,
            border: snapshot.isDraggingOver
              ? `2px dashed ${col.color}`
              : '1px solid #F3F4F6',
            borderTop: `3px solid ${col.color}`,
            display: 'flex',
            flexDirection: 'column',
            transition: 'border 0.15s, background 0.15s',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: col.color }}>
              {col.label}
              <span style={{
                background: '#E5E7EB', borderRadius: 12,
                padding: '2px 8px', fontSize: 11, color: '#6B7280', fontWeight: 400,
              }}>
                {tasks.length}
              </span>
            </div>
            <button
              onClick={() => onAdd(columnId)}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: '1px solid #E5E7EB', background: '#fff',
                cursor: 'pointer', fontSize: 18, color: '#6B7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              +
            </button>
          </div>

          {/* Task list */}
          <div style={{ flex: 1 }}>
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div style={{
                textAlign: 'center', padding: '2rem 1rem',
                color: '#9CA3AF', fontSize: 12,
              }}>
                <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.4 }}>📋</div>
                No tasks
              </div>
            )}
            {tasks.map((task, index) => (
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

          {/* Add new task */}
          <button
            onClick={() => onAdd(columnId)}
            style={{
              marginTop: 8, padding: 10,
              border: '1.5px dashed #E5E7EB', borderRadius: 8,
              background: 'transparent', cursor: 'pointer',
              fontSize: 13, color: '#9CA3AF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'inherit',
            }}
          >
            + Add new task
          </button>
        </div>
      )}
    </Droppable>
  )
}
