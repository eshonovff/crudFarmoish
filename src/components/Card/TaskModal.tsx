import { useState, useEffect, useRef } from 'react'
import type { Task, Priority, ColumnId } from '../../types/task'

const COLUMN_OPTIONS: { id: ColumnId; label: string }[] = [
  { id: 'design',   label: 'Design' },
  { id: 'frontend', label: 'Front-End' },
  { id: 'backend',  label: 'Back-End' },
  { id: 'testing',  label: 'Testing' },
]

export type ModalState =
  | { mode: 'add'; defaultColumn: ColumnId }
  | { mode: 'edit'; task: Task }

interface TaskModalProps {
  modal: ModalState
  onClose: () => void
  onSave: (data: { title: string; priority: Priority; columnId: ColumnId }) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #E5E7EB',
  borderRadius: 6,
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

export default function TaskModal({ modal, onClose, onSave }: TaskModalProps) {
  const isEdit = modal.mode === 'edit'
  const task = isEdit ? modal.task : null

  const [title, setTitle] = useState(task?.title ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [columnId, setColumnId] = useState<ColumnId>(
    task?.columnId ?? (modal.mode === 'add' ? modal.defaultColumn : 'design')
  )

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), priority, columnId })
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 16,
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: '#111', margin: '0 0 20px' }}>
          {isEdit ? 'Edit task' : 'Add new task'}
        </h2>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
            Task title
          </label>
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Enter task title..."
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
            Status
          </label>
          <select
            value={columnId}
            onChange={e => setColumnId(e.target.value as ColumnId)}
            style={inputStyle}
          >
            {COLUMN_OPTIONS.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, color: '#6B7280', display: 'block', marginBottom: 4 }}>
            Priority
          </label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            style={inputStyle}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #E5E7EB',
              borderRadius: 6,
              background: 'none',
              cursor: 'pointer',
              fontSize: 13,
              color: '#374151',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            style={{
              padding: '8px 18px',
              background: title.trim() ? '#4F46E5' : '#C7D2FE',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: title.trim() ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  )
}
