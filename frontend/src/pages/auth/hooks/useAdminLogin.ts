import { useState } from 'react'
import { post_admin_login_api } from '../api/adminLoginApi'

export const useAdminLogin = () => {
  const [is_loading, set_is_loading] = useState<boolean>(false)
  const [error_message, set_error_message] = useState<string | null>(null)

  const login_admin = async (adminId: string, password: string) => {
    set_is_loading(true)
    set_error_message(null)

    try {
      const data = await post_admin_login_api(adminId, password)

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('adminId', data.adminId)
      localStorage.setItem('userName', data.name)
      localStorage.setItem('role', data.role)

      return {
        success: true,
        role: data.role,
      }
    } catch (error) {
      console.error('관리자 로그인 에러:', error)

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

  return { login_admin, is_loading, error_message }
}
