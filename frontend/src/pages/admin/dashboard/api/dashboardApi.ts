import { api } from '@/api/axios'

export interface AdminDashboardData {
  studentCount: number
  classCount: number
  attendanceRate: number
  presentCount: number
  lateCount: number
  absentCount: number
  pendingLeaveCount: number
}

export async function getAdminDashboardSummary() {
  const response = await api.get('/api/admin/dashboard')

  console.log('전체 응답:', response)
  console.log('response.data:', response.data)

  return response.data.data
}

export interface AttendanceItem {
  classId: number
  className: string
  totalCount: number
  presentCount: number
  lateCount: number
  absentCount: number
}

export async function getAttendanceStatusByClass() {
  const response = await api.get('/api/admin/classes/attendance')

  console.log('강의별 출결 응답:', response)
  console.log('response.data:', response.data)

  return response.data.data
}
