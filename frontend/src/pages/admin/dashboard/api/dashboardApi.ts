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
  return response.data.data
}

export interface NoticeItem {
  displayNo: number
  noticeId: number
  title: string
  createdDate: string
  isOpen: boolean
  openStatusName: string
}

export async function getNoticeList() {
  const response = await api.get('/api/admin/notices')

  return response.data.data.items
}

export interface LeaveRequestItem {
  leaveRequestId: number
  studentId: string
  studentName: string
  studentInitial: string
  leaveTypeCode: string
  leaveTypeName: string
  startDate: string
  endDate: string
  periodText: string
  approvalStatusCode: string
  approvalStatusName: string
}

export interface LeaveRequestData {
  items: LeaveRequestItem[]
  page: number
  size: number
  totalCount: number
}

export async function getLeaveRequestList(page = 1, size = 10) {
  const response = await api.get<{
    success: boolean
    message: string
    data: LeaveRequestData
  }>('/api/admin/leave-requests', {
    params: {
      page,
      size,
    },
  })

  return response.data.data
}

export async function updateLeaveRequestStatus(
  leaveRequestId: number,
  approvalStatusCode: 'V002' | 'V003',
) {
  const response = await api.patch(`/api/admin/leave-requests/${leaveRequestId}/status`, {
    approvalStatusCode,
  })

  return response.data
}
