import { useRef } from 'react'
import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '👥',
    title: 'Member Directory',
    desc: 'Searchable, filterable roster with profiles, contact info, and privacy controls for every member.',
  },
  {
    icon: '🌳',
    title: 'Big/Little Tree',
    desc: 'Visualize your mentor relationships as a live, interactive family tree anyone can explore.',
  },
  {
    icon: '📅',
    title: 'Events & RSVPs',
    desc: 'Create events, track who\'s coming, and let members RSVP in one tap — no group chat needed.',
  },
  {
    icon: '💰',
    title: 'Dues Tracker',
    desc: 'See at a glance who\'s paid. Mark members paid one at a time or bulk-update with one click.',
  },
  {
    icon: '📢',
    title: 'Announcements',
    desc: 'Pin important updates so they\'re the first thing members see when they open the directory.',
  },
  {
    icon: '🗳️',
    title: 'Polls & Voting',
    desc: 'Create anonymous or open votes, set closing times, and see live results — no third-party app needed.',
  },
  {
    icon: '✅',
    title: 'Attendance Tracking',
    desc: 'Take attendance at meetings and events. See who shows up, track trends over time, and export records.',
  },
  {
    icon: '🔗',
    title: 'LinkedIn Networking',
    desc: 'Every member profile links directly to LinkedIn. Stay connected with current members and alumni in one tap.',
  },
  {
    icon: '📊',
    title: 'Excel Import / Export',
    desc: 'Already have a roster? Import it from a spreadsheet in seconds. Export dues, member lists, and more anytime.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Set up your chapter',
    desc: 'Add your chapter name, pick your group type, and customize every label to match your terminology.',
  },
  {
    n: '2',
    title: 'Add your members',
    desc: 'Import from a spreadsheet, add members manually, or send personalized invite links for self-signup.',
  },
  {
    n: '3',
    title: 'Stay organized together',
    desc: 'Members get a searchable directory, family tree, events calendar, and announcements — on any device.',
  },
]

