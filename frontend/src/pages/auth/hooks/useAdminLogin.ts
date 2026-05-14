import { useState } from 'react'
import { postAdminLoginApi } from '../api/adminLoginApi'
import { useAuthStore } from '@/store'

export const useAdminLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const setLogin = useAuthStore((state) => state.setLogin)

  const loginAdmin = async (adminId: string, password: string) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = await postAdminLoginApi(adminId, password)

      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('adminId', data.adminId)
      localStorage.setItem('userName', data.name)
      localStorage.setItem('role', data.role)

      setLogin({
        userId: data.adminId,
        name: data.name,
        role: data.role as 'ADMIN', // 관리자 로그인이므로 role은 'ADMIN'으로 고정
      })

      return {
        success: true,
        role: data.role,
      }
    } catch (error) {
      console.error('관리자 로그인 에러:', error)

      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('서버와 연결할 수 없습니다.')
      }

      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return { loginAdmin, isLoading, errorMessage }
}
