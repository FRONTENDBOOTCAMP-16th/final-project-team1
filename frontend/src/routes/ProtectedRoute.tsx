import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/store'

interface JwtPayload {
  exp: number
  role: string
}

interface ProtectedRouteProps {
  allowedRole: 'STUDENT' | 'ADMIN'
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken')
  // localStorage를 직접 조작하는 대신 Zustand setLogout으로 상태 + localStorage 일괄 초기화
  const setLogout = useAuthStore.getState().setLogout

  if (!token) {
    return <Navigate to="/" replace />
  }

  let decoded: JwtPayload | null = null

  try {
    decoded = jwtDecode<JwtPayload>(token)
  } catch {
    // 토큰 파싱 실패
    setLogout()
    return <Navigate to="/" replace />
  }

  if (!decoded) {
    setLogout()
    return <Navigate to="/" replace />
  }

  const now = Math.floor(new Date().getTime() / 1000)

  if (decoded.exp < now) {
    // 토큰 만료
    setLogout()
    return <Navigate to="/" replace />
  }

  if (decoded.role !== allowedRole) {
    // 권한 불일치
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
