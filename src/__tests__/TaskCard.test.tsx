import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import TaskCard from '../components/Card/TaskCard'
import type { Task } from '../types/task'

const task: Task = {
  id: 1, title: 'Fix login bug', completed: false, userId: 2,
  columnId: 'backend', priority: 'high',
  date: 'Today 09:00', comments: 3, attachments: 2,
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="test">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

function renderCard(overrides: Partial<Task> = {}, handlers = {}) {
  const props = {
    task: { ...task, ...overrides },
    index: 0,
    onEdit:   vi.fn(),
    onDelete: vi.fn(),
    onToggle: vi.fn(),
    ...handlers,
  }
  return { ...render(<TaskCard {...props} />, { wrapper: Wrapper }), props }
}

describe('TaskCard', () => {
  it('renders title', () => {
    renderCard()
    expect(screen.getByText('Fix login bug')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    renderCard()
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('renders date, comments and attachments', () => {
    renderCard()
    expect(screen.getByText('Today 09:00')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('applies line-through style when completed', () => {
    renderCard({ completed: true })
    expect(screen.getByText('Fix login bug')).toHaveClass('line-through')
  })

  it('calls onDelete with task id when Delete clicked', async () => {
    const onDelete = vi.fn()
    renderCard({}, { onDelete })
    await userEvent.click(screen.getByTitle('Delete'))
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('calls onToggle with toggled value when Complete clicked', async () => {
    const onToggle = vi.fn()
    renderCard({ completed: false }, { onToggle })
    await userEvent.click(screen.getByTitle('Complete'))
    expect(onToggle).toHaveBeenCalledWith(1, true)
  })

  it('calls onEdit with task when Edit clicked', async () => {
    const onEdit = vi.fn()
    renderCard({}, { onEdit })
    await userEvent.click(screen.getByTitle('Edit'))
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
  })

  it('shows Reopen button when task is completed', () => {
    renderCard({ completed: true })
    expect(screen.getByTitle('Reopen')).toBeInTheDocument()
  })
})