export default function LandingPage() {
  const previewRef = useRef(null)
  function scrollPreview(dir) {
    previewRef.current?.scrollBy({ left: dir * 272, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain flex-shrink-0" />
            <span className="font-bold text-[#0F1F6B] text-lg tracking-tight">Circle Roster</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              to="/directory"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try demo
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="text-white" style={{ background: 'linear-gradient(135deg, #0F1F6B 0%, #0a1445 60%, #0d1a3a 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide">
                Built for Greek chapters, clubs & organizations
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
                Build Your Circle.
              </h1>
              <p className="text-lg sm:text-xl text-blue-200 font-medium mb-4">Everything your chapter needs, in one place.</p>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
                Member directory, Big/Little family tree, events, dues tracking, and announcements —
                organized, mobile-friendly, and ready in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/directory"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  Try the demo →
                </Link>
                <a
                  href="#features"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  See features
                </a>
              </div>
            </div>
            {/* Logo */}
            <div className="hidden lg:flex flex-shrink-0 items-center justify-center">
              <img
                src="/logo.png"
                alt="Circle Roster"
                className="w-72 h-72 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── App preview strip ─────────────────────────────────── */}
      <section className="bg-slate-50 border-b border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest text-center mb-6">
            A preview of what your members will see
          </p>
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => scrollPreview(-1)}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
            >
              ‹
            </button>
            {/* Right arrow */}
            <button
              onClick={() => scrollPreview(1)}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
            >
              ›
            </button>
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-9 top-0 bottom-2 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="pointer-events-none absolute right-9 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10" />
          <div ref={previewRef} className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide px-10">

            {/* Member card */}
            <div className="snap-start flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">JW</div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">James Whitfield</p>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">active</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Fall 2020 · Whitfield Line</p>
              <p className="text-xs text-slate-400 mt-0.5">Class of 2024</p>
            </div>

            {/* Event card */}
            <div className="snap-start flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-60">
              <div className="flex gap-3">
                <div className="w-12 flex-shrink-0 bg-blue-600 rounded-xl py-2 text-white text-center">
                  <p className="text-xs font-semibold opacity-75">MAY</p>
                  <p className="text-2xl font-bold leading-none mt-0.5">12</p>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Alumni Night</p>
                  <p className="text-xs text-slate-500 mt-0.5">Monday · 7:00 PM</p>
                  <p className="text-xs text-slate-400 mt-0.5">Student Union</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400">8 going</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-lg font-medium">RSVP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dues card */}
            <div className="snap-start flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-60">
              <p className="text-sm font-semibold text-slate-900 mb-1">Dues — Spring 2026</p>
              <p className="text-xs text-slate-500 mb-3">44 / 56 members paid</p>
              <div className="h-2 bg-slate-100 rounded-full mb-4">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="space-y-2">
                {[['JW', 'James W.', true], ['MT', 'Marcus T.', true], ['AP', 'Aiden P.', false]].map(([init, name, paid]) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">{init}</div>
                      <span className="text-xs text-slate-700">{name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${paid ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {paid ? '✓ Paid' : 'Unpaid'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcement */}
            <div className="snap-start flex-shrink-0 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm p-5 w-60">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-base mt-0.5">📌</span>
                <p className="text-sm font-semibold text-amber-900 leading-snug">Spring dues deadline: May 1st</p>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                All active members must submit spring dues by May 1st. Late fees of $25 apply after the deadline.
              </p>
              <p className="text-xs text-amber-400 mt-3">Posted Apr 20</p>
            </div>

            {/* Family tree node preview */}
            <div className="snap-start flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 w-60">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Big/Little Tree</p>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-xl">Alpha Beta Gamma</div>
                <div className="w-px h-3 bg-slate-200" />
                <div className="bg-white border border-slate-200 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm">James Whitfield</div>
                <div className="flex gap-3">
                  <div className="w-px h-3 bg-slate-200" />
                  <div className="w-px h-3 bg-slate-200" />
                </div>
                <div className="flex gap-2">
                  <div className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg shadow-sm">Marcus T.</div>
                  <div className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1 rounded-lg shadow-sm">Ryan A.</div>
                </div>
              </div>
            </div>

          </div>
          </div>{/* end relative wrapper */}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Everything you need to run your chapter
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              No more spreadsheets. No more group chats hunting for someone's phone number.
              One organized place for everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div
                key={f.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all duration-200"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Networking spotlight ──────────────────────────────── */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Mock alumni cards */}
            <div className="flex-shrink-0 w-full max-w-sm space-y-3">
              {[
                { initials: 'JW', name: 'James Whitfield', cohort: 'Fall 2020 · Class of 2024', role: 'Analyst at J.P. Morgan', status: 'alumni' },
                { initials: 'MT', name: 'Marcus Thompson', cohort: 'Spring 2021 · Class of 2025', role: 'Software Engineer at Google', status: 'alumni' },
                { initials: 'SA', name: 'Sofia Alvarez', cohort: 'Fall 2021 · Class of 2025', role: 'Marketing Associate at Nike', status: 'alumni' },
              ].map(m => (
                <div key={m.name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 text-white" style={{ backgroundColor: '#1D5FE8' }}>
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                    <p className="text-xs text-slate-400 truncate">{m.cohort}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{m.role}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center text-xs font-bold">
                    in
                  </div>
                </div>
              ))}
              <p className="text-xs text-center text-slate-400 pt-1">LinkedIn linked directly on every member profile</p>
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide">
                🔗 Built-in networking
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Your alumni network is your most valuable asset.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                Circle Roster keeps members connected long after graduation. Browse alumni by pledge class, find someone working in your industry, and jump straight to their LinkedIn — all from one place.
              </p>
              <ul className="space-y-3">
                {[
                  'LinkedIn profiles linked on every member card',
                  'Alumni stay in the directory forever — searchable and reachable',
                  'Filter by graduation year, pledge class, or status',
                  'One tap to connect — no hunting through LinkedIn or old group chats',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="font-bold mt-0.5 flex-shrink-0" style={{ color: '#1D5FE8' }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Up and running in minutes</h2>
            <p className="text-slate-500">No IT setup. No long onboarding. Just your chapter, organized.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-calc(50%-20px)] h-px bg-slate-200" />
                )}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0 z-10 relative">
                    {s.n}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Simple, honest pricing</h2>
            <p className="text-slate-500">One plan for growing chapters, one for chapters with no limits.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Basic */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Basic</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold text-slate-900">$19.99</span>
                <span className="text-slate-400 mb-2 text-lg">/mo</span>
              </div>
              <p className="text-sm text-slate-500 mb-7">Up to 50 members · active & alumni combined</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                {[
                  'Up to 50 total members',
                  'Member directory & profiles',
                  'Big/Little family tree',
                  'Events & RSVPs',
                  'Polls & voting',
                  'Announcements & dues tracker',
                  'Excel import & CSV export',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="text-green-500 font-bold flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/directory"
                className="block w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Try the demo
              </Link>
            </div>

            {/* Pro */}
            <div className="text-white rounded-2xl p-5 sm:p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F1F6B 0%, #1D5FE8 100%)' }}>
              <div className="absolute top-5 right-5 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full tracking-wide">
                Most popular
              </div>
              <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl sm:text-5xl font-bold">$34.99</span>
                <span className="text-blue-300 mb-2 text-lg">/mo</span>
              </div>
              <p className="text-sm text-blue-200 mb-7">Unlimited members · no caps, ever</p>
              <ul className="space-y-3 mb-8 text-sm text-blue-100">
                {[
                  'Everything in Basic',
                  'Unlimited members',
                  'Member invite links',
                  'Custom branding & accent color',
                  'Excel dues export by term',
                  'Priority support',
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="text-blue-300 font-bold flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/directory"
                className="block w-full text-center bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Try the demo
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #0F1F6B 0%, #1D5FE8 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Build Your Circle?
          </h2>
          <p className="text-blue-200 mb-8 text-lg leading-relaxed">
            Join hundreds of chapters already using Circle Roster to stay connected and organized.
          </p>
          <Link
            to="/directory"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg"
          >
            Try the demo →
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="" className="w-7 h-7 object-contain flex-shrink-0" />
            <span className="font-bold text-white text-lg tracking-tight">Circle Roster</span>
          </div>
          <p className="text-sm text-slate-500">
            Built for Greek chapters, clubs & organizations.
          </p>
          <Link
            to="/login"
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign in →
          </Link>
        </div>
      </footer>

    </div>
  )
}
