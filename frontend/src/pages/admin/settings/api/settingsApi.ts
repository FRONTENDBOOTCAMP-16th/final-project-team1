import { useAuthStore } from '@/store'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const verifyAdminPassword = async (password: string) => {
  const userId = useAuthStore.getState().user?.userId

  if (!userId) {
    throw new Error('관리자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.')
  }

  const response = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ adminId: userId, password }),
  })

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || '현재 비밀번호가 일치하지 않습니다.')
  }
  return true
}

export const resetAdminPassword = async (newPassword: string) => {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(`${BASE_URL}/api/admin/reset-password`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword }),
  })

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || '비밀번호 재설정에 실패했습니다.')
  }
  return true
}
