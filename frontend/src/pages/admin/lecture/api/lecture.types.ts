export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface CreateLectureRequest {
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
}

export interface CreateLectureResponse {
  classId: number
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
  completedStatusName: string
}

export interface LectureItem {
  classId: number
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
  completedStatusName: string
}

export interface GetLectureListResponse {
  items: LectureItem[]
  totalCount: number
  page: number
  size: number
  totalPages: number
}

export interface UpdateLectureRequest {
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
}

export interface UpdateLectureResponse {
  classId: number
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
  completedStatusName: string
}

export interface DeleteLectureResponse {
  classId: number
}
