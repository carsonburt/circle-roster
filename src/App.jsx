import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChapterProvider } from './contexts/ChapterContext'
import Login from './pages/Login'
import Directory from './pages/Directory'
import MemberProfile from './pages/MemberProfile'
import FamilyTree from './pages/FamilyTree'
import AdminPanel from './pages/AdminPanel'
import JoinPage from './pages/JoinPage'
import Events from './pages/Events'
import Polls from './pages/Polls'
import LandingPage from './pages/LandingPage'
import Inbox from './pages/Inbox'
import PrivateRoute from './components/PrivateRoute'

export default function App() {
  return (
    <ChapterProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/directory' element={<PrivateRoute><Directory /></PrivateRoute>} />
          <Route path='/members/:id' element={<PrivateRoute><MemberProfile /></PrivateRoute>} />
          <Route path='/tree' element={<PrivateRoute><FamilyTree /></PrivateRoute>} />
          <Route path='/admin' element={<PrivateRoute adminOnly><AdminPanel /></PrivateRoute>} />
          <Route path='/events' element={<PrivateRoute><Events /></PrivateRoute>} />
          <Route path='/polls' element={<PrivateRoute><Polls /></PrivateRoute>} />
          <Route path='/inbox' element={<PrivateRoute><Inbox /></PrivateRoute>} />
          <Route path='/join' element={<JoinPage />} />
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </ChapterProvider>
  )
}
