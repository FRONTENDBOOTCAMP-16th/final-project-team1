import { isAxiosError } from 'axios'
import { axiosInstance } from '@/api/axios'

export interface LoginResponseData {
  studentId: string
  name: string
  role: 'STUDENT' | 'ADMIN'
  isPasswordChangeRequired: string
  accessToken: string
}

export const postLoginApi = async (studentId: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', {
      studentId,
      password,
    })

    return response.data.data as LoginResponseData
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '로그인 실패')
    }
    throw new Error('서버와 연결할 수 없습니다.')
  }
}
