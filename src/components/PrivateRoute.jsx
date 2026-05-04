import { Navigate } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

export default function PrivateRoute({ children, adminOnly = false }) {
  const { role } = useChapter()
  if (!role) return <Navigate to="/login" replace />
  if (adminOnly && role !== 'admin') return <Navigate to="/directory" replace />
  return children
}
