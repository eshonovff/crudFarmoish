import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/api'
import { useTaskContext, mapApiTodoToTask } from '../store/TaskContext'
import type { ColumnId, Priority } from '../types/task'

const PAGE_SIZE = 20

export function useFetchTasks() {
  const { state, dispatch } = useTaskContext()
  const { page } = state

  const query = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(PAGE_SIZE, page * PAGE_SIZE),
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (query.data) {
      const tasks = query.data.todos.map(mapApiTodoToTask)
      dispatch({ type: 'SET_TASKS', payload: { tasks, total: query.data.total } })
    }
  }, [query.data, dispatch])

  return query
}

export function useCreateTask() {
  const { dispatch } = useTaskContext()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ title }: { title: string; columnId: ColumnId; priority: Priority }) =>
      createTodo(title),
    onSuccess: (data, variables) => {
      const task = mapApiTodoToTask(data)
      dispatch({
        type: 'ADD_TASK',
        payload: { ...task, columnId: variables.columnId, priority: variables.priority },
      })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useUpdateTask() {
  const { dispatch } = useTaskContext()

  return useMutation({
    mutationFn: ({ id, title, completed }: { id: number; title?: string; completed?: boolean }) =>
      updateTodo(id, { todo: title, completed }),
    onSuccess: (_data, variables) => {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: variables.id,
          updates: {
            ...(variables.title !== undefined && { title: variables.title }),
            ...(variables.completed !== undefined && { completed: variables.completed }),
          },
        },
      })
    },
  })
}

export function useDeleteTask() {
  const { dispatch } = useTaskContext()

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: (_, id) => {
      dispatch({ type: 'DELETE_TASK', payload: id })
    },
  })
}
