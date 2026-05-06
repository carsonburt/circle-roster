import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getTerminology } from '../lib/terminology'
import { mockChapter, mockMembers, mockEvents, mockAnnouncements, mockDuesTerms, mockMeetings, mockPolls, mockPointCategories, mockPointLedger } from '../lib/mockData'

// ── helpers ──────────────────────────────────────────────────────────────────

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// ── Supabase fetch helpers ────────────────────────────────────────────────────

async function sbMembers(cid) {
  const { data } = await supabase.from('members').select('*').eq('chapter_id', cid).order('first_name')
  return data || []
}

async function sbEvents(cid) {
  const { data } = await supabase.from('events').select('*, event_rsvps(member_id)').eq('chapter_id', cid).order('date')
  return (data || []).map(e => ({ ...e, rsvp_ids: (e.event_rsvps || []).map(r => r.member_id) }))
}

async function sbAnnouncements(cid) {
  const { data } = await supabase.from('announcements').select('*').eq('chapter_id', cid).order('created_at', { ascending: false })
  return data || []
}

async function sbDuesTerms(cid) {
  const { data } = await supabase.from('dues_terms').select('*, dues_payments(member_id, paid)').eq('chapter_id', cid).order('created_at')
  return (data || []).map(t => ({
    ...t,
    payments: Object.fromEntries((t.dues_payments || []).map(p => [p.member_id, p.paid])),
  }))
}

async function sbMeetings(cid) {
  const { data } = await supabase.from('meetings').select('*, meeting_attendance(member_id)').eq('chapter_id', cid).order('date', { ascending: false })
  return (data || []).map(m => ({ ...m, attendee_ids: (m.meeting_attendance || []).map(a => a.member_id) }))
}

async function sbPolls(cid) {
  const { data } = await supabase.from('polls').select('*, poll_options(*), poll_votes(member_id, option_id)').eq('chapter_id', cid).order('created_at', { ascending: false })
  return (data || []).map(p => ({
    ...p,
    options: (p.poll_options || []).sort((a, b) => a.order_index - b.order_index),
    votes: Object.fromEntries((p.poll_votes || []).map(v => [v.member_id, v.option_id])),
  }))
}

async function sbPointCategories(cid) {
  const { data } = await supabase.from('point_categories').select('*').eq('chapter_id', cid)
  return data || []
}

async function sbPointLedger(cid) {
  const { data } = await supabase.from('point_ledger').select('*').eq('chapter_id', cid).order('created_at', { ascending: false })
  return (data || []).map(e => ({ ...e, memberId: e.member_id, categoryId: e.category_id, category: e.category_name }))
}

async function sbNotifications(cid) {
  const { data } = await supabase.from('notifications').select('*').eq('chapter_id', cid).order('created_at', { ascending: false })
  return (data || []).map(n => ({ ...n, toMemberId: n.to_member_id, fromMemberId: n.from_member_id, createdAt: n.created_at }))
}

async function sbPendingEdits(cid) {
  const { data } = await supabase.from('pending_edits').select('*').eq('chapter_id', cid).order('requested_at', { ascending: false })
  return (data || []).map(e => ({ ...e, memberId: e.member_id, requestedAt: e.requested_at }))
}

// ── Context ───────────────────────────────────────────────────────────────────

const ChapterContext = createContext(null)

