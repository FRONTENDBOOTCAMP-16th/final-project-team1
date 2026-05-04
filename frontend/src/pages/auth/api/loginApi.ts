export interface LoginResponseData {
  studentId: string
  name: string
  role: string
  passwordYn: string
  token: string
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const post_login_api = async (studentId: string, password: string) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      studentId: studentId,
      password: password,
    }),
  })

  const result = await response.json()

  if (!response.ok) {
    // 통신은 성공했으나, 백엔드에서 에러(비밀번호 틀림 등)를 보낸 경우
    throw new Error(result.message || '로그인 실패')
  }

  return result.data as LoginResponseData
}
