import { axiosInstance } from '@/api/axios'

export type AttendanceApiItem = {
  attendanceId: number
  attendanceDate: string
  studentId: string
  studentName: string
  checkInTime: string
  checkOutTime: string
  attendanceStatusName: string
}

type GetAttendanceListParams = {
  attendanceDate?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export async function getAttendanceList({
  attendanceDate,
  startDate,
  endDate,
  page = 1,
  size = 12,
}: GetAttendanceListParams = {}) {
  const res = await axiosInstance.get('/api/admin/attendances', {
    params: {
      page,
      size,
      attendanceDate,
      startDate,
      endDate,
    },
  })

  return res.data.data.items
}
