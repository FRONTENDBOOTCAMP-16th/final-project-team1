import { useState } from 'react'
import { post_login_api } from '../api/loginApi'

export const useLogin = () => {
  const [is_loading, set_is_loading] = useState<boolean>(false)
  const [error_message, set_error_message] = useState<string | null>(null)

  const login_user = async (studentId: string, password: string) => {
    set_is_loading(true)
    set_error_message(null)

    try {
      const data = await post_login_api(studentId, password)

      localStorage.setItem('access_token', data.token)
      localStorage.setItem('student_id', data.studentId)
      localStorage.setItem('user_name', data.name)
      localStorage.setItem('user_role', data.role)

      return {
        success: true,
        password_yn: data.passwordYn,
        role: data.role,
      }
    } catch (error) {
      console.error('로그인 에러:', error)

      if (error instanceof Error) {
        set_error_message(error.message)
      } else {
        set_error_message('서버와 연결할 수 없습니다.')
      }

      return { success: false }
    } finally {
      set_is_loading(false)
    }
  }

  return { login_user, is_loading, error_message }
}
