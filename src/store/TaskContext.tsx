import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Task, ColumnId, FilterState, Priority } from '../types/task'
import type { ApiTodo } from '../types/task'

const COLUMN_IDS: ColumnId[] = ['design', 'frontend', 'backend', 'testing']
const PRIORITIES: Priority[] = ['high', 'medium', 'low']
const DATES = [
  'Today 09:00', 'Today 11:00', 'Today 13:00', 'Today 14:00',
  'Tomorrow 16:00', 'Wednesday 11:00', 'Thursday 09:00', 'Thursday 12:30',
]

export const mapApiTodoToTask = (todo: ApiTodo): Task => ({
  id: todo.id,
  title: todo.todo,
  completed: todo.completed,
  userId: todo.userId,
  columnId: COLUMN_IDS[todo.id % 4],
  priority: PRIORITIES[todo.id % 3],
  date: DATES[todo.id % DATES.length],
  comments: (todo.id % 8) + 1,
  attachments: (todo.id % 3) + 1,
})

interface State {
  tasks: Task[]
  filter: FilterState
  page: number
  totalTasks: number
}

type Action =
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; total: number } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'MOVE_TASK'; payload: { taskId: number; toColumn: ColumnId; toIndex: number } }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'SET_PAGE'; payload: number }

const initialState: State = {
  tasks: [],
  filter: { search: '', priority: 'all' },
  page: 0,
  totalTasks: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload.tasks, totalTasks: action.payload.total }

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }

    case 'MOVE_TASK': {
      const { taskId, toColumn, toIndex } = action.payload
      const task = state.tasks.find(t => t.id === taskId)
      if (!task) return state

      const filtered = state.tasks.filter(t => t.id !== taskId)
      const targetColumnTasks = filtered.filter(t => t.columnId === toColumn)
      const otherTasks = filtered.filter(t => t.columnId !== toColumn)

      const updatedTask = { ...task, columnId: toColumn }
      targetColumnTasks.splice(toIndex, 0, updatedTask)

      return { ...state, tasks: [...otherTasks, ...targetColumnTasks] }
    }

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload }, page: 0 }

    case 'SET_PAGE':
      return { ...state, page: action.payload }

    default:
      return state
  }
}

interface TaskContextValue {
  state: State
  dispatch: React.Dispatch<Action>
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used inside TaskProvider')
  return ctx
}
