import { useState } from 'react'
import Modal from '@/components/common/modal/Modal'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

interface ResetPasswordProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function ResetPassword({ onChangeView }: ResetPasswordProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const handleReset = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/

    if (!passwordRegex.test(newPassword)) {
      showAlert('비밀번호 형식 오류', '비밀번호는 영문, 숫자를 포함하여 8~16자로 입력해주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      showAlert('비밀번호 불일치', '입력하신 새 비밀번호가 서로 일치하지 않습니다.')
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
          newPassword,
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
      <form className="login_form" onSubmit={handleReset}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호</span>
            <div className="password_input_wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="비밀번호 8자 이상 영문+숫자 조합"
                className="input_field"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value.replace(/\s/g, ''))}
                required
              />
              <button
                type="button"
                className="password_view_button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                <img src={showNewPassword ? eyeIcon : eyeOffIcon} alt="Toggle View" />
              </button>
            </div>
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호 확인</span>
            <div className="password_input_wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="새 비밀번호를 다시 입력하세요"
                className="input_field"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value.replace(/\s/g, ''))}
                required
              />
              <button
                type="button"
                className="password_view_button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <img src={showConfirmPassword ? eyeIcon : eyeOffIcon} alt="Toggle View" />
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
