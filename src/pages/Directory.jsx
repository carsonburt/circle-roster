import { useState, useMemo } from 'react'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import MemberCard from '../components/MemberCard'

function darken(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - amount)
  const g = Math.max(0, ((n >> 8) & 0xff) - amount)
  const b = Math.max(0, (n & 0xff) - amount)
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export default function Directory() {
  const { chapter, members, announcements, terminology: t } = useChapter()
  const [annDismissed, setAnnDismissed] = useState(false)
  const pinnedAnn = announcements?.find(a => a.pinned)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const brandColor = chapter?.primary_color
  const headerStyle = brandColor
    ? { background: `linear-gradient(135deg, ${brandColor} 0%, ${darken(brandColor, 45)} 100%)` }
    : {}
  const headerClass = brandColor ? '' : 'bg-gradient-to-br from-blue-600 to-blue-800'

  const years = useMemo(() => {
    const set = new Set(members.map(m => m.class_year).filter(Boolean))
    return Array.from(set).sort((a, b) => a - b)
  }, [members])

  const cohorts = useMemo(() => {
    const set = new Set(members.map(m => m.pledge_class).filter(Boolean))
    return Array.from(set).sort()
  }, [members])

  const filtered = members.filter(m => {
    const matchesSearch = `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter
    const matchesYear = yearFilter === 'all' || String(m.class_year) === yearFilter
    return matchesSearch && matchesStatus && matchesYear
  })

  const counts = {
    active:  members.filter(m => m.status === 'active').length,
    alumni:  members.filter(m => m.status === 'alumni').length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className={`text-white ${headerClass}`} style={headerStyle}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
          {chapter?.organization && (
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">{chapter.organization}</p>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">{chapter?.name}</h1>
          <div className="flex gap-4 sm:gap-8">
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold tabular-nums">{counts.active}</div>
              <div className="text-white/70 text-xs font-medium mt-0.5">Active</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold tabular-nums">{counts.alumni}</div>
              <div className="text-white/70 text-xs font-medium mt-0.5">Alumni</div>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
              <div className="text-2xl font-bold tabular-nums">{members.length}</div>
              <div className="text-white/70 text-xs font-medium mt-0.5">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned announcement banner */}
      {pinnedAnn && !annDismissed && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-3">
            <span className="text-amber-500 flex-shrink-0 text-base mt-0.5">📌</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900 text-sm">{pinnedAnn.title}</p>
              <p className="text-amber-700 text-xs mt-0.5 line-clamp-2">{pinnedAnn.body}</p>
            </div>
            <button
              onClick={() => setAnnDismissed(true)}
              className="text-amber-400 hover:text-amber-700 text-xl leading-none flex-shrink-0 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        {/* Search + filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 space-y-3">
          <input
            type="text"
            placeholder={`Search ${t.members.toLowerCase()} by name...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Status</span>
              {['all', 'active', 'alumni', 'inactive'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {years.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Class Year</span>
                <button
                  onClick={() => setYearFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    yearFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {years.map(y => (
                  <button
                    key={y}
                    onClick={() => setYearFilter(String(y))}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      yearFilter === String(y) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-500 font-medium">No {t.members.toLowerCase()} found</p>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400 mb-3">
              Showing {filtered.length} of {members.length} {t.members.toLowerCase()}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(m => <MemberCard key={m.id} member={m} />)}
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
