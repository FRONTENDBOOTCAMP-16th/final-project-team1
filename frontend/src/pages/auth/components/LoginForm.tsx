import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import Modal from '@/components/common/modal/Modal'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

interface LoginFormProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function LoginForm({ onChangeView }: LoginFormProps) {
  const [studentId, set_studentId] = useState('')
  const [password, set_password] = useState('')
  const [show_password, set_show_password] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const navigate = useNavigate()
  const { login_user, is_loading, error_message } = useLogin()

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({
      title,
      content,
      onConfirm,
    })
    setIsModalOpen(true)
  }
  const handle_login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await login_user(studentId, password)

    if (result.success) {
      if (result.role === 'ADMIN') {
        showAlert('로그인 제한', '관리자 계정입니다. 관리자 로그인 탭을 이용해주세요.')
        return
      }

      if (studentId === password) {
        showAlert(
          '비밀번호 변경 안내',
          '초기 비밀번호를 사용 중입니다. 안전을 위해 비밀번호를 먼저 변경해 주세요.',
          () => {
            navigate('/student/settings') // ⭐️ 확인 클릭 시 실행될 로직
          },
        )
        return
      }

      if (result.passwordYn === 'N') {
        showAlert(
          '비밀번호 재설정 안내',
          '비밀번호가 초기화된 계정입니다. 비밀번호를 변경해 주세요.',
          () => navigate('/student/settings'),
        )
        return
      }

      showAlert('로그인 성공', '환영합니다! 대시보드로 이동합니다.', () =>
        navigate('/student/dashboard'),
      )
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
              value={studentId}
              onChange={(event) => set_studentId(event.target.value.replace(/\s/g, ''))}
              required
            />
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>비밀번호</span>
            <div className="password_input_wrapper">
              <input
                type={show_password ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                className="input_field"
                value={password}
                onChange={(event) => set_password(event.target.value.replace(/\s/g, ''))}
                required
              />
              <button
                type="button"
                className="password_view_button"
                onClick={() => set_show_password(!show_password)}
                tabIndex={-1}
              >
                <img src={show_password ? eyeIcon : eyeOffIcon} alt="Toggle View" />
              </button>
            </div>
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

      <Modal
        isOpen={isModalOpen}
        title={modalConfig.title}
        onClose={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm()
          }
        }}
        onConfirm={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) {
            modalConfig.onConfirm()
          }
        }}
        buttonType="one"
      >
        <p>{modalConfig.content}</p>
      </Modal>
    </section>
  )
}

export default LoginForm
