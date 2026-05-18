import { useState, useEffect } from 'react'
import {
  fetchStudentProfile,
  verifyCurrentPassword,
  updatePassword,
  type StudentProfile,
} from '../api/settingsApi'
import { useAuthStore } from '@/store'

export const useSettings = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)

        // 변경 전: localStorage.getItem('studentId')
        const savedStudentId = useAuthStore.getState().user?.userId

        if (!savedStudentId) {
          throw new Error('로그인 정보가 없습니다. 다시 로그인해 주세요.')
        }

        const data = await fetchStudentProfile(savedStudentId)
        setProfile(data)
      } catch (error) {
        console.error('학생 상세 조회 실패', error)
        setError(error instanceof Error ? error.message : '오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await verifyCurrentPassword(currentPassword)

      await updatePassword(newPassword)

      return { success: true }
    } catch (error) {
      console.error('비밀번호 변경 실패', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.',
      }
    }
  }

  return { profile, isLoading, error, changePassword }
}
