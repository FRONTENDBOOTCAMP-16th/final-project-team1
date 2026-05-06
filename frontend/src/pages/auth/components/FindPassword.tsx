import { useState } from 'react'

interface FindPasswordProps {
  onChangeView: (view: 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD') => void
}

function FindPassword({ onChangeView }: FindPasswordProps) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleVerify = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/find-password`

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phoneNumber }),
      })

      const result = await response.json()

      sessionStorage.setItem('reset_student_id', result.data.studentId)

      if (response.ok) {
        alert('본인 인증이 완료되었습니다. 새 비밀번호를 설정해 주세요.')
        onChangeView('RESET_PASSWORD')
      } else {
        alert(result.message || '입력하신 정보와 일치하는 학생이 없습니다.')
      }
    } catch (error) {
      console.error('본인 인증 에러:', error)
    }
  }

  return (
    <section className="auth_content">
      <form className="login_form" onSubmit={handleVerify}>
        <fieldset className="input_group">
          <label className="input_label">
            <span>이름</span>
            <input
              type="text"
              placeholder="홍길동"
              className="input_field"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        </fieldset>

        <fieldset className="input_group">
          <label className="input_label">
            <span>전화번호</span>
            <input
              type="tel"
              placeholder="010-1234-5678"
              className="input_field"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              required
            />
          </label>
        </fieldset>

        <button type="submit" className="login_submit_button">
          인증하기
        </button>
      </form>

      <div className="auth_links">
        <button type="button" className="text_button" onClick={() => onChangeView('LOGIN')}>
          로그인으로 돌아가기
        </button>
      </div>
    </section>
  )
}

export default FindPassword
