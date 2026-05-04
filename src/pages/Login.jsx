import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, members, setMemberId } = useChapter()
  const [step, setStep] = useState('choose')
  const [search, setSearch] = useState('')

  const filtered = (members || []).filter(m =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white" style={{ background: 'linear-gradient(135deg, #0F1F6B 0%, #0a1445 100%)' }}>
        <div>
          <Link to="/" className="text-sm text-blue-300 hover:text-white transition-colors font-medium">
            ← Back to home
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="Circle Roster"
            className="w-36 h-36 object-contain mb-6 drop-shadow-2xl"
          />
          <h1 className="text-4xl font-bold leading-tight mb-3">
            Build Your Circle.
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Member directories, Big/Little family trees, and alumni connections — built for every kind of group.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 w-full">
            {[
              ['Directory', 'Search and browse every member'],
              ['Family Tree', 'Visualize mentor relationships'],
              ['Alumni', 'Stay connected after graduation'],
              ['Privacy', 'Members control their own info'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-white/10 rounded-xl p-4">
                <div className="font-semibold text-sm mb-1">{title}</div>
                <div className="text-blue-200 text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-blue-300 text-sm text-center">Built for fraternities, sororities, clubs &amp; more.</div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-8 gap-2">
            <img src="/logo.png" alt="Circle Roster" className="w-16 h-16 object-contain" />
            <span className="text-2xl font-bold text-[#0F1F6B] tracking-tight">Circle Roster</span>
            <span className="text-sm text-slate-500 font-medium">Build Your Circle.</span>
          </div>

          {step === 'choose' && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
              <p className="text-slate-500 text-sm mb-8">Sign in to access your chapter</p>
              <div className="space-y-3">
                <button
                  onClick={() => { login('admin'); navigate('/directory') }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  Enter as Admin (Demo)
                </button>
                <button
                  onClick={() => setStep('pick')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold border border-slate-200 transition-colors"
                >
                  Enter as Member (Demo)
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-8">
                Full login coming soon &mdash; Supabase auth integration in progress.
              </p>
            </>
          )}

          {step === 'pick' && (
            <>
              <button
                onClick={() => { setStep('choose'); setSearch('') }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Find your profile</h2>
              <p className="text-slate-500 text-sm mb-4">Select your name from the roster to continue as a member.</p>
              <input
                type="text"
                autoFocus
                placeholder="Search by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 mb-3"
              />
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-6">No members found.</p>
                ) : filtered.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMemberId(m.id)
                      login('member')
                      navigate('/directory')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {m.first_name[0]}{m.last_name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{m.first_name} {m.last_name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {[m.pledge_class, m.class_year ? `Class of ${m.class_year}` : ''].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      m.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>{m.status}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
