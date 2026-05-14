import { useState } from 'react'
import { postLoginApi } from '../api/loginApi'
import { useAuthStore } from '@/store'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const setLogin = useAuthStore((state) => state.setLogin)

  const loginUser = async (studentId: string, password: string) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const data = await postLoginApi(studentId, password)
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('userName', data.name)
      // 변경 전: userId/role을 localStorage에 직접 저장했으나 보안상 제거
      // localStorage.setItem('studentId', data.studentId)
      // localStorage.setItem('role', data.role)
      // → 새로고침 시 store/index.ts에서 accessToken을 디코딩해 복원

      setLogin({
        userId: data.studentId,
        name: data.name,
        role: data.role,
      })

      return {
        success: true,
        passwordYn: data.isPasswordChangeRequired,
        role: data.role,
      }
    } catch (error) {
      console.error('로그인 에러:', error)

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

  return { loginUser, isLoading, errorMessage }
}
