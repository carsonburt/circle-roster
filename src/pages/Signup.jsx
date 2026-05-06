import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'
import { supabase } from '../lib/supabase'
import { GROUP_TYPES } from '../lib/terminology'

const PRESET_COLORS = [
  '#1D5FE8', '#0F1F6B', '#7C3AED', '#DC2626',
  '#059669', '#D97706', '#0891B2', '#DB2777',
  '#16A34A', '#EA580C', '#4F46E5', '#0F766E',
]

const STEP_LABELS = ['Your group', 'Your account', 'Brand color', "You're ready"]

export default function Signup() {
  const navigate = useNavigate()
  const { resetToFreshChapter, addMember, setMemberId, login, refreshChapter } = useChapter()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [signupError, setSignupError] = useState('')

  // Step 0
  const [groupName, setGroupName] = useState('')
  const [groupType, setGroupType] = useState('fraternity')

  // Step 1
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)

  // Step 2
  const [color, setColor] = useState('#1D5FE8')

  async function handleSetup() {
    setSubmitting(true)
    setSignupError('')

    if (!supabase) {
      // No Supabase configured — demo/localStorage mode
      resetToFreshChapter({ name: groupName.trim(), type: groupType, primary_color: color })
      const adminId = addMember({
        first_name: firstName.trim(), last_name: lastName.trim(),
        email: email.trim(), password,
        status: 'active', position: 'Admin', is_admin: true,
        pledge_class: '', class_year: null, big_id: null,
        show_email: true, show_phone: true, show_linkedin: true,
        avatar_url: null, major: '', high_school: '', linkedin_url: '',
      })
      setMemberId(adminId)
      login('admin')
      setStep(3)
      setSubmitting(false)
      return
    }

    try {
      // 1. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })
      if (authError) throw authError

      const userId = authData.user.id
      const chapterId = crypto.randomUUID()
      const memberId = crypto.randomUUID()

      // 2. Create chapter record
      const { error: chapterError } = await supabase.from('chapters').insert({
        id: chapterId,
        name: groupName.trim(),
        type: groupType,
        primary_color: color,
      })
      if (chapterError) throw chapterError

      // 3. Create admin member linked to auth user
      const { error: memberError } = await supabase.from('members').insert({
        id: memberId,
        chapter_id: chapterId,
        user_id: userId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        is_admin: true,
        status: 'active',
        position: 'Admin',
        show_email: true,
        show_phone: true,
        show_linkedin: true,
      })
      if (memberError) throw memberError

      // 4. Create initial dues term
      const { error: dtError } = await supabase.from('dues_terms').insert({
        id: crypto.randomUUID(),
        chapter_id: chapterId,
        label: 'Current Term',
        finalized: false,
      })
      if (dtError) console.warn('dues_terms insert:', dtError.message)

      // 5. Load all data into context (auth listener may not have fired yet)
      await refreshChapter()

      setStep(3)
    } catch (err) {
      setSignupError(err.message || 'Setup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = step === 3 ? 100 : Math.round((step / 3) * 100)

  const step0Valid = groupName.trim().length > 0
  const step1Valid = firstName.trim() && lastName.trim() && email.trim() && password.length >= 6

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between flex-shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
          <span className="font-bold text-[#0F1F6B] tracking-tight">Circle Roster</span>
        </Link>
        <Link to="/login" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Have an account?{' '}
          <span className="font-semibold text-blue-600">Sign in</span>
        </Link>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100 flex-shrink-0">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Step dots */}
          {step < 3 && (
            <div className="flex items-center justify-center gap-1.5 mb-8">
              {STEP_LABELS.map((label, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      i < step  ? 'bg-blue-600 text-white' :
                      i === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                                   'bg-slate-200 text-slate-400'
                    }`}>
                      {i < step ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className={`w-10 h-px mb-4 ${i < step ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Step 0: Group info ───────────────────────────── */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Tell us about your group</h2>
              <p className="text-slate-500 text-sm mb-6">
                This sets up your directory and customizes labels to match your organization.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Organization name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Alpha Beta Gamma — Gamma Chapter"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && step0Valid) setStep(1) }}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Type of group</label>
                  <select
                    value={groupType}
                    onChange={e => setGroupType(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  >
                    {GROUP_TYPES.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1.5">
                    This customizes terminology like "Pledge Class", "Big", "Little" throughout the app.
                  </p>
                </div>
                <button
                  onClick={() => { if (step0Valid) setStep(1) }}
                  disabled={!step0Valid}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 mt-2"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 1: Admin account ────────────────────────── */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Create your admin account</h2>
              <p className="text-slate-500 text-sm mb-6">
                You'll use this to sign in and manage your chapter.
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">First name</label>
                    <input
                      type="text"
                      autoFocus
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium"
                    >
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-xs text-red-400 mt-1">At least 6 characters required</p>
                  )}
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setStep(0)}
                    className="px-5 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => { if (step1Valid) setStep(2) }}
                    disabled={!step1Valid}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Brand color ──────────────────────────── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Pick your brand color</h2>
              <p className="text-slate-500 text-sm mb-5">
                This colors your header, buttons, and accents throughout the app.
              </p>

              {/* Live preview */}
              <div className="rounded-xl p-4 mb-5 text-white" style={{ backgroundColor: color }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
                      {(firstName[0] || 'A')}{(lastName[0] || 'B')}
                    </div>
                    <span className="text-sm font-semibold">{groupName || 'Your Chapter'}</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {['Directory', 'Events', 'Polls'].map(l => (
                    <span key={l} className="text-xs bg-white/15 px-2.5 py-1 rounded-lg font-medium">{l}</span>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded-xl transition-all hover:scale-110 flex items-center justify-center ${color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <span className="text-white text-sm font-bold">✓</span>}
                  </button>
                ))}
              </div>

              {/* Custom picker */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border-0 cursor-pointer bg-transparent p-0"
                />
                <div>
                  <p className="text-xs font-medium text-slate-700">Custom color</p>
                  <p className="text-xs text-slate-400 font-mono">{color.toUpperCase()}</p>
                </div>
              </div>

              {signupError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {signupError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  onClick={handleSetup}
                  disabled={submitting}
                  className="flex-1 text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: color }}
                >
                  {submitting ? 'Setting up…' : 'Finish setup →'}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Done ─────────────────────────────────── */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
                style={{ backgroundColor: color + '20' }}
              >
                🎉
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {groupName} is ready!
              </h2>
              <p className="text-slate-500 text-sm mb-7 leading-relaxed">
                Your chapter is all set. Head to your admin panel to add members, set up events, and configure your directory.
              </p>

              <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 space-y-2.5">
                {[
                  ['✓', 'Chapter profile created', 'text-green-600'],
                  ['✓', 'Admin account set up', 'text-green-600'],
                  ['✓', 'Brand color applied', 'text-green-600'],
                ].map(([icon, label, cls]) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className={`font-bold text-sm ${cls}`}>{icon}</span>
                    <span className="text-sm text-slate-700">{label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full text-white py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: color }}
                >
                  Go to your dashboard →
                </button>
                <p className="text-xs text-slate-400">
                  You can add members, invite your roster, and customize everything from the admin panel.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
