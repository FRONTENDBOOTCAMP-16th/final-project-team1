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
