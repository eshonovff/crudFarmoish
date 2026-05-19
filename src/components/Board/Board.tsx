import { useState, useCallback, useMemo } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import Column from './Column'
import TaskModal, { type ModalState } from '../Card/TaskModal'
import Pagination from '../UI/Pagination'
import Toast from '../UI/Toast'
import { useFetchTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasks'
import { useTaskStore } from '../../store/taskStore'
import type { Task, ColumnId, Priority, ActiveFilter } from '../../types/task'

const SKELETON_COLORS = ['#7C3AED', '#2563EB', '#D97706', '#DC2626']

const COLUMN_ORDER: ColumnId[] = ['design', 'frontend', 'backend', 'testing']

const FILTERS: { id: ActiveFilter; label: string }[] = [
  { id: 'all',       label: 'All tasks' },
  { id: 'high',      label: 'High'      },
  { id: 'medium',    label: 'Medium'    },
  { id: 'low',       label: 'Low'       },
  { id: 'completed', label: 'Done'      },
]

export default function Board() {
  const { isLoading, isError } = useFetchTasks()

  const tasks          = useTaskStore((s) => s.tasks)
  const filter         = useTaskStore((s) => s.filter)
  const totalTasks     = useTaskStore((s) => s.totalTasks)
  const setFilter      = useTaskStore((s) => s.setFilter)
  const moveTask       = useTaskStore((s) => s.moveTask)
  const updateTaskStore = useTaskStore((s) => s.updateTask)

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [modal, setModal] = useState<ModalState | null>(null)
  const [toast, setToast] = useState('')

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }, [])

  const filteredColumns = useMemo(() => {
    let list = tasks

    if (filter.search)
      list = list.filter((t) => t.title.toLowerCase().includes(filter.search.toLowerCase()))

    if (filter.activeFilter === 'completed') list = list.filter((t) => t.completed)
    else if (filter.activeFilter === 'high')   list = list.filter((t) => t.priority === 'high')
    else if (filter.activeFilter === 'medium') list = list.filter((t) => t.priority === 'medium')
    else if (filter.activeFilter === 'low')    list = list.filter((t) => t.priority === 'low')

    const cols: Record<ColumnId, Task[]> = { design: [], frontend: [], backend: [], testing: [] }
    list.forEach((t) => cols[t.columnId].push(t))
    return cols
  }, [tasks, filter])

  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length
    const highCount = tasks.filter((t) => t.priority === 'high').length
    return { total: tasks.length, completed, highCount, inProgress: tasks.length - completed }
  }, [tasks])

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
      createTask.mutate(
        { title: data.title, columnId: data.columnId, priority: data.priority },
        {
          onSuccess: () => showToast('Task added'),
          onError:   () => showToast('❌ Failed to add task'),
        }
      )
    } else {
      const t = modal.task
      if (data.title !== t.title) {
        updateTask.mutate(
          { id: t.id, title: data.title },
          { onError: () => showToast('❌ Failed to update title') }
        )
      }
      if (data.priority !== t.priority) updateTaskStore(t.id, { priority: data.priority })
      if (data.columnId !== t.columnId) updateTaskStore(t.id, { columnId: data.columnId })
      showToast('Task updated')
    }
    setModal(null)
  }, [modal, createTask, updateTask, updateTaskStore, showToast])

  const handleDelete = useCallback((id: number) => {
    deleteTask.mutate(id, {
      onSuccess: () => showToast('Task deleted'),
      onError:   () => showToast('❌ Failed to delete task'),
    })
  }, [deleteTask, showToast])

  const handleToggle = useCallback((id: number, completed: boolean) => {
    updateTaskStore(id, { completed })                    // optimistic update
    updateTask.mutate({ id, completed }, {
      onSuccess: () => showToast(completed ? '✓ Task completed' : 'Task reopened'),
      onError:   () => {
        updateTaskStore(id, { completed: !completed })    // rollback
        showToast('❌ Failed to update task')
      },
    })
  }, [updateTaskStore, updateTask, showToast])

  if (isLoading) return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {SKELETON_COLORS.map((color) => (
          <div key={color} className="rounded-xl p-3.5 bg-[#F9FAFB] border border-gray-100"
            style={{ borderTopWidth: 3, borderTopColor: color }}>
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-4 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white rounded-lg mb-2.5 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  if (isError) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-red-500 font-medium">Failed to load tasks. Check your connection.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-5">

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900">📋 Movadex Project</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 h-9">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              placeholder="Search..."
              className="border-none outline-none text-[13px] w-36 bg-transparent"
            />
          </div>

          <button
            onClick={() => setModal({ mode: 'add', defaultColumn: 'design' })}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[13px] font-semibold hover:bg-indigo-700 transition-colors cursor-pointer border-none"
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {[
          { label: 'Total',         value: stats.total,      color: 'text-gray-700'   },
          { label: 'Completed',     value: stats.completed,  color: 'text-green-800'  },
          { label: 'High priority', value: stats.highCount,  color: 'text-red-800'    },
          { label: 'In progress',   value: stats.inProgress, color: 'text-blue-600'   },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg p-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter({ activeFilter: f.id })}
            className={`px-3.5 py-1 rounded-full border text-xs cursor-pointer transition-colors ${
              filter.activeFilter === f.id
                ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
 
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
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

      {Math.ceil(totalTasks / 20) > 1 && <Pagination />}

      {modal && (
        <TaskModal modal={modal} onClose={() => setModal(null)} onSave={handleModalSave} />
      )}

      <Toast message={toast} />
    </div>
  )
}
