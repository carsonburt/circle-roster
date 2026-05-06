import { Link } from 'react-router-dom'
import { useChapter } from '../contexts/ChapterContext'

const STATUS_STYLES = {
  active:   'bg-emerald-100 text-emerald-700',
  alumni:   'bg-blue-100 text-blue-700',
  inactive: 'bg-slate-100 text-slate-500',
}

const AVATAR_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-violet-400 to-violet-600',
  'from-sky-400 to-sky-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
]

function avatarGradient(name) {
  const i = (name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AVATAR_GRADIENTS.length
  return AVATAR_GRADIENTS[i]
}

export default function MemberCard({ member }) {
  const { terminology: t, chapter, pointLedger } = useChapter()
  const showStanding = chapter?.feature_points && (chapter?.good_standing_min_points || 0) > 0
  const memberPoints = showStanding ? pointLedger.filter(e => e.memberId === member.id).reduce((sum, e) => sum + e.points, 0) : 0
  const inGoodStanding = memberPoints >= (chapter?.good_standing_min_points || 0)
  const initials = `${member.first_name[0]}${member.last_name[0]}`
  const gradient = avatarGradient(member.first_name + member.last_name)

  return (
    <Link to={`/members/${member.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-sm text-white flex-shrink-0 overflow-hidden shadow-sm`}>
            {member.avatar_url
              ? <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-slate-900 truncate text-sm group-hover:text-blue-600 transition-colors">
                {member.first_name} {member.last_name}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[member.status] || STATUS_STYLES.inactive}`}>
                  {member.status}
                </span>
                {showStanding && (
                  <span className={`text-xs font-bold ${inGoodStanding ? 'text-emerald-500' : 'text-amber-500'}`} title={inGoodStanding ? 'Good standing' : 'Below threshold'}>
                    {inGoodStanding ? '✓' : '!'}
                  </span>
                )}
              </div>
            </div>
            {member.position
              ? <p className="text-xs font-semibold truncate mt-0.5" style={{ color: '#4F46E5' }}>{member.position}</p>
              : <p className="text-xs text-slate-400 truncate mt-0.5">{member.pledge_class || '—'}</p>
            }
            {member.class_year && (
              <p className="text-xs text-slate-400 mt-0.5">Class of {member.class_year}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
