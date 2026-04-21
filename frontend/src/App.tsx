import { Routes, Route } from 'react-router-dom'

import AuthPage from './features/auth/components/AuthPage'
import AttendancePage from './features/attendance/components/AttendancePage'
import LeavePage from './features/leave/components/LeavePage'
import NoticePage from './features/notice/components/NoticePage'
import UserPage from './features/user/components/UserPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leave" element={<LeavePage />} />
      <Route path="/notice" element={<NoticePage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
  )
}
