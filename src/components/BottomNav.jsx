import { Link, useLocation } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

const IconDirectory = ({ filled }) => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.75} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
        <path d="M17 21H1v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2z"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    ) : (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </>
    )}
  </svg>
)

const IconCalendar = ({ filled }) => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={filled ? 0 : 1.75} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4H5V6h14v2zm-7 5h2v2h-2v-2zm-4 0h2v2H8v-2zm8 0h2v2h-2v-2zM8 16h2v2H8v-2zm4 0h2v2h-2v-2z"/>
    ) : (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </>
    )}
  </svg>
)

const IconTree = ({ filled }) => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" fill={filled ? 'currentColor' : 'none'}/>
    <circle cx="5" cy="20" r="2" fill={filled ? 'currentColor' : 'none'}/>
    <circle cx="19" cy="20" r="2" fill={filled ? 'currentColor' : 'none'}/>
    <line x1="12" y1="6" x2="12" y2="12"/>
    <line x1="12" y1="12" x2="5.7" y2="18"/>
    <line x1="12" y1="12" x2="18.3" y2="18"/>
  </svg>
)

const IconPoll = ({ filled }) => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 0 : 1.75} strokeLinecap="round" strokeLinejoin="round">
    {filled ? (
      <>
        <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor"/>
        <rect x="10" y="8" width="4" height="13" rx="1" fill="currentColor"/>
        <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor"/>
      </>
    ) : (
      <>
        <rect x="3" y="13" width="4" height="8" rx="1"/>
        <rect x="10" y="8" width="4" height="13" rx="1"/>
        <rect x="17" y="3" width="4" height="18" rx="1"/>
      </>
    )}
  </svg>
)

const IconSettings = ({ filled }) => (
  <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={filled ? 2 : 1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" fill={filled ? 'currentColor' : 'none'}/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
)

export default function BottomNav() {
  const location = useLocation()
  const { chapter, role } = useChapter()
  const brandColor = chapter?.primary_color || '#4F46E5'

  const tabs = [
    { to: '/directory', label: 'Directory', Icon: IconDirectory },
    { to: '/events', label: 'Events', Icon: IconCalendar },
    { to: '/polls', label: 'Polls', Icon: IconPoll },
    { to: '/tree', label: 'Tree', Icon: IconTree },
    ...(role === 'admin' ? [{ to: '/admin', label: 'Admin', Icon: IconSettings }] : []),
  ]

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {tabs.map(({ to, label, Icon }) => {
          const isActive = location.pathname === to ||
            (to === '/directory' && location.pathname.startsWith('/members'))
          return (
            <Link
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors"
              style={{ color: isActive ? brandColor : '#94A3B8' }}
            >
              <Icon filled={isActive} />
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? '' : 'font-medium'}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
