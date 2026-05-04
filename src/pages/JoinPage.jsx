import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

const TOTAL_STEPS = 3

function ProgressBar({ step, brandColor }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              i + 1 < step ? 'text-white' :
              i + 1 === step ? 'text-white ring-4 ring-offset-2' :
              'bg-slate-100 text-slate-400'
            }`}
            style={i + 1 <= step ? { backgroundColor: brandColor, ringColor: `${brandColor}33` } : {}}
          >
            {i + 1 < step ? '✓' : i + 1}
          </div>
          {i < TOTAL_STEPS - 1 && (
            <div className="flex-1 h-0.5 rounded-full overflow-hidden bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: step > i + 1 ? '100%' : '0%', backgroundColor: brandColor }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function JoinPage() {
  const [searchParams] = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const { chapter, addMember, terminology: t } = useChapter()
  const navigate = useNavigate()
  const brandColor = chapter?.primary_color || '#4F46E5'

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: emailParam,
    phone: '',
    linkedin_url: '',
    pledge_class: '',
    class_year: '',
    major: '',
    high_school: '',
    show_email: true,
    show_phone: true,
    show_linkedin: false,
  })

  const f = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  function handleSubmit() {
    addMember({
      ...form,
      class_year: form.class_year ? parseInt(form.class_year) : null,
      status: 'active',
      big_id: null,
      avatar_url: null,
    })
    setSubmitted(true)
    setTimeout(() => navigate('/directory'), 3000)
  }

  const stepLabels = ['Your name', 'Contact info', 'Chapter details']

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center max-w-sm w-full">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5"
            style={{ backgroundColor: brandColor }}
          >
            ✓
          </div>
          {chapter?.logo_url && (
            <img src={chapter.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover mx-auto mb-3" />
          )}
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Welcome to {chapter?.name}!
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Your profile has been added. You'll be redirected to the member directory shortly.
          </p>
          <Link
            to="/directory"
            className="block w-full text-center text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: brandColor }}
          >
            Go to directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Header */}
      <div
        className="text-white px-4 pt-10 pb-12"
        style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}bb 100%)` }}
      >
        <div className="max-w-md mx-auto text-center">
          {chapter?.logo_url && (
            <img
              src={chapter.logo_url}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover mx-auto mb-3 border-2 border-white/30"
            />
          )}
          <h1 className="text-xl font-bold">{chapter?.name}</h1>
          <p className="text-white/70 mt-1 text-sm">You've been invited to join the member directory</p>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md w-full mx-auto px-4 -mt-6 pb-10 flex-1">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <ProgressBar step={step} brandColor={brandColor} />

          {/* Step label */}
          <div className="mb-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
              Step {step} of {TOTAL_STEPS}
            </p>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{stepLabels[step - 1]}</h2>
          </div>

          {/* ── Step 1: Name ────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={form.first_name}
                    onChange={e => f('first_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-shadow"
                    style={{ '--tw-ring-color': brandColor }}
                    onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                    onBlur={e => e.target.style.boxShadow = ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={e => f('last_name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                    onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                    onBlur={e => e.target.style.boxShadow = ''}
                  />
                </div>
              </div>

              {/* Live preview */}
              {(form.first_name || form.last_name) && (
                <div className="bg-slate-50 rounded-xl p-3.5 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: brandColor }}
                  >
                    {form.first_name[0] || ''}{form.last_name[0] || ''}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {form.first_name} {form.last_name}
                    </p>
                    <p className="text-xs text-slate-400">Preview of your member card</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => { if (form.first_name && form.last_name) setStep(2) }}
                disabled={!form.first_name || !form.last_name}
                className="w-full text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: brandColor }}
              >
                Continue →
              </button>
            </div>
          )}

          {/* ── Step 2: Contact ─────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  autoFocus
                  value={form.email}
                  onChange={e => f('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => f('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={form.linkedin_url}
                  onChange={e => f('linkedin_url', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">Who can see your contact info?</p>
                <div className="space-y-2.5">
                  {[
                    ['show_email', 'Show email to other members'],
                    ['show_phone', 'Show phone to other members'],
                    ['show_linkedin', 'Show LinkedIn to other members'],
                  ].map(([field, label]) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          form[field] ? 'border-transparent text-white' : 'border-slate-300 bg-white'
                        }`}
                        style={form[field] ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
                      >
                        {form[field] && <span className="text-xs font-bold">✓</span>}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form[field]}
                        onChange={e => f(field, e.target.checked)}
                      />
                      <span
                        className="text-sm text-slate-600"
                        onClick={() => f(field, !form[field])}
                      >
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 text-slate-600 py-3 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: brandColor }}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Chapter details ──────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.cohort} <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  autoFocus
                  placeholder={`e.g. Fall 2024`}
                  value={form.pledge_class}
                  onChange={e => f('pledge_class', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation year <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="number"
                  placeholder="e.g. 2028"
                  min="2000"
                  max="2040"
                  value={form.class_year}
                  onChange={e => f('class_year', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major / Minor <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Math minor"
                  value={form.major}
                  onChange={e => f('major', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">High School <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  placeholder="e.g. Lincoln High School"
                  value={form.high_school}
                  onChange={e => f('high_school', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-shadow"
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${brandColor}40`}
                  onBlur={e => e.target.style.boxShadow = ''}
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your profile summary</p>
                {[
                  ['Name', `${form.first_name} ${form.last_name}`],
                  ['Email', form.email || '—'],
                  ['Phone', form.phone || '—'],
                  [t.cohort, form.pledge_class || '—'],
                  ['Grad year', form.class_year || '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 text-slate-600 py-3 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 text-white py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: brandColor }}
                >
                  Join {chapter?.name}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Already a member?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: brandColor }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
