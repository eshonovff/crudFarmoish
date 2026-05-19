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

const fieldClass = "w-full px-2.5 py-2 border border-gray-200 rounded-md text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 font-[inherit] transition-colors"

export default function TaskModal({ modal, onClose, onSave }: TaskModalProps) {
  const isEdit = modal.mode === 'edit'
  const task   = isEdit ? modal.task : null

  const [title,    setTitle]    = useState(task?.title    ?? '')
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
      className="fixed inset-0 bg-black/35 flex items-center justify-center z-[200] p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          {isEdit ? 'Edit task' : 'Add new task'}
        </h2>

        <div className="mb-3.5">
          <label className="text-xs text-gray-500 block mb-1">Task title</label>
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Enter task title..."
            className={fieldClass}
          />
        </div>

        <div className="mb-3.5">
          <label className="text-xs text-gray-500 block mb-1">Status</label>
          <select
            value={columnId}
            onChange={e => setColumnId(e.target.value as ColumnId)}
            className={fieldClass}
          >
            {COLUMN_OPTIONS.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-xs text-gray-500 block mb-1">Priority</label>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value as Priority)}
            className={fieldClass}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-md text-[13px] text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-md text-[13px] font-semibold text-white transition-colors
              enabled:bg-indigo-600 enabled:hover:bg-indigo-700 enabled:cursor-pointer
              disabled:bg-indigo-200 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </div>
  )
}
