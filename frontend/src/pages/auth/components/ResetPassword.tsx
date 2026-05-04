import { useState } from 'react'

interface ResetPasswordProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function ResetPassword({ onChangeView }: ResetPasswordProps) {
  const [new_password, set_new_password] = useState('')
  const [confirm_password, set_confirm_password] = useState('')

  const handle_reset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (new_password !== confirm_password) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.')
      return
    }

    try {
      const target_student_id = sessionStorage.getItem('reset_student_id')

      if (!target_student_id) {
        alert('인증 정보가 만료되었습니다. 다시 본인 인증을 진행해 주세요.')
        onChangeView('FIND_PASSWORD')
        return
      }

      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`

      const response = await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: target_student_id,
          newPassword: new_password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다! 새 비밀번호로 로그인해 주세요.')

        sessionStorage.removeItem('reset_student_id')

        onChangeView('LOGIN')
      } else {
        alert(result.message || '비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('비밀번호 재설정 에러:', error)
      alert('서버와 연결할 수 없습니다.')
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handle_reset}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호</span>
            <input
              type="password"
              placeholder="비밀번호 8자 이상 영문+숫자 조합"
              className="input_field"
              value={new_password}
              onChange={(event) => set_new_password(event.target.value)}
              required
            />
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>새 비밀번호 확인</span>
            <input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              className="input_field"
              value={confirm_password}
              onChange={(event) => set_confirm_password(event.target.value)}
              required
            />
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
    </section>
  )
}

export default ResetPassword
