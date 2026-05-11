import { useAuthStore } from '@/store'

export interface StudentProfile {
  name: string
  phoneNumber: string
  studentId: string
  className: string
  email: string
}

interface SettingsResponse {
  success: boolean
  message: string
  data: StudentProfile
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const fetchStudentProfile = async (studentId: string): Promise<StudentProfile> => {
  const token = localStorage.getItem('accessToken')

  const params = new URLSearchParams({ studentId })

  try {
    const response = await fetch(`${BASE_URL}/api/student/settings?${params.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const result: SettingsResponse = await response.json()
    if (!result.success) {
      throw new Error(result.message || '정보 조회 실패')
    }
    return result.data
  } catch (error) {
    console.error('학생 상세 조회 실패', error)
    throw error
  }
}

export const verifyCurrentPassword = async (password: string): Promise<boolean> => {
  const userId = useAuthStore.getState().user?.userId

  if (!userId) {
    throw new Error('사용자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.')
  }

  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: userId, password }),
  })

  const result = await response.json()
  if (!result.success) {
    throw new Error('현재 비밀번호가 일치하지 않습니다.')
  }
  return true
}

export const updatePassword = async (newPassword: string): Promise<boolean> => {
  const token = localStorage.getItem('accessToken')

  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      newPassword,
    }),
  })

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.message || '비밀번호 재설정에 실패했습니다.')
  }

  return true
}
