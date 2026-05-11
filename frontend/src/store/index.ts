import { create } from 'zustand'

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

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),

  // 새로고침해도 이름이 날아가지 않도록 초기값을 로컬스토리지에서 가져옴
  user: localStorage.getItem('accessToken')
    ? {
        userId: localStorage.getItem('adminId') || localStorage.getItem('studentId') || '',
        name: localStorage.getItem('userName') || '이름 없음',
        role: (localStorage.getItem('role') as 'STUDENT' | 'ADMIN') || 'STUDENT',
      }
    : null,

  setLogin: (userData) => set({ isLoggedIn: true, user: userData }),
  setLogout: () => {
    localStorage.clear()
    set({ isLoggedIn: false, user: null })
  },
}))
