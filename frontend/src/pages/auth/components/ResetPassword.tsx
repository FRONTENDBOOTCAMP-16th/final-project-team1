import { useState } from 'react'

interface ResetPasswordProps {
  onChangeView: (view: 'LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function ResetPassword({ onChangeView }: ResetPasswordProps) {
  const [new_password, set_new_password] = useState('')
  const [confirm_password, set_confirm_password] = useState('')

  const handle_reset = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    // 프론트엔드 1차 유효성 검사
    if (new_password !== confirm_password) {
      alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.')
      return
    }

    // TODO: 한결님의 PATCH /api/student/settings/password API 연동
    // 성공 시 onChangeView('LOGIN') 호출
  }

  return (
    <div className="auth_content">
      <form className="login_form" onSubmit={handle_reset}>
        <div className="input_group">
          <label className="input_label">새 비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 8자 이상 영문+숫자 조합"
            className="input_field"
            value={new_password}
            onChange={(event) => set_new_password(event.target.value)}
            required
          />
        </div>

        <div className="input_group">
          <label className="input_label">새 비밀번호 확인</label>
          <input
            type="password"
            placeholder="새 비밀번호를 입력하세요"
            className="input_field"
            value={confirm_password}
            onChange={(event) => set_confirm_password(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="login_submit_button">
          비밀번호 변경 완료
        </button>
      </form>

      <div className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('LOGIN')}>
          취소하고 돌아가기
        </button>
      </div>
    </div>
  )
}

export default ResetPassword
