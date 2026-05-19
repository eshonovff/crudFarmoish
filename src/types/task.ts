export type Priority = 'high' | 'medium' | 'low'

export type ColumnId = 'design' | 'frontend' | 'backend' | 'testing'

export interface ApiTodo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export interface ApiResponse {
  todos: ApiTodo[]
  total: number
  skip: number
  limit: number
}

export interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
  columnId: ColumnId
  priority: Priority
  date: string
  comments: number
  attachments: number
}

export interface Column {
  id: ColumnId
  title: string
  tasks: Task[]
}

export interface FilterState {
  search: string
  priority: Priority | 'all'
}
