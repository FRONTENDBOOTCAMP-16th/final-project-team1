export type UserRole = 'student' | 'admin'

export interface SidebarMenuItem {
  label: string
  path: string
}

export const sidebarMenuByRole: Record<UserRole, SidebarMenuItem[]> = {
  student: [
    { label: '대시보드', path: '' },
    { label: '휴가신청', path: '' },
    { label: '공지사항', path: '' },
    { label: '환경설정', path: '' },
  ],
  admin: [
    { label: '대시보드', path: '' },
    { label: '학생관리', path: '' },
    { label: '출석관리', path: '' },
    { label: '강의관리', path: '' },
    { label: '휴가관리', path: '' },
    { label: '공지사항 관리', path: '' },
    { label: '환경설정', path: '' },
  ],
}
