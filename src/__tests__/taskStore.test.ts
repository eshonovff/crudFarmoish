import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskStore } from '../store/taskStore'
import type { Task } from '../types/task'

const makeTask = (id: number, overrides: Partial<Task> = {}): Task => ({
  id, title: `Task ${id}`, completed: false, userId: 1,
  columnId: 'design', priority: 'medium',
  date: 'Today 09:00', comments: 2, attachments: 1,
  ...overrides,
})

beforeEach(() => {
  useTaskStore.setState({
    tasks: [], totalTasks: 0, page: 0,
    filter: { search: '', activeFilter: 'all' },
  })
})

describe('addTask', () => {
  it('prepends task to the list', () => {
    useTaskStore.getState().addTask(makeTask(1))
    useTaskStore.getState().addTask(makeTask(2))
    expect(useTaskStore.getState().tasks[0].id).toBe(2)
  })
})

describe('updateTask', () => {
  it('updates fields of matching task', () => {
    useTaskStore.getState().addTask(makeTask(1))
    useTaskStore.getState().updateTask(1, { title: 'Updated', completed: true })
    const task = useTaskStore.getState().tasks.find((t) => t.id === 1)!
    expect(task.title).toBe('Updated')
    expect(task.completed).toBe(true)
  })

  it('does not modify other tasks', () => {
    useTaskStore.getState().addTask(makeTask(1))
    useTaskStore.getState().addTask(makeTask(2))
    useTaskStore.getState().updateTask(1, { title: 'Changed' })
    expect(useTaskStore.getState().tasks.find((t) => t.id === 2)!.title).toBe('Task 2')
  })
})

describe('deleteTask', () => {
  it('removes task by id', () => {
    useTaskStore.getState().addTask(makeTask(1))
    useTaskStore.getState().addTask(makeTask(2))
    useTaskStore.getState().deleteTask(1)
    const ids = useTaskStore.getState().tasks.map((t) => t.id)
    expect(ids).not.toContain(1)
    expect(ids).toContain(2)
  })
})

describe('moveTask', () => {
  it('changes columnId of the moved task', () => {
    useTaskStore.getState().setTasks([
      makeTask(1, { columnId: 'design' }),
      makeTask(2, { columnId: 'frontend' }),
    ], 2)
    useTaskStore.getState().moveTask(1, 'backend', 0)
    const moved = useTaskStore.getState().tasks.find((t) => t.id === 1)!
    expect(moved.columnId).toBe('backend')
  })

  it('inserts task at correct index within destination column', () => {
    useTaskStore.getState().setTasks([
      makeTask(1, { columnId: 'design' }),
      makeTask(2, { columnId: 'design' }),
      makeTask(3, { columnId: 'design' }),
    ], 3)
    useTaskStore.getState().moveTask(1, 'design', 2)
    const designTasks = useTaskStore.getState().tasks.filter((t) => t.columnId === 'design')
    expect(designTasks[2].id).toBe(1)
  })

  it('does nothing when task id is not found', () => {
    useTaskStore.getState().setTasks([makeTask(1)], 1)
    useTaskStore.getState().moveTask(999, 'frontend', 0)
    expect(useTaskStore.getState().tasks).toHaveLength(1)
  })
})

describe('setFilter', () => {
  it('resets page to 0 on filter change', () => {
    useTaskStore.setState({ page: 5 })
    useTaskStore.getState().setFilter({ search: 'hello' })
    expect(useTaskStore.getState().page).toBe(0)
  })

  it('merges partial filter updates', () => {
    useTaskStore.getState().setFilter({ activeFilter: 'high' })
    useTaskStore.getState().setFilter({ search: 'api' })
    const { filter } = useTaskStore.getState()
    expect(filter.activeFilter).toBe('high')
    expect(filter.search).toBe('api')
  })
})
