import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, members, setMemberId, resetToMockData } = useChapter()

  const [step, setStep] = useState('choose') // 'choose' | 'pick' | 'password'
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const filtered = (members || []).filter(m =>
    `${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase())
  )

  function handleDemoLogin() {
    resetToMockData()
    login('admin')
    navigate('/directory')
  }

  function handleMemberSelect(m) {
    setSelectedMember(m)
    setPassword('')
    setPasswordError(false)
    setStep('password')
  }

  function handlePasswordSubmit(e) {
    e.preventDefault()
    const correct = selectedMember.password || 'password'
    if (password === correct) {
      setMemberId(selectedMember.id)
      login(selectedMember.is_admin ? 'admin' : 'member')
      navigate('/directory')
    } else {
      setPasswordError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white" style={{ background: 'linear-gradient(135deg, #0F1F6B 0%, #0a1445 100%)' }}>
        <div>
          <Link to="/" className="text-sm text-blue-300 hover:text-white transition-colors font-medium">
            ← Back to home
          </Link>
        </div>
        <div className="flex flex-col items-center text-center">
          <img src="/logo.png" alt="Circle Roster" className="w-36 h-36 object-contain mb-6 drop-shadow-2xl" />
          <h1 className="text-4xl font-bold leading-tight mb-3">Build Your Circle.</h1>
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

          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8 gap-2">
            <img src="/logo.png" alt="Circle Roster" className="w-16 h-16 object-contain" />
            <span className="text-2xl font-bold text-[#0F1F6B] tracking-tight">Circle Roster</span>
          </div>

          {/* ── Step: choose ───────────────────────────────── */}
          {step === 'choose' && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome</h2>
              <p className="text-slate-500 text-sm mb-7">Choose how you'd like to continue.</p>

              {/* Demo option */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg flex-shrink-0">🎮</div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Explore the Demo</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      See all features with sample chapter data. No account needed — just click and explore.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDemoLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Try demo →
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center my-5">
                <div className="flex-1 border-t border-slate-200" />
                <span className="mx-3 text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 border-t border-slate-200" />
              </div>

              {/* Real account option */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-lg flex-shrink-0">🔐</div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Sign in to your chapter</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Access your real chapter data with your member account.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep('pick')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Find my profile →
                </button>
              </div>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                  Get started free →
                </Link>
              </p>
            </>
          )}

          {/* ── Step: pick member ──────────────────────────── */}
          {step === 'pick' && (
            <>
              <button
                onClick={() => { setStep('choose'); setSearch('') }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Find your profile</h2>
              <p className="text-slate-500 text-sm mb-4">Select your name from the roster to continue.</p>
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
                    onClick={() => handleMemberSelect(m)}
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

          {/* ── Step: password ─────────────────────────────── */}
          {step === 'password' && selectedMember && (
            <>
              <button
                onClick={() => { setStep('pick'); setPassword(''); setPasswordError(false) }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-5 inline-flex items-center gap-1 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3 mb-6 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {selectedMember.first_name[0]}{selectedMember.last_name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">{selectedMember.first_name} {selectedMember.last_name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {[selectedMember.pledge_class, selectedMember.class_year ? `Class of ${selectedMember.class_year}` : ''].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setPasswordError(false) }}
                      className={`w-full border rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 ${
                        passwordError ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-xs text-red-500 mt-1.5 font-medium">Incorrect password. Try again.</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm"
                >
                  Sign in
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
