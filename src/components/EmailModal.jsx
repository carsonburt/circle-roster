import { useState } from 'react'
import { useChapter } from '../contexts/ChapterContext'

export default function EmailModal({ subject, body, defaultType = 'active', onClose }) {
  const { chapter, members } = useChapter()
  const [type, setType] = useState(defaultType)
  const [copiedWhat, setCopiedWhat] = useState(null)

  const activeEmails  = members.filter(m => m.status === 'active' && m.email).map(m => m.email)
  const alumniEmails  = members.filter(m => m.status === 'alumni' && m.email).map(m => m.email)
  const emails = type === 'active' ? activeEmails : type === 'alumni' ? alumniEmails : [...activeEmails, ...alumniEmails]

  function copy(what, text) {
    navigator.clipboard.writeText(text)
    setCopiedWhat(what)
    setTimeout(() => setCopiedWhat(null), 2000)
  }

  function openMailApp() {
    const url = `mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
  }

  const TYPES = [
    { key: 'active', label: 'Active members', count: activeEmails.length },
    { key: 'alumni', label: 'Alumni',          count: alumniEmails.length },
    { key: 'both',   label: 'Everyone',         count: activeEmails.length + alumniEmails.length },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl z-10 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">Send Email</h3>
            <p className="text-xs text-slate-400 mt-0.5">Opens in your mail app</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none w-8 h-8 flex items-center justify-center">×</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Recipient selector */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Send to</p>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map(t => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                    type === t.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {t.label}
                  <span className={`ml-1.5 text-xs ${type === t.key ? 'text-blue-200' : 'text-slate-400'}`}>
                    ({t.count})
                  </span>
                </button>
              ))}
            </div>
            {emails.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">No email addresses on file for this group.</p>
            )}
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden text-sm">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center gap-2">
              <span className="text-xs text-slate-400 w-14 flex-shrink-0">Subject</span>
              <span className="text-slate-800 font-medium truncate">{subject}</span>
            </div>
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-start gap-2">
              <span className="text-xs text-slate-400 w-14 flex-shrink-0 mt-0.5">BCC</span>
              <span className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                {emails.length > 0 ? emails.slice(0, 4).join(', ') + (emails.length > 4 ? ` +${emails.length - 4} more` : '') : '—'}
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line line-clamp-4">{body}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1 pb-1">
            <button
              onClick={openMailApp}
              disabled={emails.length === 0}
              className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600"
            >
              Open in mail app
            </button>
            <button
              onClick={() => copy('addresses', emails.join(', '))}
              disabled={emails.length === 0}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
            >
              {copiedWhat === 'addresses' ? '✓ Copied!' : 'Copy addresses'}
            </button>
            <button
              onClick={() => copy('message', `Subject: ${subject}\n\n${body}`)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
            >
              {copiedWhat === 'message' ? '✓ Copied!' : 'Copy message'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
