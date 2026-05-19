import { create } from 'zustand'
import type { Task, ColumnId, FilterState, Priority, ApiTodo } from '../types/task'

const COLUMN_IDS: ColumnId[]  = ['design', 'frontend', 'backend', 'testing']
const PRIORITIES: Priority[]  = ['high', 'medium', 'low']
const DATES = [
  'Today 09:00', 'Today 11:00', 'Today 13:00', 'Today 14:00',
  'Tomorrow 16:00', 'Wednesday 11:00', 'Thursday 09:00', 'Thursday 12:30',
]

export const mapApiTodoToTask = (todo: ApiTodo): Task => ({
  id:          todo.id,
  title:       todo.todo,
  completed:   todo.completed,
  userId:      todo.userId,
  columnId:    COLUMN_IDS[todo.id % 4],
  priority:    PRIORITIES[todo.id % 3],
  date:        DATES[todo.id % DATES.length],
  comments:    (todo.id % 8) + 1,
  attachments: (todo.id % 3) + 1,
})

interface TaskStore {
  tasks:      Task[]
  filter:     FilterState
  page:       number
  totalTasks: number

  setTasks:   (tasks: Task[], total: number) => void
  addTask:    (task: Task) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  moveTask:   (taskId: number, toColumn: ColumnId, toIndex: number) => void
  setFilter:  (filter: Partial<FilterState>) => void
  setPage:    (page: number) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks:      [],
  filter:     { search: '', activeFilter: 'all' },
  page:       0,
  totalTasks: 0,

  setTasks: (tasks, total) =>
    set({ tasks, totalTasks: total }),

  addTask: (task) =>
    set((s) => ({ tasks: [task, ...s.tasks] })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  moveTask: (taskId, toColumn, toIndex) =>
    set((s) => {
      const task = s.tasks.find((t) => t.id === taskId)
      if (!task) return s

      const without  = s.tasks.filter((t) => t.id !== taskId)
      const inCol    = without.filter((t) => t.columnId === toColumn)
      const rest     = without.filter((t) => t.columnId !== toColumn)

      inCol.splice(toIndex, 0, { ...task, columnId: toColumn })
      return { tasks: [...inCol, ...rest] }
    }),

  setFilter: (filter) =>
    set((s) => ({ filter: { ...s.filter, ...filter }, page: 0 })),

  setPage: (page) =>
    set({ page }),
}))
