import { useState } from 'react'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

const VOTER_ID = 'demo'

function ResultBars({ poll, myVote, brandColor }) {
  const totalVotes = Object.keys(poll.votes).length
  const counts = poll.options.reduce((acc, opt) => {
    acc[opt.id] = Object.values(poll.votes).filter(v => v === opt.id).length
    return acc
  }, {})
  const maxCount = Math.max(...Object.values(counts), 1)

  return (
    <div className="space-y-2.5">
      {poll.options.map(opt => {
        const count = counts[opt.id] || 0
        const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0
        const isWinner = !poll.closed ? false : count === maxCount && count > 0
        const isMyVote = myVote === opt.id
        return (
          <div key={opt.id}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium flex items-center gap-1.5 ${isMyVote ? '' : 'text-slate-700'}`}
                style={isMyVote ? { color: brandColor } : {}}>
                {isMyVote && <span className="text-xs font-bold">✓</span>}
                {opt.text}
                {isWinner && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold ml-1">Winner</span>}
              </span>
              <span className="text-xs text-slate-400 tabular-nums">{count} vote{count !== 1 ? 's' : ''} · {pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isMyVote ? brandColor : isWinner ? brandColor : '#CBD5E1',
                  opacity: isMyVote || isWinner ? 1 : 0.7,
                }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-xs text-slate-400 mt-1">{totalVotes} total vote{totalVotes !== 1 ? 's' : ''}</p>
    </div>
  )
}

function PollCard({ poll, onVote, brandColor }) {
  const [selected, setSelected] = useState(null)
  const myVote = poll.votes[VOTER_ID]
  const hasVoted = !!myVote
  const showResults = hasVoted || poll.closed

  const d = poll.closes_at ? new Date(poll.closes_at) : null
  const closesStr = d ? d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="font-bold text-slate-900 text-base leading-snug">{poll.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 mt-0.5 ${
          poll.closed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {poll.closed ? 'Closed' : 'Open'}
        </span>
      </div>
      {poll.description && <p className="text-sm text-slate-500 mb-4">{poll.description}</p>}
      {closesStr && !poll.closed && (
        <p className="text-xs text-slate-400 mb-4">Closes {closesStr}</p>
      )}

      {showResults ? (
        <ResultBars poll={poll} myVote={myVote} brandColor={brandColor} />
      ) : (
        <div className="space-y-2">
          {poll.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all text-sm font-medium ${
                selected === opt.id
                  ? 'border-current text-current bg-blue-50'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
              style={selected === opt.id ? { borderColor: brandColor, color: brandColor } : {}}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                selected === opt.id ? 'border-current' : 'border-slate-300'
              }`}
              style={selected === opt.id ? { borderColor: brandColor } : {}}>
                {selected === opt.id && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                )}
              </div>
              {opt.text}
            </button>
          ))}
          <button
            onClick={() => { if (selected) onVote(poll.id, selected) }}
            disabled={!selected}
            className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor }}
          >
            Submit Vote
          </button>
        </div>
      )}
    </div>
  )
}

export default function Polls() {
  const { chapter, polls, castVote, terminology: t } = useChapter()
  const brandColor = chapter?.primary_color || '#4F46E5'

  const openPolls = polls.filter(p => !p.closed)
  const closedPolls = polls.filter(p => p.closed)

  function handleVote(pollId, optionId) {
    castVote(pollId, VOTER_ID, optionId)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="text-white px-4 pt-8 pb-12" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}bb 100%)` }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Polls & Voting</h1>
          <p className="text-white/70 mt-1 text-sm">
            {openPolls.length} open · {closedPolls.length} closed
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 -mt-6 pb-24 sm:pb-10 space-y-4">

        {openPolls.length === 0 && closedPolls.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-sm shadow-sm">
            No polls yet. Admins can create polls in the Admin panel.
          </div>
        )}

        {openPolls.map(poll => (
          <PollCard key={poll.id} poll={poll} onVote={handleVote} brandColor={brandColor} />
        ))}

        {closedPolls.length > 0 && (
          <>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide pt-2">Past Polls</p>
            {closedPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} onVote={handleVote} brandColor={brandColor} />
            ))}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
