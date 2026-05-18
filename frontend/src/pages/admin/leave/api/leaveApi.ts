import { axiosInstance } from '@/api/axios'

export async function getRecentLeaveRequests() {
  const res = await axiosInstance.get('/api/admin/leave-requests', {
    params: {
      page: 1,
      size: 100,
    },
  })

  return res.data.data.items
}

export async function updateLeaveRequestStatus(leaveRequestId: number, statusCode: string) {
  const res = await axiosInstance.patch(`/api/admin/leave-requests/${leaveRequestId}/status`, {
    approvalStatusCode: statusCode,
  })

  return res.data
}
