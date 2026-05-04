import { useState, useRef, useEffect, useMemo } from 'react'
import Tree from 'react-d3-tree'
import { Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

function buildTree(members, rootId = null) {
  return members
    .filter(m => m.big_id === rootId)
    .map(m => ({
      name: `${m.first_name} ${m.last_name}`,
      attributes: m.pledge_class ? { Cohort: m.pledge_class } : {},
      memberId: m.id,
      children: buildTree(members, m.id),
    }))
}

const STATUS_STYLES = {
  active:   'bg-emerald-100 text-emerald-700',
  alumni:   'bg-blue-100 text-blue-700',
  inactive: 'bg-slate-100 text-slate-500',
}

function MemberModal({ member, onClose, terminology: t, members }) {
  const mentor = member.big_id ? members.find(m => m.id === member.big_id) : null
  const mentees = members.filter(m => m.big_id === member.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
        >
          ×
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg flex-shrink-0 overflow-hidden">
            {member.avatar_url
              ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
              : `${member.first_name[0]}${member.last_name[0]}`
            }
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">
              {member.first_name} {member.last_name}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[member.status] || STATUS_STYLES.inactive}`}>
                {member.status}
              </span>
              {member.pledge_class && (
                <span className="text-xs text-slate-400">{member.pledge_class}</span>
              )}
              {member.class_year && (
                <span className="text-xs text-slate-400">· Class of {member.class_year}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {member.show_email && member.email && (
            <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
              <span className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400 flex-shrink-0">@</span>
              {member.email}
            </a>
          )}
          {member.show_phone && member.phone && (
            <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
              <span className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400 flex-shrink-0">#</span>
              {member.phone}
            </a>
          )}
          {member.show_linkedin && member.linkedin_url && (
            <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors">
              <span className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-xs font-bold text-slate-400 flex-shrink-0">in</span>
              LinkedIn Profile
            </a>
          )}
        </div>

        {(mentor || mentees.length > 0) && (
          <div className="border-t border-slate-100 pt-4 mb-5 space-y-2">
            {mentor && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-16 flex-shrink-0">{t.mentor}</span>
                <span className="text-slate-700 font-medium">{mentor.first_name} {mentor.last_name}</span>
              </div>
            )}
            {mentees.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-slate-400 w-16 flex-shrink-0">{t.mentees}</span>
                <span className="text-slate-700 font-medium">{mentees.map(m => `${m.first_name} ${m.last_name}`).join(', ')}</span>
              </div>
            )}
          </div>
        )}

        <Link
          to={`/members/${member.id}`}
          onClick={onClose}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  )
}

export default function FamilyTree() {
  const { chapter, members, terminology: t } = useChapter()
  const containerRef = useRef(null)
  const [translate, setTranslate] = useState(null)
  const [zoom, setZoom] = useState(0.75)
  const [selectedMember, setSelectedMember] = useState(null)

  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [highlightedId, setHighlightedId] = useState(null)
  const [pendingNavigate, setPendingNavigate] = useState(null)

  const brandColor = chapter?.primary_color || '#4F46E5'

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setTranslate({ x: width / 2, y: 60 })
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!pendingNavigate) return
    const container = containerRef.current
    if (!container) return

    const el = container.querySelector(`[data-member-id="${pendingNavigate}"]`)
    if (!el) { setPendingNavigate(null); return }

    const nodeRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const nodeCenterX = nodeRect.left + nodeRect.width / 2 - containerRect.left
    const nodeCenterY = nodeRect.top + nodeRect.height / 2 - containerRect.top

    // Place the node in the upper-left quadrant so the centered modal doesn't cover it
    const targetX = containerRect.width * 0.28
    const targetY = containerRect.height * 0.30

    setTranslate(prev => ({
      x: (prev?.x ?? 0) + targetX - nodeCenterX,
      y: (prev?.y ?? 0) + targetY - nodeCenterY,
    }))
    setPendingNavigate(null)
  }, [pendingNavigate])

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return []
    return members
      .filter(m => `${m.first_name} ${m.last_name}`.toLowerCase().includes(q))
      .slice(0, 8)
  }, [search, members])

  function navigateToMember(member) {
    setSearch(`${member.first_name} ${member.last_name}`)
    setSearchOpen(false)
    setHighlightedId(member.id)
    setPendingNavigate(member.id)
    setSelectedMember(member)
  }

  const treeData = { name: chapter.name, children: buildTree(members, null) }

  function handleNodeClick(nodeDatum, toggleNode) {
    if (nodeDatum.memberId) {
      const member = members.find(m => m.id === nodeDatum.memberId)
      if (member) {
        setHighlightedId(member.id)
        setSelectedMember(member)
        return
      }
    }
    toggleNode()
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <style>{`
        .rd3t-link { stroke: #E2E8F0 !important; stroke-width: 1.5px; fill: none; }
        .rd3t-tree-container { width: 100% !important; height: 100% !important; background: transparent !important; }
        .rd3t-svg { background: transparent !important; display: block; }
        .rd3t-grabbable { background: transparent !important; cursor: grab; }
        .rd3t-grabbable:active { cursor: grabbing; }
        .rd3t-svg text { stroke: none !important; -webkit-font-smoothing: antialiased; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 py-6 pb-24 sm:pb-6 w-full flex-1 flex flex-col">

        {/* Header row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-slate-900">{t.treeTitle}</h1>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Click a name to view · Scroll to zoom · Drag to pan
            </p>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Find a member…"
              value={search}
              onChange={e => { setSearch(e.target.value); setSearchOpen(true) }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Escape') { setSearchOpen(false); setSearch(''); setHighlightedId(null) }
                if (e.key === 'Enter' && searchResults.length > 0) navigateToMember(searchResults[0])
              }}
              className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 shadow-sm"
              style={{ '--tw-ring-color': brandColor }}
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchOpen(false); setHighlightedId(null) }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-lg leading-none"
              >
                ×
              </button>
            )}

            {/* Dropdown */}
            {searchOpen && search.trim() && (
              <div className="absolute top-full mt-1.5 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-400">No members found</p>
                ) : (
                  searchResults.map(m => (
                    <button
                      key={m.id}
                      onMouseDown={e => { e.preventDefault(); navigateToMember(m) }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left hover:bg-slate-50 ${
                        highlightedId === m.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                        {m.avatar_url
                          ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                          : `${m.first_name[0]}${m.last_name[0]}`
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{m.first_name} {m.last_name}</p>
                        <p className="text-xs text-slate-400 truncate">{m.position || m.pledge_class || '—'}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[m.status] || STATUS_STYLES.inactive}`}>
                        {m.status}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="text-sm text-slate-400 flex-shrink-0 hidden sm:block tabular-nums">
            {members.length} {t.members.toLowerCase()}
          </div>
        </div>

        {/* Tree canvas */}
        <div
          ref={containerRef}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm"
          style={{ height: '65vh', position: 'relative', overflow: 'hidden' }}
          onClick={() => setSearchOpen(false)}
        >
          {translate ? (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={translate}
              nodeSize={{ x: 220, y: 120 }}
              separation={{ siblings: 1.3, nonSiblings: 1.6 }}
              zoom={zoom}
              dimensions={{ width: containerRef.current?.offsetWidth, height: containerRef.current?.offsetHeight }}
              renderCustomNodeElement={({ nodeDatum, toggleNode }) => {
                const isRoot = !nodeDatum.memberId
                const cohort = nodeDatum.attributes?.Cohort
                const isHL = !isRoot && highlightedId === nodeDatum.memberId
                return (
                  <g
                    data-member-id={nodeDatum.memberId || undefined}
                    onClick={() => handleNodeClick(nodeDatum, toggleNode)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isRoot ? (
                      <rect x={-70} y={-20} width={140} height={40} rx={10} fill={brandColor} />
                    ) : (
                      <>
                        {isHL && (
                          <rect
                            x={-69} y={-30} width={138} height={cohort ? 60 : 44} rx={12}
                            fill="none" stroke={brandColor} strokeWidth={3} opacity={0.3}
                          />
                        )}
                        <rect
                          x={-65} y={-26} width={130} height={cohort ? 52 : 36} rx={10}
                          fill={isHL ? '#EEF2FF' : 'white'}
                          stroke={isHL ? brandColor : '#E2E8F0'}
                          strokeWidth={isHL ? 2 : 1}
                        />
                      </>
                    )}
                    <text
                      fill={isRoot ? 'white' : (isHL ? brandColor : '#0F172A')}
                      textAnchor="middle"
                      dy={isRoot ? 5 : (cohort ? -6 : 5)}
                      fontSize={isRoot ? 12 : 11}
                      fontWeight={isRoot ? '600' : (isHL ? '700' : '500')}
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                      textRendering="geometricPrecision"
                      stroke="none"
                    >
                      {nodeDatum.name}
                    </text>
                    {!isRoot && cohort && (
                      <text
                        fill={isHL ? brandColor : '#94A3B8'}
                        textAnchor="middle"
                        dy={13}
                        fontSize={10}
                        fontWeight="400"
                        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                        textRendering="geometricPrecision"
                        stroke="none"
                      >
                        {cohort}
                      </text>
                    )}
                  </g>
                )
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">Loading…</div>
          )}
        </div>
      </div>

      <BottomNav />

      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => { setSelectedMember(null); setHighlightedId(null) }}
          terminology={t}
          members={members}
        />
      )}
    </div>
  )
}
