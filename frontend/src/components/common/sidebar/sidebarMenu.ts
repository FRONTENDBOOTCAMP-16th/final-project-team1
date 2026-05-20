import dashboardIcon from '../../../assets/dashboard.svg'
import noticeIcon from '../../../assets/alert.svg'
import settingIcon from '../../../assets/setting.svg'

import vacationIcon from '../../../assets/vacation.svg'

import studentIcon from '../../../assets/people.svg'
import attendanceIcon from '../../../assets/list.svg'
import lectureIcon from '../../../assets/book.svg'
import leaveIcon from '../../../assets/paper.svg'

export type UserRole = 'student' | 'admin'

export interface SidebarMenuItem {
  label: string
  path: string
  icon: string
}
export const sidebarMenuByRole: Record<UserRole, SidebarMenuItem[]> = {
  student: [
    { label: '대시보드', path: '/student/dashboard', icon: dashboardIcon },
    { label: '휴가신청', path: '/student/leave', icon: vacationIcon },
    { label: '공지사항', path: '/student/notice', icon: noticeIcon },
    { label: '환경설정', path: '/student/settings', icon: settingIcon },
  ],
  admin: [
    { label: '대시보드', path: '/admin/dashboard', icon: dashboardIcon },
    { label: '학생관리', path: '/admin/student', icon: studentIcon },
    { label: '출석관리', path: '/admin/attendance', icon: attendanceIcon },
    { label: '강의관리', path: '/admin/lecture', icon: lectureIcon },
    { label: '휴가관리', path: '/admin/leave', icon: leaveIcon },
    { label: '공지사항 관리', path: '/admin/notice', icon: noticeIcon },
    { label: '환경설정', path: '/admin/settings', icon: settingIcon },
  ],
}
