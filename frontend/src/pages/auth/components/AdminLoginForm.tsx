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
  const [adminId, set_adminId] = useState('')
  const [password, set_password] = useState('')
  const [show_password, set_show_password] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const navigate = useNavigate()
  const { login_admin, is_loading, error_message } = useAdminLogin()

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({
      title,
      content,
      onConfirm,
    })
    setIsModalOpen(true)
  }

  const handle_admin_login = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await login_admin(adminId, password)

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
      <form className="login_form" onSubmit={handle_admin_login}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>관리자 아이디</span>
            <input
              type="text"
              placeholder="관리자 아이디를 입력하세요"
              className="input_field"
              value={adminId}
              onChange={(event) => set_adminId(event.target.value.replace(/\s/g, ''))}
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
