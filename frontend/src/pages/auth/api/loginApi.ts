import axios from 'axios'

export interface LoginResponseData {
  studentId: string
  name: string
  role: string
  passwordYn: string
  token: string
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const post_login_api = async (studentId: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      studentId,
      password,
    })

    return response.data.data as LoginResponseData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || '로그인 실패')
    }
    throw new Error('서버와 연결할 수 없습니다.')
  }
}
