import { axiosInstance } from '@/api/axios'

import type {
  ApiResponse,
  CreateLectureRequest,
  CreateLectureResponse,
  LectureItem,
  GetLectureListResponse,
  UpdateLectureRequest,
  UpdateLectureResponse,
  DeleteLectureResponse,
} from './lecture.types'

export async function createLecture(requestBody: CreateLectureRequest) {
  const response = await axiosInstance.post<ApiResponse<CreateLectureResponse>>(
    '/api/admin/classes',
    requestBody,
  )

  return response.data
}

export async function getLectureList(params: { keyword?: string; page: number; size: number }) {
  const response = await axiosInstance.get<ApiResponse<GetLectureListResponse>>(
    '/api/admin/classes',
    { params },
  )

  return response.data.data
}

export async function getLectureDetail(classId: number) {
  const response = await axiosInstance.get<ApiResponse<LectureItem>>(
    `/api/admin/classes/${classId}`,
  )

  return response.data.data
}

export async function updateLecture(classId: number, requestBody: UpdateLectureRequest) {
  const response = await axiosInstance.put<ApiResponse<UpdateLectureResponse>>(
    `/api/admin/classes/${classId}`,
    requestBody,
  )

  return response.data
}

export async function deleteLecture(classId: number) {
  const response = await axiosInstance.delete<ApiResponse<DeleteLectureResponse>>(
    `/api/admin/classes/${classId}`,
  )
  return response.data
}
