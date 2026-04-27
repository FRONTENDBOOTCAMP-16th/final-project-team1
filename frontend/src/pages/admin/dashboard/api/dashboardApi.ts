import { axiosInstance } from '../../../../api/axiosInstance'

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
  const response = await axiosInstance.get<{
    success: boolean
    message: string
    data: AdminDashboardData
  }>('/api/admin/dashboard')

  return response.data.data
}
