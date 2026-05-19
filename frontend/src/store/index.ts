import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub: string
  role: 'STUDENT' | 'ADMIN'
  iat: number
  exp: number
}

interface UserData {
  userId?: string
  name: string
  role: 'STUDENT' | 'ADMIN'
}

interface AuthState {
  isLoggedIn: boolean
  user: UserData | null
  setLogin: (userData: UserData) => void
  setLogout: () => void
}

// 변경 전: localStorage에서 직접 userId/role을 읽어 초기화했으나
// 보안상 민감한 키(adminId, studentId, role)를 localStorage에 노출하지 않기 위해
// accessToken을 디코딩해 userId와 role을 복원하는 방식으로 변경
// 변경 전 코드:
// user: localStorage.getItem('accessToken')
//   ? {
//       userId: localStorage.getItem('adminId') || localStorage.getItem('studentId') || '',
//       name: localStorage.getItem('userName') || '이름 없음',
//       role: (localStorage.getItem('role') as 'STUDENT' | 'ADMIN') || 'STUDENT',
//     }
//   : null,
function getUserFromToken(): UserData | null {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return {
      userId: decoded.sub,
      name: localStorage.getItem('userName') || '이름 없음',
      role: decoded.role,
    }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),
  user: getUserFromToken(),
  setLogin: (userData) => set({ isLoggedIn: true, user: userData }),
  setLogout: () => {
    localStorage.clear()
    set({ isLoggedIn: false, user: null })
  },
}))
