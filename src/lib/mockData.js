export const mockChapter = {
  id: '1',
  name: 'Alpha Beta Gamma',
  abbreviation: 'ABG',
  organization: 'State University',
  type: 'fraternity',
  custom_member: null, custom_members: null, custom_mentor: null,
  custom_mentee: null, custom_mentees: null, custom_cohort: null,
  custom_team: null, custom_tree_title: null,
  primary_color: '#1D5FE8', logo_url: '/logo.png',
}

export const mockMembers = [
  // ── Whitfield Line ──────────────────────────────────────────
  { id:'1',  chapter_id:'1', big_id:null, first_name:'James',   last_name:'Whitfield', position:'President', email:'james.whitfield@email.com',   phone:'(555) 010-1001', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2020',   class_year:2024, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null, is_admin:true },
  { id:'2',  chapter_id:'1', big_id:'1',  first_name:'Marcus',  last_name:'Torres',  position:'Vice President',    email:'marcus.torres@email.com',     phone:'(555) 010-1002', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'3',  chapter_id:'1', big_id:'2',  first_name:'Aiden',   last_name:'Park',      email:'aiden.park@email.com',        phone:'(555) 010-1003', linkedin_url:'',                     pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:true,  show_email:false, show_linkedin:false, avatar_url:null },
  { id:'7',  chapter_id:'1', big_id:'3',  first_name:'Liam',    last_name:'Foster',    email:'liam.foster@email.com',       phone:'(555) 010-1007', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'8',  chapter_id:'1', big_id:'2',  first_name:'Carlos',  last_name:'Rivera',    email:'carlos.rivera@email.com',     phone:'(555) 010-1008', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'9',  chapter_id:'1', big_id:'1',  first_name:'Ryan',    last_name:'Anderson',  email:'ryan.anderson@email.com',     phone:'(555) 010-1009', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'10', chapter_id:'1', big_id:'9',  first_name:'Brandon', last_name:'Lee',       email:'brandon.lee@email.com',       phone:'(555) 010-1010', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'11', chapter_id:'1', big_id:'10', first_name:'Tyler',   last_name:'Grant',     email:'tyler.grant@email.com',       phone:'(555) 010-1011', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'12', chapter_id:'1', big_id:'9',  first_name:'Connor',  last_name:'Walsh',     email:'connor.walsh@email.com',      phone:'(555) 010-1012', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2022', class_year:2026, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'13', chapter_id:'1', big_id:'1',  first_name:'Jake',    last_name:'Mitchell',  email:'jake.mitchell@email.com',     phone:'(555) 010-1013', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'14', chapter_id:'1', big_id:'13', first_name:'Owen',    last_name:'Davis',     email:'owen.davis@email.com',        phone:'(555) 010-1014', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },

  // ── Johnson Line ─────────────────────────────────────────────
  { id:'4',  chapter_id:'1', big_id:null, first_name:'Derek',   last_name:'Johnson',   email:'derek.johnson@email.com',     phone:'(555) 010-1004', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2019',   class_year:2023, status:'alumni',    show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'5',  chapter_id:'1', big_id:'4',  first_name:'Tyler',   last_name:'Brooks',  position:'Treasurer',    email:'tyler.brooks@email.com',      phone:'(555) 010-1005', linkedin_url:'',                     pledge_class:'Spring 2021', class_year:2025, status:'active',    show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'6',  chapter_id:'1', big_id:'5',  first_name:'Noah',    last_name:'Kim',       email:'noah.kim@email.com',          phone:'(555) 010-1006', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2023',   class_year:2027, status:'active',    show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'15', chapter_id:'1', big_id:'5',  first_name:'Mason',   last_name:'Clark',     email:'mason.clark@email.com',       phone:'(555) 010-1015', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',    show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'16', chapter_id:'1', big_id:'4',  first_name:'Austin',  last_name:'Hall',      email:'austin.hall@email.com',       phone:'(555) 010-1016', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2020',   class_year:2024, status:'alumni',    show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'17', chapter_id:'1', big_id:'16', first_name:'Ethan',   last_name:'Moore',     email:'ethan.moore@email.com',       phone:'(555) 010-1017', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',    show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'18', chapter_id:'1', big_id:'17', first_name:'Blake',   last_name:'Harris',    email:'blake.harris@email.com',      phone:'(555) 010-1018', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',    show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'19', chapter_id:'1', big_id:'18', first_name:'Chase',   last_name:'Martin',    email:'chase.martin@email.com',      phone:'(555) 010-1019', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',    show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'20', chapter_id:'1', big_id:'16', first_name:'Dylan',   last_name:'Scott',     email:'dylan.scott@email.com',       phone:'(555) 010-1020', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2021', class_year:2025, status:'active',    show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },

  // ── Williams Line ─────────────────────────────────────────────
  { id:'21', chapter_id:'1', big_id:null, first_name:'Jordan',  last_name:'Williams',  email:'jordan.williams@email.com',   phone:'(555) 010-1021', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2019',   class_year:2023, status:'alumni',   show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'22', chapter_id:'1', big_id:'21', first_name:'Caleb',   last_name:'Thompson',  email:'caleb.thompson@email.com',    phone:'(555) 010-1022', linkedin_url:'',                     pledge_class:'Fall 2020',   class_year:2024, status:'alumni',   show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'23', chapter_id:'1', big_id:'22', first_name:'Nathan',  last_name:'Roberts',   email:'nathan.roberts@email.com',    phone:'(555) 010-1023', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',   show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'24', chapter_id:'1', big_id:'23', first_name:'Lucas',   last_name:'Evans',     email:'lucas.evans@email.com',       phone:'(555) 010-1024', linkedin_url:'',                     pledge_class:'Fall 2022',   class_year:2026, status:'active',   show_phone:false, show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'25', chapter_id:'1', big_id:'24', first_name:'Parker',  last_name:'Young',     email:'parker.young@email.com',      phone:'(555) 010-1025', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2023',   class_year:2027, status:'active',   show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'26', chapter_id:'1', big_id:'22', first_name:'Ian',     last_name:'Campbell',  email:'ian.campbell@email.com',      phone:'(555) 010-1026', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',   show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'27', chapter_id:'1', big_id:'26', first_name:'Seth',    last_name:'Phillips',  email:'seth.phillips@email.com',     phone:'(555) 010-1027', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',   show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'28', chapter_id:'1', big_id:'21', first_name:'Hunter',  last_name:'Baker',     email:'hunter.baker@email.com',      phone:'(555) 010-1028', linkedin_url:'',                     pledge_class:'Spring 2020', class_year:2024, status:'alumni',   show_phone:true,  show_email:false, show_linkedin:false, avatar_url:null },
  { id:'29', chapter_id:'1', big_id:'28', first_name:'Griffin', last_name:'Adams',     email:'griffin.adams@email.com',     phone:'(555) 010-1029', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',   show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'30', chapter_id:'1', big_id:'29', first_name:'Wade',    last_name:'Nelson',    email:'wade.nelson@email.com',       phone:'(555) 010-1030', linkedin_url:'',                     pledge_class:'Fall 2022',   class_year:2026, status:'active',   show_phone:false, show_email:true,  show_linkedin:false, avatar_url:null },

  // ── Chen Line ────────────────────────────────────────────────
  { id:'31', chapter_id:'1', big_id:null, first_name:'Kevin',   last_name:'Chen',    position:'Secretary',      email:'kevin.chen@email.com',        phone:'(555) 010-1031', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2020',   class_year:2024, status:'active',       show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'32', chapter_id:'1', big_id:'31', first_name:'Daniel',  last_name:'Kim',       email:'daniel.kim@email.com',        phone:'(555) 010-1032', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',       show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'33', chapter_id:'1', big_id:'32', first_name:'Samuel',  last_name:'Park',      email:'samuel.park@email.com',       phone:'(555) 010-1033', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',       show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'34', chapter_id:'1', big_id:'33', first_name:'Wyatt',   last_name:'Torres',    email:'wyatt.torres@email.com',      phone:'(555) 010-1034', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',       show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'35', chapter_id:'1', big_id:'31', first_name:'Michael', last_name:'Zhang',     email:'michael.zhang@email.com',     phone:'(555) 010-1035', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',       show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'36', chapter_id:'1', big_id:'35', first_name:'Andrew',  last_name:'Liu',       email:'andrew.liu@email.com',        phone:'(555) 010-1036', linkedin_url:'',                     pledge_class:'Spring 2022', class_year:2026, status:'active',       show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'37', chapter_id:'1', big_id:'36', first_name:'Xavier',  last_name:'Wang',      email:'xavier.wang@email.com',       phone:'(555) 010-1037', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2023',   class_year:2027, status:'active',       show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'38', chapter_id:'1', big_id:'31', first_name:'Justin',  last_name:'Nguyen',    email:'justin.nguyen@email.com',     phone:'(555) 010-1038', linkedin_url:'',                     pledge_class:'Spring 2021', class_year:2025, status:'active',       show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },

  // ── Rodriguez Line ───────────────────────────────────────────
  { id:'39', chapter_id:'1', big_id:null, first_name:'Marco',   last_name:'Rodriguez', email:'marco.rodriguez@email.com',   phone:'(555) 010-1039', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2019',   class_year:2023, status:'alumni',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'40', chapter_id:'1', big_id:'39', first_name:'Cameron', last_name:'Flores',    email:'cameron.flores@email.com',    phone:'(555) 010-1040', linkedin_url:'',                     pledge_class:'Fall 2020',   class_year:2024, status:'alumni',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'41', chapter_id:'1', big_id:'40', first_name:'Garrett', last_name:'Murphy',    email:'garrett.murphy@email.com',    phone:'(555) 010-1041', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'42', chapter_id:'1', big_id:'41', first_name:'Cole',    last_name:'Rogers',    email:'cole.rogers@email.com',       phone:'(555) 010-1042', linkedin_url:'',                     pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'43', chapter_id:'1', big_id:'42', first_name:'Tanner',  last_name:'Cook',      email:'tanner.cook@email.com',       phone:'(555) 010-1043', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2023',   class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'44', chapter_id:'1', big_id:'40', first_name:'Travis',  last_name:'Morgan',    email:'travis.morgan@email.com',     phone:'(555) 010-1044', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',  show_phone:true,  show_email:false, show_linkedin:false, avatar_url:null },
  { id:'45', chapter_id:'1', big_id:'44', first_name:'Reid',    last_name:'Peterson',  email:'reid.peterson@email.com',     phone:'(555) 010-1045', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'46', chapter_id:'1', big_id:'39', first_name:'Carlos',  last_name:'Hernandez', email:'carlos.hernandez@email.com',  phone:'(555) 010-1046', linkedin_url:'',                     pledge_class:'Spring 2020', class_year:2024, status:'alumni',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },

  // ── Taylor Line ──────────────────────────────────────────────
  { id:'47', chapter_id:'1', big_id:null, first_name:'Ben',     last_name:'Taylor',  position:'Rush Chair',    email:'ben.taylor@email.com',        phone:'(555) 010-1047', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2020',   class_year:2024, status:'active',     show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'48', chapter_id:'1', big_id:'47', first_name:'Logan',   last_name:'White',     email:'logan.white@email.com',       phone:'(555) 010-1048', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',     show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'49', chapter_id:'1', big_id:'48', first_name:'Zach',    last_name:'Brown',     email:'zach.brown@email.com',        phone:'(555) 010-1049', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',     show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'50', chapter_id:'1', big_id:'49', first_name:'Alex',    last_name:'King',      email:'alex.king@email.com',         phone:'(555) 010-1050', linkedin_url:'',                     pledge_class:'Fall 2023',   class_year:2027, status:'active',     show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'51', chapter_id:'1', big_id:null, first_name:'Quinn',   last_name:'Martinez',  email:'quinn.martinez@email.com',    phone:'(555) 010-1051', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2020',   class_year:2024, status:'active',     show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'52', chapter_id:'1', big_id:'51', first_name:'Chris',   last_name:'Turner',    email:'chris.turner@email.com',      phone:'(555) 010-1052', linkedin_url:'',                     pledge_class:'Fall 2021',   class_year:2025, status:'active',     show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'53', chapter_id:'1', big_id:'52', first_name:'Matt',    last_name:'Robinson',  email:'matt.robinson@email.com',     phone:'(555) 010-1053', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2022',   class_year:2026, status:'active',     show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },

  // ── Walker Line ──────────────────────────────────────────────
  { id:'54', chapter_id:'1', big_id:null, first_name:'Jackson', last_name:'Walker',    email:'jackson.walker@email.com',    phone:'(555) 010-1054', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2019',   class_year:2023, status:'alumni',     show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'55', chapter_id:'1', big_id:'54', first_name:'David',   last_name:'Lewis',     email:'david.lewis@email.com',       phone:'(555) 010-1055', linkedin_url:'',                     pledge_class:'Fall 2020',   class_year:2024, status:'alumni',     show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'56', chapter_id:'1', big_id:'55', first_name:'Kyle',    last_name:'Wright',    email:'kyle.wright@email.com',       phone:'(555) 010-1056', linkedin_url:'https://linkedin.com', pledge_class:'Fall 2021',   class_year:2025, status:'active',     show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },

  // ── Class of 2027 — Spring 2024 pledge class ─────────────────
  { id:'57', chapter_id:'1', big_id:'7',  first_name:'Evan',    last_name:'Carter',    email:'evan.carter@email.com',       phone:'(555) 010-1057', linkedin_url:'',                     pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'58', chapter_id:'1', big_id:'11', first_name:'Josh',    last_name:'Simmons',   email:'josh.simmons@email.com',      phone:'(555) 010-1058', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'59', chapter_id:'1', big_id:'34', first_name:'Aaron',   last_name:'Patel',     email:'aaron.patel@email.com',       phone:'(555) 010-1059', linkedin_url:'',                     pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:false, show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'60', chapter_id:'1', big_id:'25', first_name:'Derek',   last_name:'Stone',     email:'derek.stone@email.com',       phone:'(555) 010-1060', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'61', chapter_id:'1', big_id:'43', first_name:'Miles',   last_name:'Donovan',   email:'miles.donovan@email.com',     phone:'(555) 010-1061', linkedin_url:'',                     pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:false, show_linkedin:false, avatar_url:null },
  { id:'62', chapter_id:'1', big_id:'37', first_name:'Leo',     last_name:'Sanchez',   email:'leo.sanchez@email.com',       phone:'(555) 010-1062', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'63', chapter_id:'1', big_id:'50', first_name:'Nate',    last_name:'Owens',     email:'nate.owens@email.com',        phone:'(555) 010-1063', linkedin_url:'',                     pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'64', chapter_id:'1', big_id:'19', first_name:'Cole',    last_name:'Bishop',    email:'cole.bishop@email.com',       phone:'(555) 010-1064', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:true,  avatar_url:null },
  { id:'65', chapter_id:'1', big_id:'15', first_name:'Jordan',  last_name:'Price',     email:'jordan.price@email.com',      phone:'(555) 010-1065', linkedin_url:'',                     pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:true,  show_email:true,  show_linkedin:false, avatar_url:null },
  { id:'66', chapter_id:'1', big_id:'6',  first_name:'Bryce',   last_name:'Hayes',     email:'bryce.hayes@email.com',       phone:'(555) 010-1066', linkedin_url:'https://linkedin.com', pledge_class:'Spring 2024', class_year:2027, status:'active',  show_phone:false, show_email:true,  show_linkedin:true,  avatar_url:null },
]

export const mockEvents = [
  {
    id:'e1', chapter_id:'1',
    title:'Chapter Meeting',
    description:'Weekly chapter meeting. Attendance mandatory for all active members. Agenda sent 24 hours prior.',
    date:'2026-05-04', time:'7:00 PM',
    location:'Chapter House — Main Room',
    rsvp_ids:['1','2','3','5','8','9','12','13','demo'],
    created_at:'2026-04-20',
  },
  {
    id:'e2', chapter_id:'1',
    title:'Alumni Networking Night',
    description:'Connect with alumni across all industries. Business casual attire. Refreshments provided.',
    date:'2026-05-12', time:'6:30 PM',
    location:'Student Union Ballroom',
    rsvp_ids:['1','4','5','6','7','16'],
    created_at:'2026-04-21',
  },
  {
    id:'e3', chapter_id:'1',
    title:'Philanthropy 5K Run',
    description:'Annual charity run benefiting the local food bank. All members and friends welcome. T-shirts provided.',
    date:'2026-05-19', time:'8:00 AM',
    location:'University Track & Field',
    rsvp_ids:['2','3','8','9','10','11','demo'],
    created_at:'2026-04-22',
  },
  {
    id:'e4', chapter_id:'1',
    title:'End of Year Banquet',
    description:'Annual formal banquet celebrating the year\'s achievements. Formal attire required. Tickets required.',
    date:'2026-05-28', time:'6:00 PM',
    location:'Grand Hotel — Grand Ballroom',
    rsvp_ids:[],
    created_at:'2026-04-23',
  },
  {
    id:'e5', chapter_id:'1',
    title:'Spring Retreat',
    description:'Two-day team building retreat. Leadership workshops, team challenges, and brotherhood activities.',
    date:'2026-04-14', time:'9:00 AM',
    location:'Camp Lakewood',
    rsvp_ids:['1','2','3','4','5','6','7','8','9','10','11','12','demo'],
    created_at:'2026-04-01',
  },
  {
    id:'e6', chapter_id:'1',
    title:'New Member Orientation',
    description:'Welcome event for the new pledge class. Campus tour, meet-and-greet, and chapter overview.',
    date:'2026-04-08', time:'5:00 PM',
    location:'Student Activities Center',
    rsvp_ids:['16','17','18','19','20','21','22','23','24','25'],
    created_at:'2026-03-25',
  },
]

export const mockAnnouncements = [
  {
    id:'a1', chapter_id:'1',
    title:'Spring dues deadline: May 1st',
    body:'All active members must submit spring semester dues by May 1st. Payment via Venmo (@chapter-treasurer) or cash to the treasurer. Late fees of $25 apply after the deadline.',
    pinned:true,
    created_at:'2026-04-20',
  },
  {
    id:'a2', chapter_id:'1',
    title:'New T-shirt designs available for vote',
    body:'Check out the new chapter shirt designs posted in the Discord. Voting closes Friday — top design goes to print next week. Two colorways available.',
    pinned:false,
    created_at:'2026-04-18',
  },
  {
    id:'a3', chapter_id:'1',
    title:'End of Year Banquet tickets on sale',
    body:'Tickets for the End of Year Banquet are now available. $40/person, $70/couple. See the social chair to purchase. Venue capacity is limited.',
    pinned:false,
    created_at:'2026-04-15',
  },
]

export const mockMeetings = [
  {
    id: 'm1', chapter_id: '1',
    title: 'Chapter Meeting',
    date: '2026-04-21',
    attendee_ids: ['1','2','3','5','7','8','9','10','11','13','14','17','18','23','24','25','26','27','29','31','32','33','35','36','38','41','42','44','47','48','49','51','52','53','56'],
  },
  {
    id: 'm2', chapter_id: '1',
    title: 'Chapter Meeting',
    date: '2026-04-14',
    attendee_ids: ['1','2','5','7','8','9','12','13','14','17','18','19','20','23','25','26','29','30','31','32','35','38','41','43','44','45','47','48','52','53','56'],
  },
  {
    id: 'm3', chapter_id: '1',
    title: 'Chapter Meeting',
    date: '2026-04-07',
    attendee_ids: ['1','2','3','5','6','8','10','11','13','14','15','17','18','20','23','24','26','27','29','30','32','33','34','35','36','37','38','41','42','44','47','48','49','50','51','52','53','56'],
  },
  {
    id: 'm4', chapter_id: '1',
    title: 'Chapter Meeting',
    date: '2026-03-31',
    attendee_ids: ['1','2','3','5','7','9','10','12','13','15','17','19','20','23','24','25','26','31','32','33','35','37','38','41','42','43','44','47','48','50','51','52','53','56'],
  },
  {
    id: 'm5', chapter_id: '1',
    title: 'Officer Meeting',
    date: '2026-04-10',
    attendee_ids: ['1','2','5','9','13','17','23','31','35','47','51'],
  },
]

export const mockDuesTerms = [
  {
    id: 'dt1', label: 'Fall 2024', finalized: true,
    payments: {
      '1':true, '2':true, '3':false,'5':true, '6':true, '7':false,'8':true, '9':true,
      '10':false,'11':true,'12':true,'13':false,'14':true,'15':true,'16':false,'17':true,
      '18':true,'19':true,'20':false,'21':true,'22':true,'23':true,'24':false,'25':true,
      '26':false,'27':true,'28':true,'29':true,'30':false,'31':true,'32':true,'33':false,
      '34':true,'35':true,'36':true,'37':false,'38':true,'39':true,'40':true,'41':true,
      '42':false,'43':true,'44':true,'45':false,'46':true,'47':true,'48':true,'49':false,
      '50':true,'51':true,'52':true,'53':false,'54':true,'55':true,'56':true,
    },
  },
  {
    id: 'dt2', label: 'Spring 2025', finalized: true,
    payments: {
      '1':true, '2':true, '3':true, '5':false,'6':true, '7':true, '8':true, '9':false,
      '10':true,'11':true,'12':false,'13':true,'14':true,'15':true,'16':true,'17':false,
      '18':true,'19':true,'20':true,'21':true,'22':false,'23':true,'24':true,'25':true,
      '26':true,'27':false,'28':true,'29':true,'30':true,'31':false,'32':true,'33':true,
      '34':false,'35':true,'36':true,'37':true,'38':false,'39':true,'40':true,'41':true,
      '42':true,'43':false,'44':true,'45':true,'46':false,'47':true,'48':true,'49':true,
      '50':false,'51':true,'52':true,'53':true,'54':false,'55':true,'56':true,
    },
  },
  {
    id: 'dt3', label: 'Fall 2025', finalized: true,
    payments: {
      '1':true, '2':true, '3':false,'5':true, '6':false,'7':true, '8':true, '9':true,
      '10':true,'11':false,'12':true,'13':true,'14':true,'15':false,'16':true,'17':true,
      '18':false,'19':true,'20':true,'21':true,'22':true,'23':false,'24':true,'25':true,
      '26':true,'27':true,'28':false,'29':true,'30':true,'31':true,'32':false,'33':true,
      '34':true,'35':true,'36':false,'37':true,'38':true,'39':true,'40':false,'41':true,
      '42':true,'43':true,'44':true,'45':false,'46':true,'47':true,'48':false,'49':true,
      '50':true,'51':true,'52':true,'53':true,'54':false,'55':true,'56':true,
      '57':true,'58':false,'59':true,'60':true,'61':false,'62':true,'63':true,'64':true,'65':false,'66':true,
    },
  },
  {
    id: 'dt4', label: 'Spring 2026', finalized: false,
    payments: {
      '1':true, '2':true, '3':false,'5':true, '6':false,'7':true, '8':true, '9':false,
      '10':true,'11':false,'12':true,'13':true,'14':false,'15':true,'16':true,'17':false,
      '18':true,'19':true,'20':true,'21':false,'22':true,'23':true,'24':false,'25':true,
      '26':true,'27':false,'28':true,'29':true,'30':false,'31':true,'32':true,'33':false,
      '34':true,'35':true,'36':false,'37':true,'38':true,'39':true,'40':true,'41':false,
      '42':true,'43':true,'44':false,'45':true,'46':true,'47':true,'48':true,'49':false,
      '50':true,'51':true,'52':false,'53':true,'54':true,'55':true,'56':false,
      '57':false,'58':true,'59':true,'60':false,'61':true,'62':true,'63':false,'64':true,'65':true,'66':false,
    },
  },
]

export const mockPolls = [
  {
    id: 'poll1', chapter_id: '1',
    title: 'Brother of the Month — April 2026',
    description: 'Vote for who you think best represented the chapter this month.',
    options: [
      { id: 'o1a', text: 'James Whitfield' },
      { id: 'o1b', text: 'Marcus Torres' },
      { id: 'o1c', text: 'Ryan Anderson' },
      { id: 'o1d', text: 'Nathan Roberts' },
    ],
    votes: {
      '3':'o1a','7':'o1b','8':'o1a','12':'o1c','14':'o1a',
      '17':'o1b','19':'o1d','24':'o1a','26':'o1b','30':'o1c',
      '33':'o1a','36':'o1b','41':'o1d','45':'o1a','49':'o1b',
    },
    closed: false,
    created_at: '2026-04-25',
    closes_at: '2026-05-03T23:59',
  },
  {
    id: 'poll2', chapter_id: '1',
    title: 'Spring Formal Venue',
    description: 'Where should we hold the Spring Formal this year? Results are final.',
    options: [
      { id: 'o2a', text: 'Riverside Ballroom' },
      { id: 'o2b', text: 'Campus Rooftop Terrace' },
      { id: 'o2c', text: 'Hotel Grand Downtown' },
      { id: 'o2d', text: 'Alumni House Garden' },
    ],
    votes: {
      '1':'o2c','2':'o2c','3':'o2b','5':'o2a','6':'o2c','7':'o2b','8':'o2a','9':'o2c',
      '10':'o2d','11':'o2b','12':'o2a','13':'o2c','14':'o2b','15':'o2c','17':'o2a',
      '18':'o2d','19':'o2c','20':'o2b','23':'o2a','24':'o2c','25':'o2d','26':'o2b',
      '27':'o2c','29':'o2a','30':'o2c','31':'o2b','32':'o2c','33':'o2a','34':'o2b','35':'o2c',
    },
    closed: true,
    created_at: '2026-04-10',
    closes_at: '2026-04-20T18:00',
  },
  {
    id: 'poll3', chapter_id: '1',
    title: 'End of Year Retreat Destination',
    description: 'Vote for where you want to go for the end of year chapter retreat.',
    options: [
      { id: 'o3a', text: 'Lake House' },
      { id: 'o3b', text: 'Mountain Cabin' },
      { id: 'o3c', text: 'Beach House' },
      { id: 'o3d', text: 'City Hotel' },
    ],
    votes: {
      '1':'o3c','2':'o3b','5':'o3c','9':'o3a','13':'o3b',
    },
    closed: false,
    created_at: '2026-04-28',
    closes_at: '2026-05-10T21:00',
  },
]
