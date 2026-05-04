# Setup Steps

## 1. Install Node.js
Download from https://nodejs.org (v18 or higher). After installing, open a NEW terminal window.

## 2. Install dependencies
```
cd C:\Users\carso\greek-chapter-app
npm install
```

## 3. Create a Supabase project
1. Go to https://supabase.com and sign up
2. Click "New Project", name it `greek-chapter-app`
3. Go to Project Settings > API and copy:
   - Project URL
   - anon public key

## 4. Add your credentials
Copy `.env.example` to `.env` and fill in your values:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Run the database SQL
In the Supabase dashboard, click SQL Editor > New query.
Paste the entire contents of `supabase/migrations/001_initial_schema.sql` and click Run.

## 6. Add your first chapter (one-time, in SQL Editor)
```sql
insert into chapters (name, greek_letters, university, council)
values ('Your Chapter Name', 'ΑΒΓ', 'Your University', 'IFC');
```
Copy the UUID it returns — you'll need it next.

## 7. Create your admin account
1. Run the app: `npm run dev`
2. Go to http://localhost:5173, sign up with your email
3. In Supabase SQL Editor, link your account as admin:
```sql
insert into chapter_roles (user_id, chapter_id, role)
values (
  (select id from auth.users where email = 'your@email.com'),
  'your-chapter-uuid-here',
  'admin'
);
```

## 8. Deploy Edge Function (for member invites)
```
npm install -g supabase
supabase login
supabase functions deploy invite-member --project-ref your-project-ref
```
Project ref is in Supabase > Settings > General.

## 9. Deploy to Vercel
1. Push this folder to a GitHub repo
2. Go to https://vercel.com, import the repo
3. Add env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
4. Click Deploy
