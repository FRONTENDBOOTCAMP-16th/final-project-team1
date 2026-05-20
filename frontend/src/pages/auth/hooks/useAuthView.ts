import { useSearchParams } from 'react-router-dom'

export type AuthViewType = 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD'

const tabToView: Record<string, AuthViewType> = {
  login: 'LOGIN',
  admin: 'ADMIN_LOGIN',
  'find-password': 'FIND_PASSWORD',
  'reset-password': 'RESET_PASSWORD',
}

const viewToTab: Record<AuthViewType, string> = {
  LOGIN: 'login',
  ADMIN_LOGIN: 'admin',
  FIND_PASSWORD: 'find-password',
  RESET_PASSWORD: 'reset-password',
}

export function useAuthView() {
  const [searchParams, setSearchParams] = useSearchParams()

  const tab = searchParams.get('tab') ?? 'login'
  const view: AuthViewType = tabToView[tab] ?? 'LOGIN'

  const setView = (next: AuthViewType) => {
    setSearchParams({ tab: viewToTab[next] })
  }

  return { view, setView }
}
