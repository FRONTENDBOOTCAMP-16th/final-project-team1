import { api } from '@/api/axios'

export interface AttendanceCalendarItem {
  attendanceDate: string
  status: 'PRESENT' | 'ABSENT' | 'LATE'
}

export async function getStudentAttendanceCalendar(studentId: string) {
  const response = await api.get<{
    success: boolean
    message: string
    data: AttendanceCalendarItem[]
  }>('/api/student/dashboard', {
    params: { studentId },
  })

  return response.data.data
}

export interface StudentNoticeItem {
  noticeId: number
  title: string
  createdDate: string
  isOpen: boolean
  openStatusName: string
}

export async function getStudentNoticeList() {
  const response = await api.get<{
    success: boolean
    message: string
    data: {
      items: StudentNoticeItem[]
    }
  }>('/api/student/notices')

  return response.data.data.items
}

export async function getStudentDashboard() {
  const response = await api.get<{
    success: boolean
    message: string
    data: {
      studentInfo: {
        studentId: string
        name: string
        className: string
      }
      todayAttendance: {
        attendanceDate: string
        checkInTime: string | null
        checkOutTime: string | null
      } | null
    }
  }>('/api/student/dashboard')

  return response.data
}
