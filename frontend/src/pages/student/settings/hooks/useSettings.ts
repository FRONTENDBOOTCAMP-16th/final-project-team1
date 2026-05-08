import { useState, useEffect } from 'react'
import { fetchStudentProfile, type StudentProfile } from '../api/settingsApi'

export const useSettings = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)

        const savedStudentId = localStorage.getItem('studentId')

        if (!savedStudentId) {
          throw new Error('로그인 정보가 없습니다. 다시 로그인해 주세요.')
        }

        const data = await fetchStudentProfile(savedStudentId)
        setProfile(data)
      } catch (error) {
        console.error('학생 상세 조회 실패', error)
        setError(error instanceof Error ? error.message : '알 수 없는 에러')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  return { profile, isLoading, error }
}
