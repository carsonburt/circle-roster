import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useChapter } from '../contexts/ChapterContext'
import { GROUP_TYPES, TERMS } from '../lib/terminology'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import ImportModal from '../components/ImportModal'
import EmailModal from '../components/EmailModal'

const EMPTY_FORM = {
  first_name: '', last_name: '', email: '', phone: '',
  linkedin_url: '', pledge_class: '', class_year: '',
  status: 'active', big_id: '',
  show_phone: true, show_email: true, show_linkedin: true,
  avatar_url: null, position: '', major: '', high_school: '',
}

export default function AdminPanel() {
  const {
    chapter, members, announcements, duesTerms, meetings, polls, terminology: t,
    updateChapter, addMember, updateMember, deleteMember,
    addAnnouncement, deleteAnnouncement, pinAnnouncement,
    toggleDuesForTerm, setAllDuesForTerm, updateTermLabel, finalizeTerm,
    addMeeting, deleteMeeting, toggleAttendee, setMeetingAttendees,
    addPoll, deletePoll, closePoll,
    pendingEdits, approveEdit, rejectEdit, resetAllPasswords,
    notifications, addNotification, markNotificationRead, deleteNotification,
  } = useChapter()

  // Active tab
  const [tab, setTab] = useState('members')
  useEffect(() => {
    if (tab === 'inbox') {
      notifications.filter(n => n.toMemberId === null && !n.read).forEach(n => markNotificationRead(n.id))
    }
  }, [tab])

  // Attendance
  const [meetingForm, setMeetingForm] = useState({ title: '', date: '' })
  const [expandedMeeting, setExpandedMeeting] = useState(null)
  const [attendanceFrom, setAttendanceFrom] = useState('')
  const [attendanceTo, setAttendanceTo] = useState('')

  // Member form
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)

  // Group settings
  const [groupType, setGroupType] = useState(chapter.type || 'club')
  const [customLabels, setCustomLabels] = useState({
    custom_member:     chapter.custom_member     || '',
    custom_members:    chapter.custom_members    || '',
    custom_mentor:     chapter.custom_mentor     || '',
    custom_mentee:     chapter.custom_mentee     || '',
    custom_mentees:    chapter.custom_mentees    || '',
    custom_cohort:     chapter.custom_cohort     || '',
    custom_team:       chapter.custom_team       || '',
    custom_tree_title: chapter.custom_tree_title || '',
  })
  const [saved, setSaved] = useState(false)

  // Branding
  const [branding, setBranding] = useState({
    primary_color: chapter.primary_color || '#4F46E5',
    logo_url: chapter.logo_url || '',
  })
  const [brandingSaved, setBrandingSaved] = useState(false)

  // Announcements
  const [annForm, setAnnForm] = useState({ title: '', body: '' })

  // Polls
  const [pollForm, setPollForm] = useState({ title: '', description: '', closes_at: '', options: ['', ''] })

  // Dues
  const [duesTermIdx, setDuesTermIdx] = useState(duesTerms.length - 1)
  const [finalizingTerm, setFinalizingTerm] = useState(false)
  const [nextTermLabel, setNextTermLabel] = useState('')
  const [showExportDues, setShowExportDues] = useState(false)
  const [exportTermIds, setExportTermIds] = useState(new Set())

  // Import
  const [showImport, setShowImport] = useState(false)

  // Email
  const [emailAnn, setEmailAnn] = useState(null) // { ann, type }

  // Password management
  const [passwordModal, setPasswordModal] = useState(null)
  const [passwordModalValue, setPasswordModalValue] = useState('')
  const [passwordModalSaved, setPasswordModalSaved] = useState(false)
  const [bulkPassword, setBulkPassword] = useState('')
  const [bulkPasswordSaved, setBulkPasswordSaved] = useState(false)

  // Invite
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  // ── Group settings ────────────────────────────────────────────
  function handleSaveGroupType(e) {
    e.preventDefault()
    const nulledLabels = Object.fromEntries(
      Object.entries(customLabels).map(([k, v]) => [k, v.trim() || null])
    )
    updateChapter({ type: groupType, ...nulledLabels })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ── Branding ──────────────────────────────────────────────────
  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setBranding(b => ({ ...b, logo_url: reader.result }))
    reader.readAsDataURL(file)
  }

  function handleSaveBranding(e) {
    e.preventDefault()
    updateChapter(branding)
    setBrandingSaved(true)
    setTimeout(() => setBrandingSaved(false), 2000)
  }

  // ── Announcements ─────────────────────────────────────────────
  function handlePostAnnouncement(e) {
    e.preventDefault()
    addAnnouncement(annForm)
    setAnnForm({ title: '', body: '' })
  }

  // ── Dues ──────────────────────────────────────────────────────
  const safeTermIdx = Math.min(duesTermIdx, duesTerms.length - 1)
  const viewingTerm = duesTerms[safeTermIdx] || { id: '', label: '', finalized: false, payments: {} }
  const viewingPayments = viewingTerm.payments || {}
  const termActiveMembers = members.filter(m => m.status === 'active')
  const termPaidCount = termActiveMembers.filter(m => viewingPayments[m.id]).length
  const termDuePct = termActiveMembers.length ? Math.round((termPaidCount / termActiveMembers.length) * 100) : 0

  function handleFinalizeTerm() {
    finalizeTerm(viewingTerm.id, nextTermLabel.trim())
    setDuesTermIdx(duesTerms.length)
    setFinalizingTerm(false)
    setNextTermLabel('')
  }

  function handleExportDues() {
    const selected = duesTerms.filter(t => exportTermIds.has(t.id))
    const headers = ['Name', 'Status', ...selected.map(t => t.label)]
    const rows = members.map(m => [
      `${m.first_name} ${m.last_name}`,
      m.status,
      ...selected.map(t => t.payments[m.id] === undefined ? '—' : t.payments[m.id] ? 'Paid' : 'Unpaid'),
    ])
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
    ws['!cols'] = headers.map((_, i) => ({ wch: i === 0 ? 24 : 14 }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dues')
    XLSX.writeFile(wb, `${chapter.name.replace(/\s+/g, '-')}-dues.xlsx`)
    setShowExportDues(false)
  }

  // ── Member form ───────────────────────────────────────────────
  function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, avatar_url: reader.result }))
    reader.readAsDataURL(file)
  }

  function startEdit(member) {
    setTab('members')
    setEditingId(member.id)
    setForm({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email || '',
      phone: member.phone || '',
      linkedin_url: member.linkedin_url || '',
      pledge_class: member.pledge_class || '',
      class_year: member.class_year || '',
      status: member.status,
      big_id: member.big_id || '',
      show_phone: member.show_phone,
      show_email: member.show_email,
      show_linkedin: member.show_linkedin,
      avatar_url: member.avatar_url || null,
      position: member.position || '',
      major: member.major || '',
      high_school: member.high_school || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function handleSave(e) {
    e.preventDefault()
    const payload = {
      ...form,
      class_year: form.class_year ? parseInt(form.class_year) : null,
      big_id: form.big_id || null,
    }
    if (editingId) {
      updateMember(editingId, payload)
    } else {
      addMember(payload)
    }
    cancelEdit()
  }

  function handleToggleAlumni(member) {
    updateMember(member.id, { status: member.status === 'alumni' ? 'active' : 'alumni' })
  }

  function handleDelete(id) {
    if (!confirm('Remove this member?')) return
    deleteMember(id)
  }

  // ── Invite ────────────────────────────────────────────────────
  function exportCSV() {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Status', 'Cohort', 'Class Year', t.mentor]
    const rows = members.map(m => {
      const big = members.find(b => b.id === m.big_id)
      return [
        m.first_name, m.last_name, m.email || '', m.phone || '',
        m.status, m.pledge_class || '', m.class_year || '',
        big ? `${big.first_name} ${big.last_name}` : '',
      ]
    })
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chapter.name.replace(/\s+/g, '-')}-roster.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function generateInvite(e) {
    e.preventDefault()
    const token = btoa(`${inviteEmail}:${Date.now()}`).replace(/=/g, '')
    const link = `${window.location.origin}/join?email=${encodeURIComponent(inviteEmail)}&token=${token}`
    setInviteLink(link)
  }

  function copyLink() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeMembers = members.filter(m => m.status === 'active')
  const brandColor = chapter?.primary_color || '#4F46E5'

  const adminNotifications = notifications.filter(n => n.toMemberId === null)
  const adminUnread = adminNotifications.filter(n => !n.read).length

  const TABS = [
    { key: 'members',    label: 'Members' },
    { key: 'approvals',  label: 'Approvals', count: pendingEdits.length },
    { key: 'inbox',      label: 'Inbox',     count: adminUnread },
    { key: 'attendance', label: 'Attendance' },
    { key: 'dues',       label: 'Dues' },
    { key: 'polls',      label: 'Polls' },
    { key: 'content',    label: 'Content' },
    { key: 'settings',   label: 'Settings' },
  ]

  function formatDate(iso) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const sortedMeetings = [...meetings].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors flex-shrink-0 ${
                  tab === t.key
                    ? 'border-current text-current'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                style={tab === t.key ? { color: brandColor, borderColor: brandColor } : {}}
              >
                {t.label}
                {t.count > 0 && (
                  <span className="ml-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:pb-8 space-y-6">

        {/* ── MEMBERS TAB ─────────────────────────────────────────── */}
        {tab === 'members' && <>

        {/* Add / Edit member */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            {editingId ? `Edit ${t.member}` : `Add ${t.member}`}
          </h2>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Avatar upload */}
            <div className="sm:col-span-2 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base flex-shrink-0 overflow-hidden">
                {form.avatar_url
                  ? <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
                  : (form.first_name || form.last_name
                      ? `${form.first_name[0] || ''}${form.last_name[0] || ''}`
                      : '?')
                }
              </div>
              <div>
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-block">
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                {form.avatar_url && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, avatar_url: null }))} className="ml-2 text-sm text-red-400 hover:text-red-600 transition-colors">
                    Remove
                  </button>
                )}
                <p className="text-xs text-slate-400 mt-1.5">Optional profile photo</p>
              </div>
            </div>

            {[
              ['first_name', 'First name', 'text', true],
              ['last_name', 'Last name', 'text', true],
              ['position', 'Position / Role', 'text', false],
              ['email', 'Email', 'email', false],
              ['phone', 'Phone', 'tel', false],
              ['linkedin_url', 'LinkedIn URL', 'url', false],
              ['class_year', 'Graduation year', 'number', false],
              ['major', 'Major / Minor', 'text', false],
              ['high_school', 'High School', 'text', false],
            ].map(([field, label, type, required]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <input
                  type={type}
                  required={required}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.cohort}</label>
              <input
                type="text"
                value={form.pledge_class}
                onChange={e => setForm(f => ({ ...f, pledge_class: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.mentor}</label>
              <select
                value={form.big_id}
                onChange={e => setForm(f => ({ ...f, big_id: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              >
                <option value="">None</option>
                {members.filter(m => m.id !== editingId).map(m => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              >
                <option value="active">Active</option>
                <option value="alumni">Alumni / Former</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-4">
              {[['show_email', 'Show email'], ['show_phone', 'Show phone'], ['show_linkedin', 'Show LinkedIn']].map(([field, label]) => (
                <label key={field} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.checked }))}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: brandColor }}
              >
                {editingId ? 'Save changes' : `Add ${t.member}`}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-slate-200">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Member list */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">All {t.members} <span className="text-slate-400 font-normal">({members.length})</span></h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImport(true)}
                className="text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => { setShowInvite(true); setInviteLink(''); setInviteEmail('') }}
                className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                + Invite
              </button>
              <button
                onClick={exportCSV}
                className="text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
              >
                Export
              </button>
            </div>
          </div>
          <div className="space-y-0.5">
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                    {m.avatar_url
                      ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                      : `${m.first_name[0]}${m.last_name[0]}`
                    }
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-slate-800 text-sm">{m.first_name} {m.last_name}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      m.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      m.status === 'alumni' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{m.status}</span>
                    {m.is_admin && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ backgroundColor: brandColor }}>Admin</span>
                    )}
                    {m.pledge_class && <span className="ml-2 text-xs text-slate-400 hidden sm:inline">{m.pledge_class}</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 ml-2">
                  <button
                    onClick={() => updateMember(m.id, { is_admin: !m.is_admin })}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      m.is_admin
                        ? 'bg-blue-100 text-blue-700 hover:bg-red-50 hover:text-red-600'
                        : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                    title={m.is_admin ? 'Remove admin access' : 'Grant admin access'}
                  >
                    {m.is_admin ? 'Admin ✓' : 'Make Admin'}
                  </button>
                  <button onClick={() => handleToggleAlumni(m)} className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
                    {m.status === 'alumni' ? 'Active' : 'Alumni'}
                  </button>
                  <button
                    onClick={() => { setPasswordModal(m); setPasswordModalValue(''); setPasswordModalSaved(false) }}
                    className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                    title="Set password"
                  >
                    🔑
                  </button>
                  <button onClick={() => startEdit(m)} className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && <p className="text-slate-400 text-sm">No {t.members.toLowerCase()} yet.</p>}
          </div>
        </section>

        </>}

        {/* ── APPROVALS TAB ───────────────────────────────────────── */}
        {tab === 'approvals' && <>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Pending Profile Edits</h2>
          <p className="text-sm text-slate-500 mb-5">
            Review changes members have submitted. Approve to apply them, or reject to discard.
          </p>
          {pendingEdits.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No pending edits.</div>
          ) : (
            <div className="space-y-4">
              {pendingEdits.map(edit => {
                const member = members.find(m => m.id === edit.memberId)
                if (!member) return null
                const FIELD_LABELS = {
                  email: 'Email', phone: 'Phone', linkedin_url: 'LinkedIn',
                  major: 'Major/Minor', high_school: 'High School',
                  show_email: 'Show email', show_phone: 'Show phone', show_linkedin: 'Show LinkedIn',
                }
                const changed = Object.entries(edit.fields).filter(([k, v]) => String(v) !== String(member[k] ?? ''))
                const when = new Date(edit.requestedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                return (
                  <div key={edit.id} className="border border-slate-200 rounded-xl p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {member.first_name[0]}{member.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{member.first_name} {member.last_name}</p>
                          <p className="text-xs text-slate-400">Submitted {when}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveEdit(edit.id)}
                          className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold transition-colors"
                        >Approve</button>
                        <button
                          onClick={() => rejectEdit(edit.id)}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                        >Reject</button>
                      </div>
                    </div>
                    {changed.length === 0 ? (
                      <p className="text-xs text-slate-400">No changes detected.</p>
                    ) : (
                      <div className="space-y-2">
                        {changed.map(([field, newVal]) => (
                          <div key={field} className="flex items-start gap-3 text-xs">
                            <span className="text-slate-400 w-24 flex-shrink-0 font-medium">{FIELD_LABELS[field] || field}</span>
                            <div className="flex items-center gap-2 min-w-0 flex-wrap">
                              <span className="text-slate-400 line-through truncate max-w-[120px]">
                                {typeof member[field] === 'boolean' ? (member[field] ? 'Visible' : 'Hidden') : (member[field] || '—')}
                              </span>
                              <span className="text-slate-400">→</span>
                              <span className="text-slate-800 font-medium truncate max-w-[120px]">
                                {typeof newVal === 'boolean' ? (newVal ? 'Visible' : 'Hidden') : (newVal || '—')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        </>}

        {/* ── INBOX TAB ───────────────────────────────────────────── */}
        {tab === 'inbox' && <>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Admin Inbox</h2>
          <p className="text-sm text-slate-500 mb-5">Member requests and account notifications.</p>
          {adminNotifications.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">No notifications.</div>
          ) : (
            <div className="space-y-3">
              {adminNotifications.map(n => {
                const fromMember = n.fromMemberId ? members.find(m => m.id === n.fromMemberId) : null
                const icons = { password_reset_request: '🔑', profile_approved: '✅', profile_rejected: '❌', password_changed: '🔒' }
                return (
                  <div key={n.id} className={`border rounded-xl p-4 flex items-start gap-3 ${n.read ? 'border-slate-200' : 'border-blue-200 bg-blue-50/30'}`}>
                    <span className="text-xl flex-shrink-0 mt-0.5">{icons[n.type] || '📬'}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                      {n.type === 'password_reset_request' && fromMember && (
                        <button
                          onClick={() => { setPasswordModal(fromMember); setPasswordModalValue(''); setPasswordModalSaved(false) }}
                          className="mt-2 text-xs text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: brandColor }}
                        >
                          Reset password for {fromMember.first_name}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="text-slate-300 hover:text-slate-500 text-xl leading-none flex-shrink-0 transition-colors"
                    >×</button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        </>}

        {/* ── ATTENDANCE TAB ───────────────────────────────────────── */}
        {tab === 'attendance' && <>

        {/* New meeting */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Record a Meeting</h2>
          <form
            onSubmit={e => {
              e.preventDefault()
              addMeeting(meetingForm)
              setMeetingForm({ title: '', date: '' })
              setExpandedMeeting(null)
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text" required
              placeholder="Meeting title"
              value={meetingForm.title}
              onChange={e => setMeetingForm(f => ({ ...f, title: e.target.value }))}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <input
              type="date" required
              value={meetingForm.date}
              onChange={e => setMeetingForm(f => ({ ...f, date: e.target.value }))}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <button
              type="submit"
              className="text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              + Create
            </button>
          </form>
        </section>

        {/* Meeting list */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {sortedMeetings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No meetings recorded yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedMeetings.map(meeting => {
                const attended = meeting.attendee_ids.filter(id => activeMembers.find(m => m.id === id)).length
                const total = activeMembers.length
                const pct = total ? Math.round((attended / total) * 100) : 0
                const isOpen = expandedMeeting === meeting.id
                const d = new Date(meeting.date + 'T12:00:00')
                const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                return (
                  <div key={meeting.id}>
                    {/* Header row */}
                    <div
                      className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedMeeting(isOpen ? null : meeting.id)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{meeting.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{dateStr}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-semibold text-slate-800 tabular-nums">{attended}/{total}</p>
                          <p className="text-xs text-slate-400">{pct}% attended</p>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); if (confirm('Delete this meeting?')) deleteMeeting(meeting.id) }}
                          className="text-xs text-slate-300 hover:text-red-400 transition-colors px-1"
                        >
                          ×
                        </button>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        >
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded attendance sheet */}
                    {isOpen && (
                      <div className="bg-slate-50 border-t border-slate-100 px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {attended} of {total} active members present
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setMeetingAttendees(meeting.id, activeMembers.map(m => m.id))}
                              className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-medium transition-colors"
                            >
                              All present
                            </button>
                            <button
                              onClick={() => setMeetingAttendees(meeting.id, [])}
                              className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-medium transition-colors"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {activeMembers.map(m => {
                            const present = meeting.attendee_ids.includes(m.id)
                            return (
                              <button
                                key={m.id}
                                onClick={() => toggleAttendee(meeting.id, m.id)}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all text-sm ${
                                  present
                                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                                  present ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                                }`}>
                                  {present ? '✓' : ''}
                                </span>
                                <span className="truncate font-medium">{m.first_name} {m.last_name}</span>
                                {m.pledge_class && <span className="text-xs text-current opacity-50 ml-auto flex-shrink-0 hidden sm:block">{m.pledge_class}</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Member attendance summary */}
        {sortedMeetings.length > 0 && (() => {
          const filteredMeetings = sortedMeetings.filter(mtg => {
            if (attendanceFrom && mtg.date < attendanceFrom) return false
            if (attendanceTo && mtg.date > attendanceTo) return false
            return true
          })
          const hasFilter = attendanceFrom || attendanceTo
          return (
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Member Summary</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {hasFilter
                      ? `${filteredMeetings.length} meeting${filteredMeetings.length !== 1 ? 's' : ''} in selected range`
                      : `Attendance rate across all ${sortedMeetings.length} meetings`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <input
                    type="date"
                    value={attendanceFrom}
                    onChange={e => setAttendanceFrom(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                  <span className="text-xs text-slate-400">to</span>
                  <input
                    type="date"
                    value={attendanceTo}
                    onChange={e => setAttendanceTo(e.target.value)}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                  {hasFilter && (
                    <button
                      onClick={() => { setAttendanceFrom(''); setAttendanceTo('') }}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {filteredMeetings.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No meetings in this date range.</p>
              ) : (
                <div className="space-y-2">
                  {activeMembers
                    .map(m => {
                      const attended = filteredMeetings.filter(mtg => mtg.attendee_ids.includes(m.id)).length
                      const total = filteredMeetings.length
                      const pct = total ? Math.round((attended / total) * 100) : 0
                      return { m, attended, total, pct }
                    })
                    .sort((a, b) => a.pct - b.pct)
                    .map(({ m, attended, total, pct }) => (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                          {m.avatar_url
                            ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                            : `${m.first_name[0]}${m.last_name[0]}`
                          }
                        </div>
                        <span className="text-sm text-slate-700 w-36 flex-shrink-0 truncate">{m.first_name} {m.last_name}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444'
                            }}
                          />
                        </div>
                        <span className={`text-xs font-semibold tabular-nums w-14 text-right flex-shrink-0 ${
                          pct >= 80 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          {attended}/{total} ({pct}%)
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )
        })()}

        </>}

        {/* ── DUES TAB ─────────────────────────────────────────────── */}
        {tab === 'dues' && <>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Dues Tracker</h2>
              <p className="text-sm text-slate-500 mt-0.5">Track who has paid for each term.</p>
            </div>
            <button
              onClick={() => { setExportTermIds(new Set(duesTerms.map(t => t.id))); setShowExportDues(true) }}
              className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors flex-shrink-0"
            >
              ↓ Export Excel
            </button>
          </div>

          {/* Term navigator */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setDuesTermIdx(i => Math.max(0, i - 1))}
              disabled={safeTermIdx === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium flex-shrink-0"
            >←</button>
            {viewingTerm.finalized ? (
              <span className="flex-1 text-center text-sm font-semibold text-slate-700 px-2 truncate">{viewingTerm.label}</span>
            ) : (
              <input
                type="text"
                value={viewingTerm.label}
                onChange={e => updateTermLabel(viewingTerm.id, e.target.value)}
                className="flex-1 min-w-0 text-center border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            )}
            <button
              onClick={() => setDuesTermIdx(i => Math.min(duesTerms.length - 1, i + 1))}
              disabled={safeTermIdx === duesTerms.length - 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium flex-shrink-0"
            >→</button>
            <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
              viewingTerm.finalized ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {viewingTerm.finalized ? 'Finalized' : 'Current'}
            </span>
          </div>

          {/* Action row — current term only */}
          {!viewingTerm.finalized && (
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <button
                onClick={() => {
                  const next = {}
                  termActiveMembers.forEach(m => { next[m.id] = true })
                  setAllDuesForTerm(viewingTerm.id, { ...viewingPayments, ...next })
                }}
                className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-medium transition-colors"
              >Mark all paid</button>
              <button
                onClick={() => {
                  const next = {}
                  termActiveMembers.forEach(m => { next[m.id] = false })
                  setAllDuesForTerm(viewingTerm.id, { ...viewingPayments, ...next })
                }}
                className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-medium transition-colors"
              >Clear all</button>
              <div className="flex-1" />
              {!finalizingTerm ? (
                <button
                  onClick={() => setFinalizingTerm(true)}
                  className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >Finalize term →</button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder="New term name…"
                    value={nextTermLabel}
                    onChange={e => setNextTermLabel(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && nextTermLabel.trim()) handleFinalizeTerm() }}
                    className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 w-36"
                  />
                  <button
                    onClick={handleFinalizeTerm}
                    disabled={!nextTermLabel.trim()}
                    className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium disabled:opacity-40 transition-colors"
                  >Confirm</button>
                  <button
                    onClick={() => { setFinalizingTerm(false); setNextTermLabel('') }}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1 py-1.5"
                  >×</button>
                </div>
              )}
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700">{termPaidCount} / {termActiveMembers.length} paid</span>
              <span className="text-slate-400 tabular-nums">{termDuePct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${termDuePct}%`, backgroundColor: brandColor }}
              />
            </div>
          </div>

          {/* Member list */}
          <div className="space-y-0.5 max-h-[480px] overflow-y-auto">
            {termActiveMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                    {m.avatar_url
                      ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                      : `${m.first_name[0]}${m.last_name[0]}`
                    }
                  </div>
                  <span className="text-sm text-slate-800 truncate">{m.first_name} {m.last_name}</span>
                  {m.pledge_class && <span className="text-xs text-slate-400 hidden sm:block">{m.pledge_class}</span>}
                </div>
                {viewingTerm.finalized ? (
                  <span className={`text-xs px-3 py-1 rounded-lg font-medium flex-shrink-0 ml-2 ${
                    viewingPayments[m.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-500'
                  }`}>
                    {viewingPayments[m.id] ? '✓ Paid' : '✗ Unpaid'}
                  </span>
                ) : (
                  <button
                    onClick={() => toggleDuesForTerm(viewingTerm.id, m.id)}
                    className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors flex-shrink-0 ml-2 ${
                      viewingPayments[m.id]
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {viewingPayments[m.id] ? '✓ Paid' : 'Unpaid'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Export dues modal */}
        {showExportDues && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowExportDues(false)}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10" onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowExportDues(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Export Dues to Excel</h3>
              <p className="text-sm text-slate-500 mb-4">Select which terms to include.</p>
              <div className="space-y-1 mb-4 max-h-56 overflow-y-auto">
                {duesTerms.map(term => (
                  <label
                    key={term.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setExportTermIds(prev => {
                      const next = new Set(prev)
                      if (next.has(term.id)) next.delete(term.id)
                      else next.add(term.id)
                      return next
                    })}
                  >
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                        exportTermIds.has(term.id) ? 'border-transparent text-white' : 'border-slate-300 bg-white'
                      }`}
                      style={exportTermIds.has(term.id) ? { backgroundColor: brandColor, borderColor: brandColor } : {}}
                    >
                      {exportTermIds.has(term.id) && <span className="text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm font-medium text-slate-700 flex-1">{term.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
                      term.finalized ? 'bg-slate-100 text-slate-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {term.finalized ? 'Finalized' : 'Current'}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <button onClick={() => setExportTermIds(new Set(duesTerms.map(t => t.id)))} className="hover:text-slate-600 transition-colors">Select all</button>
                <button onClick={() => setExportTermIds(new Set())} className="hover:text-slate-600 transition-colors">Deselect all</button>
              </div>
              <button
                onClick={handleExportDues}
                disabled={exportTermIds.size === 0}
                className="w-full text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                style={{ backgroundColor: brandColor }}
              >
                Export {exportTermIds.size > 0 ? `${exportTermIds.size} term${exportTermIds.size > 1 ? 's' : ''}` : 'selected terms'}
              </button>
            </div>
          </div>
        )}

        </>}

        {/* ── POLLS TAB ────────────────────────────────────────────── */}
        {tab === 'polls' && <>

        {/* Create poll */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Create Poll</h2>
          <form
            onSubmit={e => {
              e.preventDefault()
              const opts = pollForm.options.filter(o => o.trim())
              if (opts.length < 2) return
              addPoll({
                title: pollForm.title,
                description: pollForm.description,
                closes_at: pollForm.closes_at || null,
                options: opts.map((text, i) => ({ id: `o${Date.now()}${i}`, text })),
              })
              setPollForm({ title: '', description: '', closes_at: '', options: ['', ''] })
            }}
            className="space-y-3"
          >
            <input
              type="text" required
              placeholder="Poll question"
              value={pollForm.title}
              onChange={e => setPollForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={pollForm.description}
              onChange={e => setPollForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <div className="space-y-2">
              {pollForm.options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={e => setPollForm(f => {
                      const options = [...f.options]
                      options[i] = e.target.value
                      return { ...f, options }
                    })}
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                  {pollForm.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setPollForm(f => ({ ...f, options: f.options.filter((_, j) => j !== i) }))}
                      className="text-slate-300 hover:text-red-400 transition-colors px-2 text-lg"
                    >×</button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setPollForm(f => ({ ...f, options: [...f.options, ''] }))}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >+ Add option</button>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Close date & time (optional)</label>
                <input
                  type="datetime-local"
                  value={pollForm.closes_at}
                  onChange={e => setPollForm(f => ({ ...f, closes_at: e.target.value }))}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                />
              </div>
              <button
                type="submit"
                className="self-end text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ backgroundColor: brandColor }}
              >Create Poll</button>
            </div>
          </form>
        </section>

        {/* Poll list */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {polls.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No polls yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {polls.map(poll => {
                const totalVotes = Object.keys(poll.votes).length
                const counts = poll.options.reduce((acc, opt) => {
                  acc[opt.id] = Object.values(poll.votes).filter(v => v === opt.id).length
                  return acc
                }, {})
                const d = poll.closes_at ? new Date(poll.closes_at) : null
                const closesStr = d ? d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null
                return (
                  <div key={poll.id} className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-slate-900 text-sm">{poll.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            poll.closed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {poll.closed ? 'Closed' : 'Open'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                          {closesStr && !poll.closed && ` · closes ${closesStr}`}
                          {poll.created_at && ` · created ${poll.created_at}`}
                        </p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        {!poll.closed && (
                          <button
                            onClick={() => { if (confirm('Close this poll? Members will no longer be able to vote.')) closePoll(poll.id) }}
                            className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded-lg font-medium transition-colors"
                          >Close</button>
                        )}
                        <button
                          onClick={() => { if (confirm('Delete this poll?')) deletePoll(poll.id) }}
                          className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors"
                        >Delete</button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {poll.options.map(opt => {
                        const count = counts[opt.id] || 0
                        const pct = totalVotes ? Math.round((count / totalVotes) * 100) : 0
                        return (
                          <div key={opt.id} className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-36 flex-shrink-0 truncate">{opt.text}</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ width: `${pct}%`, backgroundColor: brandColor }}
                              />
                            </div>
                            <span className="text-xs text-slate-400 tabular-nums w-16 text-right flex-shrink-0">{count} ({pct}%)</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        </>}

        {/* ── CONTENT TAB ──────────────────────────────────────────── */}
        {tab === 'content' && <>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Announcements</h2>
          <p className="text-sm text-slate-500 mb-5">Post updates visible to all members. Pin one to show it as a banner on the directory.</p>

          <form onSubmit={handlePostAnnouncement} className="space-y-3 mb-6 pb-6 border-b border-slate-100">
            <input
              type="text" required
              placeholder="Title"
              value={annForm.title}
              onChange={e => setAnnForm(f => ({ ...f, title: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <textarea
              rows={3} required
              placeholder="Write your announcement..."
              value={annForm.body}
              onChange={e => setAnnForm(f => ({ ...f, body: e.target.value }))}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"
            />
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              Post announcement
            </button>
          </form>

          <div className="space-y-2">
            {announcements.length === 0 && (
              <p className="text-sm text-slate-400">No announcements yet.</p>
            )}
            {announcements.map(ann => (
              <div
                key={ann.id}
                className={`flex items-start justify-between p-3.5 rounded-xl border ${
                  ann.pinned ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    {ann.pinned && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">📌 Pinned</span>
                    )}
                    <p className="font-medium text-slate-800 text-sm truncate">{ann.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{ann.body}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ann.created_at}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => setEmailAnn({ ann, type: 'active' })}
                    className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    ✉ Active
                  </button>
                  <button
                    onClick={() => setEmailAnn({ ann, type: 'alumni' })}
                    className="text-xs bg-violet-50 text-violet-700 hover:bg-violet-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    ✉ Alumni
                  </button>
                  <button
                    onClick={() => pinAnnouncement(ann.id)}
                    className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                      ann.pinned ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ann.pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        </>}

        {/* ── SETTINGS TAB ─────────────────────────────────────────── */}
        {tab === 'settings' && <>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Group Settings</h2>
          <p className="text-sm text-slate-500 mb-4">
            Pick a group type to set default labels, then optionally override any label.
          </p>
          <form onSubmit={handleSaveGroupType} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Group type</label>
              <select
                value={groupType}
                onChange={e => {
                  const type = e.target.value
                  setGroupType(type)
                  const d = TERMS[type] || TERMS.other
                  setCustomLabels({
                    custom_member:     d.member,
                    custom_members:    d.members,
                    custom_mentor:     d.mentor,
                    custom_mentee:     d.mentee,
                    custom_mentees:    d.mentees,
                    custom_cohort:     d.cohort,
                    custom_team:       d.team,
                    custom_tree_title: d.treeTitle,
                  })
                }}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              >
                {GROUP_TYPES.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">
                Customize labels <span className="font-normal text-slate-400">(leave blank to use defaults)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(() => {
                  const d = TERMS[groupType] || TERMS.other
                  return [
                    ['custom_member',     'Member (singular)',   d.member],
                    ['custom_members',    'Members (plural)',    d.members],
                    ['custom_mentor',     'Mentor label',        d.mentor],
                    ['custom_mentee',     'Mentee (singular)',   d.mentee],
                    ['custom_mentees',    'Mentees (plural)',    d.mentees],
                    ['custom_cohort',     'Cohort label',        d.cohort],
                    ['custom_team',       'Team / family label', d.team],
                    ['custom_tree_title', 'Tree page title',     d.treeTitle],
                  ].map(([field, label, defaultVal]) => (
                    <div key={field}>
                      <label className="block text-xs text-slate-500 mb-1">{label}</label>
                      <input
                        type="text"
                        placeholder={defaultVal}
                        value={customLabels[field]}
                        onChange={e => setCustomLabels(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      />
                    </div>
                  ))
                })()}
              </div>
            </div>
            <button
              type="submit"
              className="text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              {saved ? 'Saved!' : 'Save settings'}
            </button>
          </form>
        </section>

        {/* Branding */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Branding</h2>
          <p className="text-sm text-slate-500 mb-5">Set your chapter's accent color and logo.</p>
          <form onSubmit={handleSaveBranding} className="space-y-5">
            <div className="flex items-center gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Accent color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={branding.primary_color}
                    onChange={e => setBranding(b => ({ ...b, primary_color: e.target.value }))}
                    className="w-12 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                  />
                  <span className="text-sm text-slate-400 font-mono">{branding.primary_color}</span>
                </div>
              </div>
              <div
                className="flex-1 h-10 rounded-xl flex items-center justify-center text-white text-sm font-semibold shadow-sm"
                style={{ background: branding.primary_color }}
              >
                {chapter.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo</label>
              <div className="flex items-center gap-4">
                {branding.logo_url && (
                  <img src={branding.logo_url} alt="Logo" className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                )}
                <div>
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors inline-block">
                    {branding.logo_url ? 'Change logo' : 'Upload logo'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {branding.logo_url && (
                    <button type="button" onClick={() => setBranding(b => ({ ...b, logo_url: '' }))} className="ml-2 text-sm text-red-400 hover:text-red-600 transition-colors">
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-slate-400 mt-1.5">PNG or JPG · shown in the navbar</p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              {brandingSaved ? 'Saved!' : 'Save branding'}
            </button>
          </form>
        </section>

        {/* Member portal settings */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-1">Member Portal</h2>
          <p className="text-sm text-slate-500 mb-5">Control how members can update their own profiles.</p>
          <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-900">Require approval for profile edits</p>
              <p className="text-xs text-slate-400 mt-0.5">When on, member-submitted changes go into a pending queue for you to review. When off, changes apply immediately.</p>
            </div>
            <button
              onClick={() => updateChapter({ member_edits_require_approval: !chapter.member_edits_require_approval })}
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${chapter.member_edits_require_approval ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${chapter.member_edits_require_approval ? 'translate-x-7' : 'translate-x-1.5'}`} />
            </button>
          </div>
          <div className="pt-4">
            <p className="text-sm font-semibold text-slate-900 mb-0.5">Reset all member passwords</p>
            <p className="text-xs text-slate-400 mb-3">Set a single new password for every member at once. Default is "password" if none is set.</p>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                placeholder="New password for all"
                value={bulkPassword}
                onChange={e => { setBulkPassword(e.target.value); setBulkPasswordSaved(false) }}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              <button
                onClick={() => {
                  if (!bulkPassword.trim()) return
                  if (!confirm(`Set password to "${bulkPassword.trim()}" for all ${members.length} members?`)) return
                  resetAllPasswords(bulkPassword.trim())
                  setBulkPasswordSaved(true)
                  setBulkPassword('')
                  setTimeout(() => setBulkPasswordSaved(false), 2000)
                }}
                disabled={!bulkPassword.trim()}
                className="text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0"
                style={{ backgroundColor: brandColor }}
              >
                {bulkPasswordSaved ? 'Done!' : 'Reset all'}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Members can edit: email, phone, LinkedIn, major/minor, high school, and privacy settings.
            Admins always have full edit access.
          </p>
        </section>

        </>}

      </main>
      <BottomNav />

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}

      {passwordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setPasswordModal(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPasswordModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            <h3 className="font-bold text-slate-900 mb-0.5">Set password</h3>
            <p className="text-sm text-slate-500 mb-5">{passwordModal.first_name} {passwordModal.last_name}</p>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="New password"
                value={passwordModalValue}
                onChange={e => { setPasswordModalValue(e.target.value); setPasswordModalSaved(false) }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && passwordModalValue.trim()) {
                    updateMember(passwordModal.id, { password: passwordModalValue.trim() })
                    setPasswordModalSaved(true)
                    setTimeout(() => setPasswordModal(null), 800)
                  }
                }}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
              <button
                onClick={() => {
                  if (!passwordModalValue.trim()) return
                  updateMember(passwordModal.id, { password: passwordModalValue.trim() })
                  addNotification({
                    toMemberId: passwordModal.id,
                    type: 'password_changed',
                    title: 'Password reset by admin',
                    message: 'Your password has been reset by your chapter admin.',
                  })
                  setPasswordModalSaved(true)
                  setTimeout(() => setPasswordModal(null), 800)
                }}
                disabled={!passwordModalValue.trim()}
                className="text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity flex-shrink-0"
                style={{ backgroundColor: brandColor }}
              >
                {passwordModalSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">Current password: <span className="font-mono">{passwordModal.password || 'password'}</span></p>
          </div>
        </div>
      )}

      {emailAnn && (
        <EmailModal
          subject={emailAnn.ann.title}
          body={`Hi,\n\n${emailAnn.ann.title}\n\n${emailAnn.ann.body}\n\n— ${chapter?.name || 'Circle Roster'}`}
          defaultType={emailAnn.type}
          onClose={() => setEmailAnn(null)}
        />
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowInvite(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInvite(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            <h3 className="font-bold text-slate-900 text-lg mb-1">Invite a {t.member}</h3>
            <p className="text-sm text-slate-500 mb-5">Generate a link they can open to fill out their own profile.</p>
            <form onSubmit={generateInvite} className="flex gap-2 mb-4">
              <input
                type="email" required
                placeholder="their@email.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex-shrink-0">
                Generate
              </button>
            </form>
            {inviteLink && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Share this link — they'll be taken to a profile form:</p>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-slate-600 truncate flex-1 font-mono">{inviteLink}</p>
                  <button
                    onClick={copyLink}
                    className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2.5 py-1 rounded font-medium flex-shrink-0 transition-colors"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
