import { useState } from 'react'

export type AuthViewType = 'LOGIN' | 'ADMIN_LOGIN' | 'FIND_PASSWORD' | 'RESET_PASSWORD'

export function useAuthView() {
  const [view, set_view] = useState<AuthViewType>('LOGIN')

  return { view, set_view }
}
