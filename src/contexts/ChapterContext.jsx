import { createContext, useContext, useState } from 'react'
import { getTerminology } from '../lib/terminology'
import { mockChapter, mockMembers, mockEvents, mockAnnouncements, mockDuesTerms, mockMeetings, mockPolls } from '../lib/mockData'

const ChapterContext = createContext(null)

export function ChapterProvider({ children }) {
  const [chapter, setChapter] = useState(mockChapter)
  const [members, setMembers] = useState(mockMembers)
  const [events, setEvents] = useState(mockEvents)
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [duesTerms, setDuesTerms] = useState(mockDuesTerms)
  const [meetings, setMeetings] = useState(mockMeetings)
  const [polls, setPolls] = useState(mockPolls)
  const [role, setRole] = useState(null)
  const memberId = null
  const loading = false

  function login(newRole) {
    setRole(newRole)
  }

  function logout() {
    setRole(null)
  }

  function updateChapter(updates) {
    setChapter(prev => ({ ...prev, ...updates }))
  }

  function addMember(member) {
    const newMember = { ...member, id: Date.now().toString(), chapter_id: chapter.id }
    setMembers(prev => [...prev, newMember])
  }

  function updateMember(id, updates) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  function deleteMember(id) {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  function addEvent(event) {
    const newEvent = {
      ...event,
      id: `e${Date.now()}`,
      chapter_id: chapter.id,
      rsvp_ids: [],
      created_at: new Date().toISOString().split('T')[0],
    }
    setEvents(prev => [newEvent, ...prev])
  }

  function updateEvent(id, updates) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  function toggleRsvp(eventId, userId) {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e
      const has = e.rsvp_ids.includes(userId)
      return { ...e, rsvp_ids: has ? e.rsvp_ids.filter(id => id !== userId) : [...e.rsvp_ids, userId] }
    }))
  }

  function addAnnouncement(ann) {
    const newAnn = {
      ...ann,
      id: `a${Date.now()}`,
      chapter_id: chapter.id,
      pinned: false,
      created_at: new Date().toISOString().split('T')[0],
    }
    setAnnouncements(prev => [newAnn, ...prev])
  }

  function deleteAnnouncement(id) {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  function pinAnnouncement(id) {
    setAnnouncements(prev => prev.map(a => ({ ...a, pinned: a.id === id ? !a.pinned : false })))
  }

  function toggleDuesForTerm(termId, memberId) {
    setDuesTerms(prev => prev.map(t =>
      t.id !== termId ? t :
      { ...t, payments: { ...t.payments, [memberId]: !t.payments[memberId] } }
    ))
  }

  function setAllDuesForTerm(termId, payments) {
    setDuesTerms(prev => prev.map(t => t.id !== termId ? t : { ...t, payments }))
  }

  function updateTermLabel(termId, label) {
    setDuesTerms(prev => prev.map(t => t.id !== termId ? t : { ...t, label }))
  }

  function finalizeTerm(termId, nextLabel) {
    setDuesTerms(prev => [
      ...prev.map(t => t.id !== termId ? t : { ...t, finalized: true }),
      { id: `dt${Date.now()}`, label: nextLabel, finalized: false, payments: {} },
    ])
  }

  function addMeeting(meeting) {
    const newMeeting = {
      ...meeting,
      id: `m${Date.now()}`,
      chapter_id: chapter.id,
      attendee_ids: [],
    }
    setMeetings(prev => [newMeeting, ...prev])
  }

  function deleteMeeting(id) {
    setMeetings(prev => prev.filter(m => m.id !== id))
  }

  function toggleAttendee(meetingId, memberId) {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m
      const has = m.attendee_ids.includes(memberId)
      return { ...m, attendee_ids: has ? m.attendee_ids.filter(id => id !== memberId) : [...m.attendee_ids, memberId] }
    }))
  }

  function setMeetingAttendees(meetingId, ids) {
    setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, attendee_ids: ids } : m))
  }

  function addPoll(poll) {
    setPolls(prev => [{
      ...poll,
      id: `poll${Date.now()}`,
      chapter_id: chapter.id,
      votes: {},
      closed: false,
      created_at: new Date().toISOString().split('T')[0],
    }, ...prev])
  }

  function deletePoll(id) {
    setPolls(prev => prev.filter(p => p.id !== id))
  }

  function closePoll(id) {
    setPolls(prev => prev.map(p => p.id !== id ? p : { ...p, closed: true }))
  }

  function castVote(pollId, voterId, optionId) {
    setPolls(prev => prev.map(p =>
      p.id !== pollId ? p : { ...p, votes: { ...p.votes, [voterId]: optionId } }
    ))
  }

  const terminology = getTerminology(chapter.type, {
    member:    chapter.custom_member,
    members:   chapter.custom_members,
    mentor:    chapter.custom_mentor,
    mentee:    chapter.custom_mentee,
    mentees:   chapter.custom_mentees,
    cohort:    chapter.custom_cohort,
    team:      chapter.custom_team,
    treeTitle: chapter.custom_tree_title,
  })

  return (
    <ChapterContext.Provider value={{
      chapter, members, events, announcements, duesTerms, meetings, polls,
      role, memberId, terminology, loading,
      login, logout,
      updateChapter, addMember, updateMember, deleteMember,
      addEvent, updateEvent, deleteEvent, toggleRsvp,
      addAnnouncement, deleteAnnouncement, pinAnnouncement,
      toggleDuesForTerm, setAllDuesForTerm, updateTermLabel, finalizeTerm,
      addMeeting, deleteMeeting, toggleAttendee, setMeetingAttendees,
      addPoll, deletePoll, closePoll, castVote,
      refreshChapter: () => {},
    }}>
      {children}
    </ChapterContext.Provider>
  )
}

export function useChapter() {
  return useContext(ChapterContext)
}
