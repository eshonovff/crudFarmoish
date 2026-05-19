import { describe, it, expect } from 'vitest'
import { mapApiTodoToTask } from '../store/taskStore'

const COLUMN_IDS = ['design', 'frontend', 'backend', 'testing'] as const
const PRIORITIES = ['high', 'medium', 'low'] as const

describe('mapApiTodoToTask', () => {
  it('maps id, title, completed, userId', () => {
    const result = mapApiTodoToTask({ id: 7, todo: 'Write tests', completed: true, userId: 3 })
    expect(result.id).toBe(7)
    expect(result.title).toBe('Write tests')
    expect(result.completed).toBe(true)
    expect(result.userId).toBe(3)
  })

  it('assigns columnId by id % 4', () => {
    for (let id = 0; id < 8; id++) {
      const { columnId } = mapApiTodoToTask({ id, todo: '', completed: false, userId: 1 })
      expect(columnId).toBe(COLUMN_IDS[id % 4])
    }
  })

  it('assigns priority by id % 3', () => {
    for (let id = 0; id < 6; id++) {
      const { priority } = mapApiTodoToTask({ id, todo: '', completed: false, userId: 1 })
      expect(priority).toBe(PRIORITIES[id % 3])
    }
  })

  it('sets comments and attachments as positive integers', () => {
    const result = mapApiTodoToTask({ id: 5, todo: '', completed: false, userId: 1 })
    expect(result.comments).toBeGreaterThan(0)
    expect(result.attachments).toBeGreaterThan(0)
  })
})
