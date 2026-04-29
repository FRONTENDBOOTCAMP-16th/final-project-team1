export interface AdminStudent {
  studentId: string
  name: string
  className: string
  phoneNumber: string
  statusCode: string
  statusName: string
}

export interface GetStudentsParams {
  classId?: number
  keyword?: string
  statusCode?: string
  page: number
  size: number
}

export interface GetStudentsResponse {
  success: boolean
  message: string
  data: {
    items: AdminStudent[]
    page: number
    size: number
    totalCount: number
  }
}
