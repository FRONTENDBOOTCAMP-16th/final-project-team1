import { useAuthView } from './hooks/useAuthView'
import LoginForm from './components/LoginForm'
import AdminLoginForm from './components/AdminLoginForm'
import FindPassword from './components/FindPassword'
import ResetPassword from './components/ResetPassword'
import './styles/login.css'

export default function LoginPage() {
  const { view, set_view } = useAuthView()

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
              onClick={() => set_view('LOGIN')}
            >
              학생 로그인
            </button>
            <button
              type="button"
              className={`tab_button ${view === 'ADMIN_LOGIN' ? 'active' : ''}`}
              onClick={() => set_view('ADMIN_LOGIN')}
            >
              관리자 로그인
            </button>
          </nav>
        )}

        <section className="auth_form_content">
          {view === 'LOGIN' && <LoginForm onChangeView={set_view} />}
          {view === 'ADMIN_LOGIN' && <AdminLoginForm onChangeView={set_view} />}
          {view === 'FIND_PASSWORD' && <FindPassword onChangeView={set_view} />}
          {view === 'RESET_PASSWORD' && <ResetPassword onChangeView={set_view} />}
        </section>
      </article>
    </main>
  )
}
