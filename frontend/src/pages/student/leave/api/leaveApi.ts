import { api, axiosInstance } from '@/api/axios'

// 타입 정의
export interface LeaveItem {
  leaveRequestId: number
  studentId: string
  leaveTypeCode: string
  leaveTypeName: string
  startDate: string
  endDate: string
  approvalStatusCode: string
  approvalStatusName: string
}

interface LeaveListResponse {
  success: boolean
  message: string
  data: {
    items: LeaveItem[]
    page: number
    size: number
    totalCount: number
  }
}

interface LeaveRequestBody {
  studentId: string
  leaveTypeCode: string
  startDate: string
  endDate: string
}

// 휴가 신청 목록 조회
export async function getLeaveList(params: {
  // studentId: string
  page: number
  size: number
  statusCode?: string
}) {
  // const response = await api.get<LeaveListResponse>('/api/student/leave-requests', { params })
  const response = await axiosInstance.get<LeaveListResponse>('/api/student/leave-requests', {
    params,
  })
  return response.data.data
}

// 휴가 신청 등록
export async function postLeaveRequest(body: LeaveRequestBody) {
  const response = await api.post('/api/student/leave-requests', body)
  return response.data
}
