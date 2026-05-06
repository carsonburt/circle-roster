import { Navigate } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

export default function PrivateRoute({ children, adminOnly = false }) {
  const { role, loading } = useChapter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading…</p>
        </div>
      </div>
    )
  }

  if (!role) return <Navigate to="/login" replace />
  if (adminOnly && role !== 'admin') return <Navigate to="/directory" replace />
  return children
}
