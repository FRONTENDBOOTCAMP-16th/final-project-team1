import { api } from '@/api/axios'

export interface AttendanceSummaryData {
  attendanceRate: number
  presentCount: number
  lateCount: number
  absentCount: number
}

export async function getAttendanceSummary() {
  const response = await api.get('/api/admin/dashboard')
  return response.data.data
}
