import { useAuthStore } from '@/store'
import { axiosInstance } from '@/api/axios'

interface BasicResponse {
  success: boolean
  message?: string
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// 로그인 엔드포인트 호출 — 잘못된 비밀번호 시 401 반환 가능하므로 fetch 유지 (axiosInstance 인터셉터의 강제 리다이렉트 방지)
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  const userId = useAuthStore.getState().user?.userId

  if (!userId) {
    throw new Error('관리자 정보를 찾을 수 없습니다. 다시 로그인해 주세요.')
  }

  const response = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminId: userId, password }),
  })

  const result: BasicResponse = await response.json()

  if (!result.success) {
    throw new Error(result.message || '현재 비밀번호가 일치하지 않습니다.')
  }

  return true
}

export const resetAdminPassword = async (newPassword: string): Promise<boolean> => {
  const response = await axiosInstance.patch<BasicResponse>('/api/admin/reset-password', {
    newPassword,
  })

  if (!response.data.success) {
    throw new Error(response.data.message || '비밀번호 재설정에 실패했습니다.')
  }

  return true
}
