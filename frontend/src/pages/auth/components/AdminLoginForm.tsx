import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminLogin } from '../hooks/useAdminLogin'
import Modal from '@/components/common/modal/Modal'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

interface AdminLoginFormProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function AdminLoginForm({ onChangeView }: AdminLoginFormProps) {
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const navigate = useNavigate()
  const { loginAdmin, isLoading, errorMessage } = useAdminLogin()

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({
      title,
      content,
      onConfirm,
    })
    setIsModalOpen(true)
  }

  const handleAdminLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!adminId) {
      showAlert('입력 오류', '관리자 아이디를 입력해 주세요.')
      return
    }

    if (!password) {
      showAlert('입력 오류', '비밀번호를 입력해 주세요.')
      return
    }

    const result = await loginAdmin(adminId, password)

    if (result.success) {
      if (result.role === 'STUDENT') {
        showAlert('로그인 제한', '학생 계정입니다. 학생 로그인 탭을 이용해주세요.')
        return
      }

      navigate('/admin/dashboard')
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handleAdminLogin} noValidate>
        <fieldset className="input_group">
          <legend className="input_label">관리자 아이디</legend>
          <label className="input_label">
            <input
              type="text"
              placeholder="관리자 아이디를 입력하세요"
              className="input_field"
              value={adminId}
              onChange={(event) => setAdminId(event.target.value.replace(/\s/g, ''))}
              required
            />
          </label>
        </fieldset>

        <fieldset className="input_group">
          <legend className="input_label">비밀번호</legend>
          <label className="input_label">
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
          </label>
        </fieldset>

        {errorMessage && (
          <p className="error_text" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="login_submit_button" disabled={isLoading}>
          {isLoading ? '관리자 로그인 중...' : '관리자 로그인'}
        </button>
      </form>

      <footer className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('FIND_PASSWORD')}>
          비밀번호 찾기
        </button>
      </footer>
      <Modal
        isOpen={isModalOpen}
        title={modalConfig.title}
        onClose={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) modalConfig.onConfirm()
        }}
        onConfirm={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) modalConfig.onConfirm()
        }}
        buttonType="one"
      >
        <p>{modalConfig.content}</p>
      </Modal>
    </section>
  )
}

export default AdminLoginForm
