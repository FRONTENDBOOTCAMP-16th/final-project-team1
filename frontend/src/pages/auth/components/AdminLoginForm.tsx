import { useState } from 'react'
import { useLogin } from '../hooks/useLogin' // 동일한 로그인 훅 사용 (필요 시 관리자용 훅으로 교체)

interface AdminLoginFormProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function AdminLoginForm({ onChangeView }: AdminLoginFormProps) {
  const [admin_id, set_admin_id] = useState('')
  const [password, set_password] = useState('')

  // 학생 로그인과 동일한 훅을 사용하되, 결과 처리에서 역할을 구분합니다.
  const { login_user, is_loading, error_message } = useLogin()

  const handle_admin_login = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await login_user(admin_id, password)

    if (result.success) {
      if (result.role === 'STUDENT') {
        alert('학생 계정입니다. 학생 로그인 탭을 이용해주세요.')
        return
      }

      window.location.href = '/admin/dashboard'
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handle_admin_login}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>관리자 아이디</span>
            <input
              type="text"
              placeholder="관리자 아이디를 입력하세요"
              className="input_field"
              value={admin_id}
              onChange={(event) => set_admin_id(event.target.value)}
              required
            />
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className="input_field"
              value={password}
              onChange={(event) => set_password(event.target.value)}
              required
            />
          </label>
        </fieldset>

        {error_message && (
          <p className="error_text" role="alert">
            {error_message}
          </p>
        )}

        <button type="submit" className="login_submit_button" disabled={is_loading}>
          {is_loading ? '관리자 로그인 중...' : '관리자 로그인'}
        </button>
      </form>

      <footer className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('FIND_PASSWORD')}>
          비밀번호 찾기
        </button>
      </footer>
    </section>
  )
}

export default AdminLoginForm
