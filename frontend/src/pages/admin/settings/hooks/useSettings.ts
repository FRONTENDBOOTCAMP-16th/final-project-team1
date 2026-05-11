import { resetAdminPassword, verifyAdminPassword } from '../api/settingsApi'

export const useAdminSettings = () => {
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const adminId = localStorage.getItem('adminId') || 'admin'

      await verifyAdminPassword(adminId, currentPassword)

      await resetAdminPassword(adminId, newPassword)

      return { success: true }
    } catch (error) {
      console.error('관리자 비밀번호 변경 실패', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.',
      }
    }
  }

  return { changePassword }
}
