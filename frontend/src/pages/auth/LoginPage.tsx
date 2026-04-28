import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <div>
      <h1>로그인 페이지</h1>

      <Link to="/student/dashboard">학생용</Link>
      <br />
      <Link to="/admin/dashboard">관리자용</Link>
      <br />
      <Link to="/admin/leave">휴가 관리</Link>
    </div>
  )
}

export default LoginPage
