import { api } from '@/api/axios'

export type AttendanceApiItem = {
  attendanceId: number
  studentId: string
  studentName: string
  checkInTime: string
  checkOutTime: string
  attendanceStatusName: string
}

export async function getAttendanceList() {
  const res = await api.get('/api/admin/attendances', {
    params: {
      page: 1,
      size: 12,
    },
  })

  return res.data.data.items
}
