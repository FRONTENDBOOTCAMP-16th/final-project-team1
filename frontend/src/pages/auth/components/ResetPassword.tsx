import { useState } from 'react'
import Modal from '@/components/common/modal/Modal'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

interface ResetPasswordProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function ResetPassword({ onChangeView }: ResetPasswordProps) {
  const [new_password, set_new_password] = useState('')
  const [confirm_password, set_confirm_password] = useState('')
  const [show_new_password, set_show_new_password] = useState(false)
  const [show_confirm_password, set_show_confirm_password] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({
      title,
      content,
      onConfirm,
    })
    setIsModalOpen(true)
  }

  const handle_reset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const password_regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/
    if (!password_regex.test(new_password)) {
      alert('비밀번호는 8자 이상, 영문과 숫자를 혼합해야 합니다.')
      return
    }

    if (new_password !== confirm_password) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.')
      return
    }

    try {
      const resetToken = sessionStorage.getItem('resetToken')
      if (!resetToken) {
        showAlert('인증 만료', '인증 정보가 없습니다. 본인 인증을 다시 진행해 주세요.', () =>
          onChangeView('FIND_PASSWORD'),
        )
        return
      }
      const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
      const API_URL = `${BASE_URL}/api/auth/reset-password`

      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${resetToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: new_password,
        }),
      })

      const text = await response.text()
      const result = text ? JSON.parse(text) : {}

      if (response.ok && result.success !== false) {
        showAlert(
          '변경 완료',
          '비밀번호가 성공적으로 재설정되었습니다. 다시 로그인해 주세요.',
          () => {
            sessionStorage.removeItem('resetToken')
            onChangeView('LOGIN')
          },
        )
      } else {
        showAlert('변경 실패', result.message || '비밀번호 재설정에 실패했습니다.')
      }
    } catch (error) {
      console.error('비밀번호 재설정 통신 에러:', error)
      showAlert(
        '오류 발생',
        '서버와 통신 중 오류가 발생했습니다. 네트워크 상태나 API 주소를 확인해 주세요.',
      )
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handle_reset}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호</span>
            <div className="password_input_wrapper">
              <input
                type={show_new_password ? 'text' : 'password'}
                placeholder="비밀번호 8자 이상 영문+숫자 조합"
                className="input_field"
                value={new_password}
                onChange={(event) => set_new_password(event.target.value.replace(/\s/g, ''))}
                required
              />
              <button
                type="button"
                className="password_view_button"
                onClick={() => set_show_new_password(!show_new_password)}
                tabIndex={-1}
              >
                <img src={show_new_password ? eyeIcon : eyeOffIcon} alt="Toggle View" />
              </button>
            </div>
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호 확인</span>
            <div className="password_input_wrapper">
              <input
                type={show_confirm_password ? 'text' : 'password'}
                placeholder="새 비밀번호를 다시 입력하세요"
                className="input_field"
                value={confirm_password}
                onChange={(event) => set_confirm_password(event.target.value.replace(/\s/g, ''))}
                required
              />
              <button
                type="button"
                className="password_view_button"
                onClick={() => set_show_confirm_password(!show_confirm_password)}
                tabIndex={-1}
              >
                <img src={show_confirm_password ? eyeIcon : eyeOffIcon} alt="Toggle View" />
              </button>
            </div>
          </label>
        </fieldset>

        <button type="submit" className="login_submit_button">
          비밀번호 변경 완료
        </button>
      </form>

      <div className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('LOGIN')}>
          취소하고 돌아가기
        </button>
      </div>
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

export default ResetPassword
