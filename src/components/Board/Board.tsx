import { useState, useCallback, useMemo } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import Column from './Column'
import TaskModal, { type ModalState } from '../Card/TaskModal'
import Spinner from '../UI/Spinner'
import Pagination from '../UI/Pagination'
import Toast from '../UI/Toast'
import { useFetchTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useTaskStore } from '../../store/taskStore'
import type { Task, ColumnId, Priority } from '../../types/task'

const COLUMN_ORDER: ColumnId[] = ['design', 'frontend', 'backend', 'testing']

const FILTERS = [
  { id: 'all',       label: 'All tasks' },
  { id: 'high',      label: 'High'      },
  { id: 'medium',    label: 'Medium'    },
  { id: 'low',       label: 'Low'       },
  { id: 'completed', label: 'Done'      },
] as const

type FilterId = typeof FILTERS[number]['id']

export default function Board() {
  const { isLoading, isError } = useFetchTasks()

  // Zustand selectors — компонент танҳо вақти тағйири ин майдонҳо render мешавад
  const tasks      = useTaskStore((s) => s.tasks)
  const filter     = useTaskStore((s) => s.filter)
  const totalTasks = useTaskStore((s) => s.totalTasks)
  const setFilter  = useTaskStore((s) => s.setFilter)
  const moveTask   = useTaskStore((s) => s.moveTask)
  const updateTaskStore = useTaskStore((s) => s.updateTask)

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [modal, setModal]         = useState<ModalState | null>(null)
  const [toast, setToast]         = useState('')
  const [activeFilter, setActive] = useState<FilterId>('all')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }, [])

  /* ── Filtered columns ───────────────────────────────────── */
  const filteredColumns = useMemo(() => {
    let list = tasks

    if (filter.search)
      list = list.filter((t) => t.title.toLowerCase().includes(filter.search.toLowerCase()))

    if (activeFilter === 'completed') list = list.filter((t) => t.completed)
    else if (activeFilter === 'high')   list = list.filter((t) => t.priority === 'high')
    else if (activeFilter === 'medium') list = list.filter((t) => t.priority === 'medium')
    else if (activeFilter === 'low')    list = list.filter((t) => t.priority === 'low')

    const cols: Record<ColumnId, Task[]> = { design: [], frontend: [], backend: [], testing: [] }
    list.forEach((t) => cols[t.columnId].push(t))
    return cols
  }, [tasks, filter.search, activeFilter])

  /* ── Stats ──────────────────────────────────────────────── */
  const total      = tasks.length
  const completed  = tasks.filter((t) => t.completed).length
  const highCount  = tasks.filter((t) => t.priority === 'high').length
  const inProgress = total - completed

  /* ── Handlers ───────────────────────────────────────────── */
  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    moveTask(Number(draggableId), destination.droppableId as ColumnId, destination.index)
    showToast('Task moved')
  }, [moveTask, showToast])

  const handleModalSave = useCallback((data: { title: string; priority: Priority; columnId: ColumnId }) => {
    if (!modal) return

    if (modal.mode === 'add') {
      createTask.mutate({ title: data.title, columnId: data.columnId, priority: data.priority })
      showToast('Task added')
    } else {
      const t = modal.task
      if (data.title    !== t.title)    updateTask.mutate({ id: t.id, title: data.title })
      if (data.priority !== t.priority) updateTaskStore(t.id, { priority: data.priority })
      if (data.columnId !== t.columnId) updateTaskStore(t.id, { columnId: data.columnId })
      showToast('Task updated')
    }
    setModal(null)
  }, [modal, createTask, updateTask, updateTaskStore, showToast])

  const handleDelete = useCallback((id: number) => {
    deleteTask.mutate(id)
    showToast('Task deleted')
  }, [deleteTask, showToast])

  const handleToggle = useCallback((id: number, completed: boolean) => {
    updateTaskStore(id, { completed })
    updateTask.mutate({ id, completed })
    showToast(completed ? '✓ Task completed' : 'Task reopened')
  }, [updateTaskStore, updateTask, showToast])

  /* ── Loading / Error ────────────────────────────────────── */
  if (isLoading) return <Spinner />

  if (isError) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F3F4F6' }}>
      <p style={{ color: '#EF4444', fontWeight: 500 }}>Failed to load tasks. Check your connection.</p>
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#F3F4F6', minHeight: '100vh', padding: 20 }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>📋 Movadex Project</h1>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: '0 10px', height: 36 }}>
            <span style={{ color: '#9CA3AF', fontSize: 14 }}>🔍</span>
            <input
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              placeholder="Search..."
              style={{ border: 'none', outline: 'none', fontSize: 13, width: 150, background: 'transparent', fontFamily: 'inherit' }}
            />
          </div>

          <button
            onClick={() => setModal({ mode: 'add', defaultColumn: 'design' })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total',         value: total,      color: '#374151' },
          { label: 'Completed',     value: completed,  color: '#065F46' },
          { label: 'High priority', value: highCount,  color: '#991B1B' },
          { label: 'In progress',   value: inProgress, color: '#2563EB' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', border: '1px solid #F3F4F6' }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filter Pills ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            style={{
              padding: '5px 14px', borderRadius: 20, border: '1px solid',
              borderColor: activeFilter === f.id ? '#4F46E5' : '#E5E7EB',
              background:  activeFilter === f.id ? '#4F46E5' : '#fff',
              color:       activeFilter === f.id ? '#fff'    : '#6B7280',
              fontSize: 12, cursor: 'pointer',
              fontWeight: activeFilter === f.id ? 600 : 400,
              fontFamily: 'inherit',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Kanban Board ────────────────────────────────────── */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {COLUMN_ORDER.map((colId) => (
            <Column
              key={colId}
              columnId={colId}
              tasks={filteredColumns[colId]}
              onAdd={(id) => setModal({ mode: 'add', defaultColumn: id })}
              onEdit={(task) => setModal({ mode: 'edit', task })}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </DragDropContext>

      {/* page ва totalTasks барои Pagination аз store мегираду мебарад */}
      {Math.ceil(totalTasks / 20) > 1 && <Pagination />}

      {/* ── Modal ───────────────────────────────────────────── */}
      {modal && (
        <TaskModal modal={modal} onClose={() => setModal(null)} onSave={handleModalSave} />
      )}

      <Toast message={toast} />
    </div>
  )
}
