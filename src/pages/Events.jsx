import { useState } from 'react'
import { useChapter } from '../contexts/ChapterContext'
import Navbar from '../components/Navbar'
import BottomNav from '../components/BottomNav'
import EmailModal from '../components/EmailModal'

const VIEWER_ID = 'demo'
const EMPTY_FORM = { title: '', description: '', date: '', time: '', location: '' }

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

export default function Events() {
  const { chapter, events, role, addEvent, updateEvent, deleteEvent, toggleRsvp } = useChapter()
  const brandColor = chapter?.primary_color || '#4F46E5'

  const [tab, setTab] = useState('upcoming')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [emailState, setEmailState] = useState(null) // { event, type }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
  const displayed = tab === 'upcoming' ? upcoming : past

  function openAdd() {
    setEditingEvent(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(ev) {
    setEditingEvent(ev)
    setForm({ title: ev.title, description: ev.description, date: ev.date, time: ev.time, location: ev.location })
    setShowForm(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (editingEvent) {
      updateEvent(editingEvent.id, form)
    } else {
      addEvent(form)
    }
    setShowForm(false)
    setEditingEvent(null)
    setForm(EMPTY_FORM)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24 sm:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Events</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {upcoming.length} upcoming · {past.length} past
            </p>
          </div>
          {role === 'admin' && (
            <button
              onClick={openAdd}
              className="text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: brandColor }}
            >
              + Add Event
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 mb-5 bg-slate-100 rounded-xl p-1 w-fit">
          {[['upcoming', upcoming.length], ['past', past.length]].map(([label, count]) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === label ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Event list */}
        {displayed.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">{tab === 'upcoming' ? '📅' : '📋'}</div>
            <p className="text-slate-500 font-medium">No {tab} events</p>
            {role === 'admin' && tab === 'upcoming' && (
              <button
                onClick={openAdd}
                className="mt-3 text-sm font-medium hover:opacity-80 transition-opacity"
                style={{ color: brandColor }}
              >
                Add your first event →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(ev => {
              const { month, day, weekday } = formatDate(ev.date)
              const isGoing = ev.rsvp_ids.includes(VIEWER_ID)
              const isPast = ev.date < today

              return (
                <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-300 transition-colors">
                  <div className="flex gap-4">
                    {/* Date badge */}
                    <div
                      className="w-14 flex-shrink-0 flex flex-col items-center justify-center rounded-xl py-2.5 text-white"
                      style={{ backgroundColor: isPast ? '#94A3B8' : brandColor }}
                    >
                      <span className="text-xs font-semibold tracking-wider opacity-80">{month}</span>
                      <span className="text-2xl font-bold leading-none mt-0.5">{day}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 leading-snug">{ev.title}</h3>
                        {role === 'admin' && (
                          <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
                            <button
                              onClick={() => setEmailState({ ev, type: 'active' })}
                              className="text-xs bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-1 rounded-lg transition-colors"
                            >
                              ✉ Active
                            </button>
                            <button
                              onClick={() => setEmailState({ ev, type: 'alumni' })}
                              className="text-xs bg-violet-50 text-violet-700 hover:bg-violet-100 px-2 py-1 rounded-lg transition-colors"
                            >
                              ✉ Alumni
                            </button>
                            <button
                              onClick={() => openEdit(ev)}
                              className="text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => { if (confirm('Delete this event?')) deleteEvent(ev.id) }}
                              className="text-xs bg-red-50 text-red-500 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-slate-500 mt-0.5">
                        {weekday} · {ev.time}
                        {ev.location && <span className="text-slate-400"> · {ev.location}</span>}
                      </p>

                      {ev.description && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{ev.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-400">
                          {ev.rsvp_ids.length} {ev.rsvp_ids.length === 1 ? 'person' : 'people'} going
                        </span>
                        {!isPast && (
                          <button
                            onClick={() => toggleRsvp(ev.id, VIEWER_ID)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                              isGoing
                                ? 'bg-green-100 text-green-700 hover:bg-red-50 hover:text-red-500'
                                : 'text-white hover:opacity-80'
                            }`}
                            style={!isGoing ? { backgroundColor: brandColor } : {}}
                          >
                            {isGoing ? '✓ Going' : 'RSVP'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />

      {emailState && (() => {
        const { ev, type } = emailState
        const d = new Date(ev.date + 'T12:00:00')
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        const body = `Hi,\n\nWe have an upcoming event we'd love for you to join:\n\n${ev.title}\nDate: ${dateStr}\nTime: ${ev.time}${ev.location ? `\nLocation: ${ev.location}` : ''}${ev.description ? `\n\n${ev.description}` : ''}\n\nHope to see you there!\n— ${chapter?.name || 'Circle Roster'}`
        return (
          <EmailModal
            subject={`${ev.title} — ${dateStr}`}
            body={body}
            defaultType={type}
            onClose={() => setEmailState(null)}
          />
        )
      })()}

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-10"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
            >
              ×
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-5">
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date" required
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="text" required
                    placeholder="7:00 PM"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text" required
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: brandColor }}
                >
                  {editingEvent ? 'Save changes' : 'Create event'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
