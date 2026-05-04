import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

export default function Navbar() {
  const { chapter, role, members, logout } = useChapter()
  const location = useLocation()
  const navigate = useNavigate()

  const brandColor = chapter?.primary_color || '#4F46E5'

  const links = [
    { to: '/directory', label: 'Directory' },
    { to: '/events', label: 'Events' },
    { to: '/polls', label: 'Polls' },
    { to: '/tree', label: 'Family Tree' },
    ...(role === 'admin' ? [{ to: '/admin', label: 'Admin' }] : []),
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link
              to="/directory"
              className="font-bold text-lg tracking-tight flex items-center gap-2.5 min-w-0"
              style={{ color: brandColor }}
            >
              {chapter?.logo_url && (
                <img
                  src={chapter.logo_url}
                  alt=""
                  className="w-9 h-9 object-contain flex-shrink-0"
                />
              )}
              <span className="truncate">{chapter?.name || 'Circle Roster'}</span>
            </Link>
            <div className="hidden sm:flex items-center gap-0.5">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    location.pathname === link.to
                      ? 'text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  style={location.pathname === link.to ? { backgroundColor: brandColor } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:block text-xs text-slate-400 tabular-nums">
              {members?.length || 0} members
            </span>
            {role === 'admin' && (
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: brandColor }}>
                Admin
              </span>
            )}
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="text-sm text-slate-400 hover:text-slate-700 transition-colors font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
