import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

import { useAuthView } from './hooks/useAuthView'
import LoginForm from './components/LoginForm'
import AdminLoginForm from './components/AdminLoginForm'
import FindPassword from './components/FindPassword'
import ResetPassword from './components/ResetPassword'
import { useAuthStore } from '@/store'
import './styles/login.css'

interface JwtPayload {
  exp: number
  role: 'STUDENT' | 'ADMIN'
}

export default function LoginPage() {
  const { view, setView } = useAuthView()
  const navigate = useNavigate()

  // Zustand 로그아웃 함수 가져오기
  const setLogout = useAuthStore((state) => state.setLogout)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) return

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(new Date().getTime() / 1000)

      if (decoded.exp <= now) {
        setLogout() // 직접 지우지 말고 스토어 함수 사용!
        return
      }

      if (decoded.role === 'ADMIN') {
        navigate('/admin/dashboard')
        return
      }

      if (decoded.role === 'STUDENT') {
        navigate('/student/dashboard')
        return
      }
    } catch {
      setLogout() // 에러 시에도 스토어 함수 사용
    }
  }, [navigate, setLogout]) // 의존성 배열에 setLogout 추가

  return (
    <main className="login_page_wrapper">
      <article className="login_card">
        <header className="login_header">
          <h1 className="service_title">CHECKMATE</h1>
          <p className="service_subtitle">멋사 출결관리 시스템</p>
        </header>

        {(view === 'LOGIN' || view === 'ADMIN_LOGIN') && (
          <nav className="auth_tabs">
            <button
              type="button"
              className={`tab_button ${view === 'LOGIN' ? 'active' : ''}`}
              onClick={() => setView('LOGIN')}
            >
              학생 로그인
            </button>
            <button
              type="button"
              className={`tab_button ${view === 'ADMIN_LOGIN' ? 'active' : ''}`}
              onClick={() => setView('ADMIN_LOGIN')}
            >
              관리자 로그인
            </button>
          </nav>
        )}

        <section className="auth_form_content">
          {view === 'LOGIN' && <LoginForm onChangeView={setView} />}
          {view === 'ADMIN_LOGIN' && <AdminLoginForm onChangeView={setView} />}
          {view === 'FIND_PASSWORD' && <FindPassword onChangeView={setView} />}
          {view === 'RESET_PASSWORD' && <ResetPassword onChangeView={setView} />}
        </section>
      </article>
    </main>
  )
}
