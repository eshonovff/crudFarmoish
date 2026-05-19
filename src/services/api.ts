import axios from 'axios'
import type { ApiResponse, ApiTodo } from '../types/task'

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: { 'Content-Type': 'application/json' },
})

export const fetchTodos = async (limit = 20, skip = 0): Promise<ApiResponse> => {
  const { data } = await api.get<ApiResponse>(`/todos?limit=${limit}&skip=${skip}`)
  return data
}

export const createTodo = async (todo: string): Promise<ApiTodo> => {
  const { data } = await api.post<ApiTodo>('/todos/add', {
    todo,
    completed: false,
    userId: 1,
  })
  return data
}

export const updateTodo = async (id: number, updates: Partial<Pick<ApiTodo, 'todo' | 'completed'>>): Promise<ApiTodo> => {
  const { data } = await api.put<ApiTodo>(`/todos/${id}`, updates)
  return data
}

export const deleteTodo = async (id: number): Promise<{ id: number; isDeleted: boolean }> => {
  const { data } = await api.delete(`/todos/${id}`)
  return data
}
