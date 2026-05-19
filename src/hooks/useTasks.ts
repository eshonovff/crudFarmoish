import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../services/api'
import { useTaskStore, mapApiTodoToTask } from '../store/taskStore'
import type { ColumnId, Priority } from '../types/task'

const PAGE_SIZE = 20

export function useFetchTasks() {
  const { page, setTasks } = useTaskStore()

  const query = useQuery({
    queryKey: ['todos', page],
    queryFn:  () => fetchTodos(PAGE_SIZE, page * PAGE_SIZE),
    staleTime: 1000 * 60 * 2,
  })

  useEffect(() => {
    if (query.data) {
      setTasks(query.data.todos.map(mapApiTodoToTask), query.data.total)
    }
  }, [query.data, setTasks])

  return query
}

export function useCreateTask() {
  const { addTask } = useTaskStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ title }: { title: string; columnId: ColumnId; priority: Priority }) =>
      createTodo(title),
    onSuccess: (data, variables) => {
      const task = mapApiTodoToTask(data)
      addTask({ ...task, columnId: variables.columnId, priority: variables.priority })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useUpdateTask() {
  const { updateTask } = useTaskStore()

  return useMutation({
    mutationFn: ({ id, title, completed }: { id: number; title?: string; completed?: boolean }) =>
      updateTodo(id, { todo: title, completed }),
    onSuccess: (_data, variables) => {
      updateTask(variables.id, {
        ...(variables.title     !== undefined && { title:     variables.title }),
        ...(variables.completed !== undefined && { completed: variables.completed }),
      })
    },
  })
}

export function useDeleteTask() {
  const { deleteTask } = useTaskStore()

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess:  (_, id) => deleteTask(id),
  })
}
