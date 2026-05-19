import Board from './components/Board/Board'
import { TaskProvider } from './store/TaskContext'

export default function App() {
  return (
    <TaskProvider>
      <Board />
    </TaskProvider>
  )
}
