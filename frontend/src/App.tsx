import { Routes, Route, Link } from 'react-router-dom'

import AuthPage from './features/auth/components/AuthPage'
import AttendancePage from './features/attendance/components/AttendancePage'
import LeavePage from './features/leave/components/LeavePage'
import NoticePage from './features/notice/components/NoticePage'
import UserPage from './features/user/components/UserPage'

export default function App() {
  return (
    <>
      {/* 메뉴 영역 */}
      {/* 단순히 페이지 확인용입니다 이용에 참고해주세요 */}
      <nav>
        <Link to="/">로그인</Link>
        <br></br>
        <Link to="/attendance">출결</Link>
        <br></br>
        <Link to="/leave">휴가</Link>
        <br></br>
        <Link to="/notice">공지</Link>
        <br></br>
        <Link to="/user">사용자</Link>
      </nav>

      {/* 페이지 연결 영역 */}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/leave" element={<LeavePage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </>
  )
}
