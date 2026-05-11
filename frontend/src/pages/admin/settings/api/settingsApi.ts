export const verifyAdminPassword = async (adminId: string, password: string) => {
  const response = await fetch('https://final-project-team1.onrender.com/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminId, password }),
  })

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || '현재 비밀번호가 일치하지 않습니다.')
  }
  return true
}

export const resetAdminPassword = async (adminId: string, newPassword: string) => {
  const token = localStorage.getItem('accessToken')
  const response = await fetch(
    'https://final-project-team1.onrender.com/api/admin/reset-password',
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adminId, newPassword }),
    },
  )

  const result = await response.json()
  if (!result.success) {
    throw new Error(result.message || '비밀번호 재설정에 실패했습니다.')
  }
  return true
}
