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
