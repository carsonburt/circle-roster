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
  const { chapter, members, role, terminology: t } = useChapter()

  const member = members.find(m => m.id === id)
  const mentor = member?.big_id ? members.find(m => m.id === member.big_id) : null
  const mentees = members.filter(m => m.big_id === id)
  const isAdmin = role === 'admin'

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
      </main>
      <BottomNav />
    </div>
  )
}
