import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  exp: number
  role: string
}

interface ProtectedRouteProps {
  allowedRole: 'STUDENT' | 'ADMIN'
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken')

  function clearAuth() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('role')
  }

  // 토큰 없음
  if (!token) {
    return <Navigate to="/" replace />
  }

  let decoded: JwtPayload | null = null

  try {
    decoded = jwtDecode<JwtPayload>(token)
  } catch {
    clearAuth()

    return <Navigate to="/" replace />
  }

  // decode 실패 방어
  if (!decoded) {
    clearAuth()

    return <Navigate to="/" replace />
  }

  // 현재 시간
  const now = Math.floor(new Date().getTime() / 1000)

  // 토큰 만료
  if (decoded.exp < now) {
    clearAuth()

    return <Navigate to="/" replace />
  }

  // 권한 불일치
  if (decoded.role !== allowedRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
