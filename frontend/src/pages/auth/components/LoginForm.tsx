import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import Modal from '@/components/common/modal/Modal'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

interface LoginFormProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function LoginForm({ onChangeView }: LoginFormProps) {
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const navigate = useNavigate()
  const { loginUser, isLoading, errorMessage } = useLogin()

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({
      title,
      content,
      onConfirm,
    })
    setIsModalOpen(true)
  }
  const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!studentId) {
      showAlert('입력 오류', '학번을 입력해 주세요.')
      return
    }

    if (!password) {
      showAlert('입력 오류', '비밀번호를 입력해 주세요.')
      return
    }

    const result = await loginUser(studentId, password)

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

      navigate('/student/dashboard')
    }
  }
  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handleLogin} noValidate>
        <fieldset className="input_group">
          <legend className="input_label">학번</legend>
          <label className="input_label">
            {isLoading ? (
              <div style={{ width: '100%', height: '50px', lineHeight: 0, display: 'block' }}>
                <Skeleton width="100%" height="100%" borderRadius={12} />
              </div>
            ) : (
              <input
                type="text"
                placeholder="학번을 입력하세요"
                className="input_field"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value.replace(/\s/g, ''))}
                required
              />
            )}
          </label>
        </fieldset>

        <fieldset className="input_group">
          <legend className="input_label">비밀번호</legend>
          <label className="input_label">
            {isLoading ? (
              <div style={{ width: '100%', height: '50px', lineHeight: 0, display: 'block' }}>
                <Skeleton width="100%" height="100%" borderRadius={12} />
              </div>
            ) : (
              <div className="password_input_wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  className="input_field"
                  value={password}
                  onChange={(event) => setPassword(event.target.value.replace(/\s/g, ''))}
                  required
                />
                <button
                  type="button"
                  className="password_view_button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                  aria-pressed={showPassword}
                  title={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  <img src={showPassword ? eyeIcon : eyeOffIcon} alt="" aria-hidden="true" />
                </button>
              </div>
            )}
          </label>
        </fieldset>

        {errorMessage && <p className="error_text">{errorMessage}</p>}

        <button type="submit" className="login_submit_button" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
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
