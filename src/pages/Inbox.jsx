import { useEffect } from 'react'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

const TYPE_ICONS = {
  password_reset_request: '🔑',
  profile_approved: '✅',
  profile_rejected: '❌',
  password_changed: '🔒',
  general: '📬',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function Inbox() {
  const { memberId, notifications, markNotificationRead, deleteNotification } = useChapter()

  const mine = notifications.filter(n => n.toMemberId === memberId)

  useEffect(() => {
    mine.filter(n => !n.read).forEach(n => markNotificationRead(n.id))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        <h1 className="text-xl font-bold text-slate-900 mb-5">Inbox</h1>
        {mine.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">📬</div>
            <p className="text-slate-500 font-medium">No notifications yet</p>
            <p className="text-slate-400 text-sm mt-1">You'll see updates here when things happen on your account.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mine.map(n => (
              <div
                key={n.id}
                className={`bg-white rounded-2xl border p-4 flex items-start gap-3 ${
                  n.read ? 'border-slate-200' : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[n.type] || '📬'}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-slate-300 hover:text-slate-500 text-xl leading-none flex-shrink-0 transition-colors"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
