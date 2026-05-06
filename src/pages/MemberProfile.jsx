import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'

const AVATAR_COLORS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-sky-400 to-sky-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
]
function avatarColor(name) {
  const i = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_COLORS.length
  return AVATAR_COLORS[i]
}

const STATUS_STYLES = {
  active:   'bg-emerald-100 text-emerald-700',
  alumni:   'bg-blue-100 text-blue-700',
  inactive: 'bg-slate-100 text-slate-500',
}

export default function MemberProfile() {
  const { id } = useParams()
  const { chapter, members, role, memberId, pendingEdits, submitProfileEdit, updateMember, addNotification, requestPasswordReset, terminology: t, pointLedger, pointCategories } = useChapter()

  const member = members.find(m => m.id === id)
  const mentor = member?.big_id ? members.find(m => m.id === member.big_id) : null
  const mentees = members.filter(m => m.big_id === id)
  const isAdmin = role === 'admin'
  const isOwnProfile = memberId === id
  const hasPendingEdit = pendingEdits?.find(e => e.memberId === id)

  const EDITABLE_FIELDS = [
    { key: 'email',        label: 'Email',         type: 'email' },
    { key: 'phone',        label: 'Phone',          type: 'tel' },
    { key: 'linkedin_url', label: 'LinkedIn URL',   type: 'url' },
    { key: 'major',        label: 'Major / Minor',  type: 'text' },
    { key: 'high_school',  label: 'High School',    type: 'text' },
  ]

  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editSaved, setEditSaved] = useState(false)
  const [resetRequested, setResetRequested] = useState(false)

  function openEdit() {
    setEditForm({
      email:        member.email || '',
      phone:        member.phone || '',
      linkedin_url: member.linkedin_url || '',
      major:        member.major || '',
      high_school:  member.high_school || '',
      show_email:   member.show_email,
      show_phone:   member.show_phone,
      show_linkedin: member.show_linkedin,
      password:     member.password || '',
    })
    setEditSaved(false)
    setShowEdit(true)
  }

  function handleEditSubmit(e) {
    e.preventDefault()
    const { password, ...profileFields } = editForm
    if (password && password !== (member.password || '')) {
      updateMember(id, { password })
      addNotification({
        toMemberId: id,
        type: 'password_changed',
        title: 'Password changed',
        message: 'Your password has been updated.',
      })
    }
    submitProfileEdit(id, profileFields)
    setEditSaved(true)
    setTimeout(() => { setShowEdit(false); setEditSaved(false) }, 1200)
  }

  if (!member) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-64 text-slate-400">Member not found.</div>
    </div>
  )

  const initials = `${member.first_name[0]}${member.last_name[0]}`
  const gradient = avatarColor(member.first_name + member.last_name)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/directory" className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 inline-flex items-center gap-1 transition-colors">
            ← Back to directory
          </Link>
          {hasPendingEdit && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
              <span className="text-amber-500 flex-shrink-0 mt-0.5 text-sm">⏳</span>
              <p className="text-sm text-amber-800 font-medium">Your profile update is pending admin approval.</p>
            </div>
          )}
          <div className="flex items-center gap-6 mt-4">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-sm overflow-hidden`}>
              {member.avatar_url
                ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{member.first_name} {member.last_name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLES[member.status] || STATUS_STYLES.inactive}`}>
                  {member.status}
                </span>
              </div>
              {member.position && (
                <p className="text-sm font-semibold mt-1" style={{ color: chapter?.primary_color || '#4F46E5' }}>
                  {member.position}
                </p>
              )}
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 flex-wrap">
                {member.pledge_class && <span>{member.pledge_class}</span>}
                {member.class_year && <><span className="text-slate-300">&middot;</span><span>Class of {member.class_year}</span></>}
              </div>
            </div>
            {isOwnProfile && (
              <button
                onClick={openEdit}
                disabled={!!hasPendingEdit}
                className="ml-auto flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: chapter?.primary_color || '#1D5FE8', borderColor: chapter?.primary_color || '#1D5FE8' }}
              >
                {hasPendingEdit ? 'Pending…' : 'Edit profile'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Contact card */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            {(isAdmin || member.show_email) && member.email ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-sm flex-shrink-0">@</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <a href={`mailto:${member.email}`} className="text-sm text-blue-600 hover:underline">{member.email}</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-sm flex-shrink-0">@</div>
                <p className="text-sm text-slate-400">Email hidden</p>
              </div>
            )}

            {(isAdmin || member.show_phone) && member.phone ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-sm flex-shrink-0">#</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                  <a href={`tel:${member.phone}`} className="text-sm text-slate-700 hover:text-blue-600">{member.phone}</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-sm flex-shrink-0">#</div>
                <p className="text-sm text-slate-400">Phone hidden</p>
              </div>
            )}

            {(isAdmin || member.show_linkedin) && member.linkedin_url ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">in</div>
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">LinkedIn</p>
                  <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View profile</a>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">in</div>
                <p className="text-sm text-slate-400">LinkedIn hidden</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic card */}
        {(member.major || member.high_school) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Academic</h2>
            <div className="space-y-3">
              {member.major && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Major / Minor</p>
                  <p className="text-sm text-slate-700">{member.major}</p>
                </div>
              )}
              {member.high_school && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">High School</p>
                  <p className="text-sm text-slate-700">{member.high_school}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Family card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">{t.team}</h2>
          <div className="space-y-4">
            {mentor ? (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">{t.mentor}</p>
                <Link to={`/members/${mentor.id}`} className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {mentor.first_name[0]}{mentor.last_name[0]}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                    {mentor.first_name} {mentor.last_name}
                  </span>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">{t.mentor}</p>
                <p className="text-sm text-slate-400">None</p>
              </div>
            )}

            {mentees.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">{t.mentees}</p>
                <div className="space-y-1.5">
                  {mentees.map(m => (
                    <Link key={m.id} to={`/members/${m.id}`} className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {m.first_name[0]}{m.last_name[0]}
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                        {m.first_name} {m.last_name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!mentor && mentees.length === 0 && (
              <p className="text-sm text-slate-400">No connections yet.</p>
            )}
          </div>
        </div>

        {/* Points card — shown to admin always, to member only on own profile */}
        {(isAdmin || isOwnProfile) && chapter?.feature_points && (
          <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Points & Standing</h2>
              {(() => {
                const total = pointLedger.filter(e => e.memberId === id).reduce((sum, e) => sum + e.points, 0)
                const threshold = chapter.good_standing_min_points || 0
                const standing = threshold === 0 || total >= threshold
                return (
                  <div className="flex items-center gap-3">
                    {threshold > 0 && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${standing ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {standing ? '✓ Good Standing' : '⚠ Below Threshold'}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-slate-900">{total} <span className="text-sm font-normal text-slate-400">pts</span></span>
                  </div>
                )
              })()}
            </div>
            {pointLedger.filter(e => e.memberId === id).length === 0 ? (
              <p className="text-sm text-slate-400">No points awarded yet.</p>
            ) : (
              <div className="space-y-0.5 max-h-52 overflow-y-auto">
                {pointLedger.filter(e => e.memberId === id).map(entry => (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm text-slate-700 font-medium">{entry.category}</p>
                      {entry.note && <p className="text-xs text-slate-400">{entry.note}</p>}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-bold text-emerald-600">+{entry.points} pts</p>
                      <p className="text-xs text-slate-400">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowEdit(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white w-full sm:rounded-2xl sm:max-w-md shadow-xl z-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Edit my profile</h3>
              <button onClick={() => setShowEdit(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {EDITABLE_FIELDS.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={editForm[f.key] || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
              ))}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Privacy</p>
                <div className="space-y-2">
                  {[
                    { key: 'show_email',    label: 'Show email to other members' },
                    { key: 'show_phone',    label: 'Show phone to other members' },
                    { key: 'show_linkedin', label: 'Show LinkedIn to other members' },
                  ].map(toggle => (
                    <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setEditForm(prev => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                        className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative cursor-pointer ${editForm[toggle.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${editForm[toggle.key] ? 'translate-x-5' : 'translate-x-1'}`} />
                      </div>
                      <span className="text-sm text-slate-700">{toggle.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Password field */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-medium text-slate-500 mb-1">Password</label>
                <input
                  type="text"
                  value={editForm.password || ''}
                  onChange={e => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
                <p className="text-xs text-slate-400 mt-1">Leave blank to keep your current password.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                {editSaved ? (chapter?.member_edits_require_approval ? 'Sent for approval!' : 'Saved!') : 'Save changes'}
              </button>
              {chapter?.member_edits_require_approval && !editSaved && (
                <p className="text-xs text-slate-400 text-center">Profile changes will be visible after admin approval. Password updates apply immediately.</p>
              )}

              {/* Request reset */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { requestPasswordReset(id); setResetRequested(true) }}
                  disabled={resetRequested}
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-60 disabled:cursor-default"
                >
                  {resetRequested ? '✓ Reset request sent to admin' : 'Forgot password? Request reset from admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  )
}
