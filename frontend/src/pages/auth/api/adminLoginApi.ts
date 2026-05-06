import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const post_admin_login_api = async (adminId: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/login`, {
      adminId,
      password,
    })

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || '로그인에 실패했습니다.')
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || '관리자 아이디 또는 비밀번호를 다시 확인해 주세요.',
      )
    }
    throw error
  }
}
