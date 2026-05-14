import { isAxiosError } from 'axios'
import { axiosInstance } from '@/api/axios'

export const postAdminLoginApi = async (adminId: string, password: string) => {
  try {
    const response = await axiosInstance.post('/api/admin/login', {
      adminId,
      password,
    })

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '로그인에 실패했습니다.')
    }
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || '관리자 아이디 또는 비밀번호를 다시 확인해 주세요.',
      )
    }
    throw error
  }
}
