import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

interface LoginFormProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function LoginForm({ onChangeView }: LoginFormProps) {
  const [student_id, set_student_id] = useState('')
  const [password, set_password] = useState('')

  const { login_user, is_loading, error_message } = useLogin()

  const handle_login = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await login_user(student_id, password)

    if (result.success) {
      if (result.role === 'ADMIN') {
        alert('관리자 계정입니다. 관리자 로그인 탭을 이용해주세요.')
        return
      }

      if (result.password_yn === 'N') {
        onChangeView('RESET_PASSWORD')
      } else {
        window.location.href = '/student/dashboard'
      }
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handle_login}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>학번</span>
            <input
              type="text"
              placeholder="학번을 입력하세요"
              className="input_field"
              value={student_id}
              onChange={(event) => set_student_id(event.target.value)}
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

        {error_message && <p className="error_text">{error_message}</p>}

        <button type="submit" className="login_submit_button" disabled={is_loading}>
          {is_loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('FIND_PASSWORD')}>
          비밀번호 찾기
        </button>
      </div>
    </section>
  )
}

export default LoginForm