export function ChapterProvider({ children }) {
  const [chapter,        setChapter]        = useState(() => load('cr_chapter', mockChapter))
  const [members,        setMembers]        = useState(() => load('cr_members', mockMembers))
  const [events,         setEvents]         = useState(() => load('cr_events', mockEvents))
  const [announcements,  setAnnouncements]  = useState(() => load('cr_announcements', mockAnnouncements))
  const [duesTerms,      setDuesTerms]      = useState(() => load('cr_duesTerms', mockDuesTerms))
  const [meetings,       setMeetings]       = useState(() => load('cr_meetings', mockMeetings))
  const [polls,          setPolls]          = useState(() => load('cr_polls', mockPolls))
  const [pendingEdits,   setPendingEdits]   = useState(() => load('cr_pendingEdits', []))
  const [notifications,  setNotifications]  = useState(() => load('cr_notifications', []))
  const [pointCategories,setPointCategories]= useState(() => load('cr_pointCategories', mockPointCategories))
  const [pointLedger,    setPointLedger]    = useState(() => load('cr_pointLedger', mockPointLedger))

  const [role,          setRole]          = useState(() => localStorage.getItem('cr_role') || null)
  const [memberId,      setMemberIdState] = useState(() => localStorage.getItem('cr_memberId') || null)
  const [isLive,        setIsLive]        = useState(false)
  const [loading,       setLoading]       = useState(!!supabase)

  // ── Supabase auth listener ────────────────────────────────────────────────

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadFromSupabase(session)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsLive(false); setRole(null); setMemberIdState(null); setLoading(false)
      } else if (session) {
        loadFromSupabase(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadFromSupabase(session) {
    setLoading(true)
    try {
      // Find member record by user_id
      let { data: member } = await supabase
        .from('members').select('*, chapters(*)').eq('user_id', session.user.id).maybeSingle()

      // If not found by user_id, try linking by email (invited members)
      if (!member) {
        const { data: byEmail } = await supabase
          .from('members').select('*, chapters(*)')
          .eq('email', session.user.email).is('user_id', null).maybeSingle()
        if (byEmail) {
          await supabase.from('members').update({ user_id: session.user.id }).eq('id', byEmail.id)
          member = { ...byEmail, user_id: session.user.id }
        }
      }

      if (!member?.chapters) {
        // Session exists but no matching member record — clear stale auth state
        setRole(null); setMemberIdState(null); setIsLive(false)
        localStorage.removeItem('cr_role'); localStorage.removeItem('cr_memberId')
        setLoading(false); return
      }

      const cid = member.chapter_id
      const [m, ev, ann, dt, mtg, pl, pc, plg, notif, pe] = await Promise.all([
        sbMembers(cid), sbEvents(cid), sbAnnouncements(cid), sbDuesTerms(cid),
        sbMeetings(cid), sbPolls(cid), sbPointCategories(cid), sbPointLedger(cid),
        sbNotifications(cid), sbPendingEdits(cid),
      ])

      setChapter(member.chapters)
      setMembers(m); setEvents(ev); setAnnouncements(ann); setDuesTerms(dt)
      setMeetings(mtg); setPolls(pl); setPointCategories(pc); setPointLedger(plg)
      setNotifications(notif); setPendingEdits(pe)
      setMemberIdState(member.id)
      setRole(member.is_admin ? 'admin' : 'member')
      setIsLive(true)
    } catch (err) {
      console.error('Supabase load error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ── localStorage (demo mode only) ─────────────────────────────────────────

  useEffect(() => { if (!isLive) localStorage.setItem('cr_chapter',        JSON.stringify(chapter))        }, [chapter, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_members',        JSON.stringify(members))        }, [members, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_events',         JSON.stringify(events))         }, [events, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_announcements',  JSON.stringify(announcements))  }, [announcements, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_duesTerms',      JSON.stringify(duesTerms))      }, [duesTerms, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_meetings',       JSON.stringify(meetings))       }, [meetings, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_polls',          JSON.stringify(polls))          }, [polls, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_pendingEdits',   JSON.stringify(pendingEdits))   }, [pendingEdits, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_notifications',  JSON.stringify(notifications))  }, [notifications, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_pointCategories',JSON.stringify(pointCategories))}, [pointCategories, isLive])
  useEffect(() => { if (!isLive) localStorage.setItem('cr_pointLedger',    JSON.stringify(pointLedger))    }, [pointLedger, isLive])

  // ── Sync helper (fire-and-forget Supabase write) ──────────────────────────

  function sync(fn) {
    if (supabase && isLive) fn().then(({ error } = {}) => { if (error) console.error('sync error:', error) })
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  function login(newRole) {
    localStorage.setItem('cr_role', newRole)
    setRole(newRole)
  }

  async function logout() {
    setRole(null); setMemberIdState(null); setIsLive(false)
    localStorage.removeItem('cr_role'); localStorage.removeItem('cr_memberId')
    if (supabase) await supabase.auth.signOut()
  }

  function setMemberId(id) {
    if (id) localStorage.setItem('cr_memberId', id)
    else localStorage.removeItem('cr_memberId')
    setMemberIdState(id)
  }

  // ── Chapter ───────────────────────────────────────────────────────────────

  function updateChapter(updates) {
    setChapter(prev => ({ ...prev, ...updates }))
    sync(() => supabase.from('chapters').update(updates).eq('id', chapter.id))
  }

  // ── Members ───────────────────────────────────────────────────────────────

  function addMember(member) {
    const id = uid()
    setMembers(prev => [...prev, { ...member, id, chapter_id: chapter.id }])
    sync(() => supabase.from('members').insert({
      id, chapter_id: chapter.id,
      first_name: member.first_name, last_name: member.last_name,
      email: member.email || '', phone: member.phone || '',
      linkedin_url: member.linkedin_url || '', position: member.position || '',
      major: member.major || '', high_school: member.high_school || '',
      pledge_class: member.pledge_class || '', class_year: member.class_year || null,
      status: member.status || 'active', big_id: member.big_id || null,
      is_admin: member.is_admin || false, show_phone: member.show_phone !== false,
      show_email: member.show_email !== false, show_linkedin: member.show_linkedin !== false,
      avatar_url: member.avatar_url || null, password: member.password || 'password',
    }))
    return id
  }

  function updateMember(id, updates) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
    sync(() => supabase.from('members').update(updates).eq('id', id))
  }

  function deleteMember(id) {
    setMembers(prev => prev.filter(m => m.id !== id))
    sync(() => supabase.from('members').delete().eq('id', id))
  }

  function resetAllPasswords(password) {
    setMembers(prev => prev.map(m => ({ ...m, password })))
    sync(() => supabase.from('members').update({ password }).eq('chapter_id', chapter.id))
  }

  // ── Events ────────────────────────────────────────────────────────────────

  function addEvent(event) {
    const id = uid()
    setEvents(prev => [{ ...event, id, chapter_id: chapter.id, rsvp_ids: [], created_at: new Date().toISOString().split('T')[0] }, ...prev])
    sync(() => supabase.from('events').insert({ id, chapter_id: chapter.id, title: event.title, description: event.description || '', date: event.date, time: event.time || '', location: event.location || '' }))
  }

  function updateEvent(id, updates) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    const { rsvp_ids, ...dbUpdates } = updates
    sync(() => supabase.from('events').update(dbUpdates).eq('id', id))
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
    sync(() => supabase.from('events').delete().eq('id', id))
  }

  function toggleRsvp(eventId, userId) {
    let removing = false
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e
      removing = e.rsvp_ids.includes(userId)
      return { ...e, rsvp_ids: removing ? e.rsvp_ids.filter(i => i !== userId) : [...e.rsvp_ids, userId] }
    }))
    if (supabase && isLive) {
      const ev = events.find(e => e.id === eventId)
      const has = ev?.rsvp_ids.includes(userId)
      if (has) sync(() => supabase.from('event_rsvps').delete().eq('event_id', eventId).eq('member_id', userId))
      else sync(() => supabase.from('event_rsvps').insert({ event_id: eventId, member_id: userId }))
    }
  }

  // ── Announcements ─────────────────────────────────────────────────────────

  function addAnnouncement(ann) {
    const id = uid()
    setAnnouncements(prev => [{ ...ann, id, chapter_id: chapter.id, pinned: false, created_at: new Date().toISOString().split('T')[0] }, ...prev])
    sync(() => supabase.from('announcements').insert({ id, chapter_id: chapter.id, title: ann.title, body: ann.body || '', pinned: false }))
  }

  function deleteAnnouncement(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
    sync(() => supabase.from('announcements').delete().eq('id', id))
  }

  function pinAnnouncement(id) {
    const currentPin = announcements.find(a => a.id === id)?.pinned
    setAnnouncements(prev => prev.map(a => ({ ...a, pinned: a.id === id ? !a.pinned : false })))
    if (supabase && isLive) {
      supabase.from('announcements').update({ pinned: false }).eq('chapter_id', chapter.id)
        .then(() => supabase.from('announcements').update({ pinned: !currentPin }).eq('id', id))
        .then(({ error } = {}) => { if (error) console.error(error) })
    }
  }

  // ── Dues ──────────────────────────────────────────────────────────────────

  function toggleDuesForTerm(termId, mId) {
    const term = duesTerms.find(t => t.id === termId)
    const newPaid = term ? !term.payments[mId] : true
    setDuesTerms(prev => prev.map(t => t.id !== termId ? t : { ...t, payments: { ...t.payments, [mId]: newPaid } }))
    sync(() => supabase.from('dues_payments').upsert({ term_id: termId, member_id: mId, paid: newPaid }, { onConflict: 'term_id,member_id' }))
  }

  function setAllDuesForTerm(termId, payments) {
    setDuesTerms(prev => prev.map(t => t.id !== termId ? t : { ...t, payments }))
    if (supabase && isLive) {
      const rows = Object.entries(payments).map(([mId, paid]) => ({ term_id: termId, member_id: mId, paid }))
      supabase.from('dues_payments').upsert(rows, { onConflict: 'term_id,member_id' })
        .then(({ error }) => { if (error) console.error(error) })
    }
  }

  function updateTermLabel(termId, label) {
    setDuesTerms(prev => prev.map(t => t.id !== termId ? t : { ...t, label }))
    sync(() => supabase.from('dues_terms').update({ label }).eq('id', termId))
  }

  function finalizeTerm(termId, nextLabel) {
    const newId = uid()
    setDuesTerms(prev => [
      ...prev.map(t => t.id !== termId ? t : { ...t, finalized: true }),
      { id: newId, chapter_id: chapter.id, label: nextLabel, finalized: false, payments: {} },
    ])
    if (supabase && isLive) {
      supabase.from('dues_terms').update({ finalized: true }).eq('id', termId)
        .then(() => supabase.from('dues_terms').insert({ id: newId, chapter_id: chapter.id, label: nextLabel, finalized: false }))
        .then(({ error } = {}) => { if (error) console.error(error) })
    }
  }

  // ── Meetings ──────────────────────────────────────────────────────────────

  function addMeeting(meeting) {
    const id = uid()
    setMeetings(prev => [{ ...meeting, id, chapter_id: chapter.id, attendee_ids: [] }, ...prev])
    sync(() => supabase.from('meetings').insert({ id, chapter_id: chapter.id, title: meeting.title, date: meeting.date }))
  }

  function deleteMeeting(id) {
    setMeetings(prev => prev.filter(m => m.id !== id))
    sync(() => supabase.from('meetings').delete().eq('id', id))
  }

  function toggleAttendee(meetingId, mId) {
    const mtg = meetings.find(m => m.id === meetingId)
    const has = mtg?.attendee_ids.includes(mId)
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m
      return { ...m, attendee_ids: has ? m.attendee_ids.filter(i => i !== mId) : [...m.attendee_ids, mId] }
    }))
    if (has) sync(() => supabase.from('meeting_attendance').delete().eq('meeting_id', meetingId).eq('member_id', mId))
    else sync(() => supabase.from('meeting_attendance').insert({ meeting_id: meetingId, member_id: mId }))
  }

  function setMeetingAttendees(meetingId, ids) {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, attendee_ids: ids } : m))
    if (supabase && isLive) {
      supabase.from('meeting_attendance').delete().eq('meeting_id', meetingId)
        .then(() => ids.length ? supabase.from('meeting_attendance').insert(ids.map(mId => ({ meeting_id: meetingId, member_id: mId }))) : { error: null })
        .then(({ error } = {}) => { if (error) console.error(error) })
    }
  }

  // ── Polls ─────────────────────────────────────────────────────────────────

  function addPoll(poll) {
    const pollId = uid()
    const options = (poll.options || []).map((o, i) => ({ id: o.id || uid(), text: o.text || o, order_index: i }))
    setPolls(prev => [{ ...poll, id: pollId, chapter_id: chapter.id, options, votes: {}, closed: false, created_at: new Date().toISOString().split('T')[0] }, ...prev])
    if (supabase && isLive) {
      supabase.from('polls').insert({ id: pollId, chapter_id: chapter.id, title: poll.title, description: poll.description || '', closes_at: poll.closes_at || null, closed: false })
        .then(() => supabase.from('poll_options').insert(options.map(o => ({ id: o.id, poll_id: pollId, text: o.text, order_index: o.order_index }))))
        .then(({ error } = {}) => { if (error) console.error(error) })
    }
  }

  function deletePoll(id) {
    setPolls(prev => prev.filter(p => p.id !== id))
    sync(() => supabase.from('polls').delete().eq('id', id))
  }

  function closePoll(id) {
    setPolls(prev => prev.map(p => p.id !== id ? p : { ...p, closed: true }))
    sync(() => supabase.from('polls').update({ closed: true }).eq('id', id))
  }

  function castVote(pollId, voterId, optionId) {
    setPolls(prev => prev.map(p => p.id !== pollId ? p : { ...p, votes: { ...p.votes, [voterId]: optionId } }))
    sync(() => supabase.from('poll_votes').upsert({ poll_id: pollId, member_id: voterId, option_id: optionId }, { onConflict: 'poll_id,member_id' }))
  }

  // ── Notifications ─────────────────────────────────────────────────────────

  function addNotification({ toMemberId = null, fromMemberId = null, type, title, message }) {
    const id = uid()
    setNotifications(prev => [{ id, toMemberId, fromMemberId, type, title, message, read: false, createdAt: new Date().toISOString() }, ...prev])
    sync(() => supabase.from('notifications').insert({ id, chapter_id: chapter.id, to_member_id: toMemberId, from_member_id: fromMemberId, type, title, message: message || '', read: false }))
  }

  function markNotificationRead(id) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    sync(() => supabase.from('notifications').update({ read: true }).eq('id', id))
  }

  function deleteNotification(id) {
    setNotifications(prev => prev.filter(n => n.id !== id))
    sync(() => supabase.from('notifications').delete().eq('id', id))
  }

  function requestPasswordReset(mId) {
    const m = members.find(mb => mb.id === mId)
    addNotification({ toMemberId: null, fromMemberId: mId, type: 'password_reset_request', title: 'Password Reset Request', message: `${m?.first_name} ${m?.last_name} requested a password reset.` })
  }

  // ── Pending Edits ─────────────────────────────────────────────────────────

  function submitProfileEdit(mId, fields) {
    if (!chapter.member_edits_require_approval) {
      updateMember(mId, fields)
    } else {
      const id = uid()
      setPendingEdits(prev => {
        const without = prev.filter(e => e.memberId !== mId)
        return [...without, { id, memberId: mId, member_id: mId, fields, requestedAt: new Date().toISOString() }]
      })
      sync(() => supabase.from('pending_edits').upsert({ id, chapter_id: chapter.id, member_id: mId, fields }, { onConflict: 'chapter_id,member_id' }))
    }
  }

  function approveEdit(editId) {
    const edit = pendingEdits.find(e => e.id === editId)
    if (edit) {
      updateMember(edit.memberId, edit.fields)
      addNotification({ toMemberId: edit.memberId, type: 'profile_approved', title: 'Profile update approved', message: 'Your profile changes have been approved and are now live.' })
    }
    setPendingEdits(prev => prev.filter(e => e.id !== editId))
    sync(() => supabase.from('pending_edits').delete().eq('id', editId))
  }

  function rejectEdit(editId) {
    const edit = pendingEdits.find(e => e.id === editId)
    if (edit) addNotification({ toMemberId: edit.memberId, type: 'profile_rejected', title: 'Profile update not approved', message: 'Your profile update was reviewed and not approved by the admin.' })
    setPendingEdits(prev => prev.filter(e => e.id !== editId))
    sync(() => supabase.from('pending_edits').delete().eq('id', editId))
  }

  // ── Points ────────────────────────────────────────────────────────────────

  function addPointCategory(name, points) {
    const id = uid()
    setPointCategories(prev => [...prev, { id, name, points: Number(points) }])
    sync(() => supabase.from('point_categories').insert({ id, chapter_id: chapter.id, name, points: Number(points) }))
  }

  function deletePointCategory(id) {
    setPointCategories(prev => prev.filter(c => c.id !== id))
    sync(() => supabase.from('point_categories').delete().eq('id', id))
  }

  function awardPoints({ memberId: mId, categoryId, points, note }) {
    const category = pointCategories.find(c => c.id === categoryId)
    const id = uid()
    const entry = { id, memberId: mId, categoryId, points: Number(points), note: note || '', category: category?.name || '', date: new Date().toISOString().split('T')[0] }
    setPointLedger(prev => [entry, ...prev])
    sync(() => supabase.from('point_ledger').insert({ id, chapter_id: chapter.id, member_id: mId, category_id: categoryId, category_name: category?.name || '', points: Number(points), note: note || '' }))
  }

  function deletePointEntry(id) {
    setPointLedger(prev => prev.filter(e => e.id !== id))
    sync(() => supabase.from('point_ledger').delete().eq('id', id))
  }

  function resetPointLedger() {
    setPointLedger([])
    if (supabase && isLive) supabase.from('point_ledger').delete().eq('chapter_id', chapter.id).then(({ error }) => { if (error) console.error(error) })
  }

  // ── Reset helpers ─────────────────────────────────────────────────────────

  function resetToMockData() {
    setChapter(mockChapter); setMembers(mockMembers); setEvents(mockEvents)
    setAnnouncements(mockAnnouncements); setDuesTerms(mockDuesTerms); setMeetings(mockMeetings)
    setPolls(mockPolls); setPendingEdits([]); setNotifications([])
    setPointCategories(mockPointCategories); setPointLedger(mockPointLedger)
  }

  function resetToFreshChapter(chapterUpdates) {
    setChapter(prev => ({ ...prev, ...chapterUpdates }))
    setMembers([]); setEvents([]); setAnnouncements([])
    setDuesTerms([{ id: `dt${Date.now()}`, label: 'Current Term', finalized: false, payments: {} }])
    setMeetings([]); setPolls([]); setPendingEdits([]); setNotifications([])
    setPointCategories([]); setPointLedger([])
  }

  // ── Terminology ───────────────────────────────────────────────────────────

  const terminology = getTerminology(chapter.type, {
    member: chapter.custom_member, members: chapter.custom_members,
    mentor: chapter.custom_mentor, mentee: chapter.custom_mentee, mentees: chapter.custom_mentees,
    cohort: chapter.custom_cohort, team: chapter.custom_team, treeTitle: chapter.custom_tree_title,
  })

  return (
    <ChapterContext.Provider value={{
      chapter, members, events, announcements, duesTerms, meetings, polls,
      role, memberId, terminology, loading, isLive,
      login, logout,
      pendingEdits, setMemberId, submitProfileEdit, approveEdit, rejectEdit, resetAllPasswords,
      notifications, addNotification, markNotificationRead, deleteNotification, requestPasswordReset,
      updateChapter, addMember, updateMember, deleteMember,
      addEvent, updateEvent, deleteEvent, toggleRsvp,
      addAnnouncement, deleteAnnouncement, pinAnnouncement,
      toggleDuesForTerm, setAllDuesForTerm, updateTermLabel, finalizeTerm,
      addMeeting, deleteMeeting, toggleAttendee, setMeetingAttendees,
      addPoll, deletePoll, closePoll, castVote,
      pointCategories, pointLedger,
      addPointCategory, deletePointCategory, awardPoints, deletePointEntry, resetPointLedger,
      resetToMockData, resetToFreshChapter,
      refreshChapter: async () => {
        if (!supabase) return
        const { data: { session } } = await supabase.auth.getSession()
        if (session) await loadFromSupabase(session)
      },
    }}>
      {children}
    </ChapterContext.Provider>
  )
}

export function useChapter() { return useContext(ChapterContext) }
