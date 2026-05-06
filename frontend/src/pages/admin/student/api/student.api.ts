import { axiosInstance } from '@/api/axios'
import type { GetStudentsParams, GetStudentsResponse } from './student.types'

export async function getAdminStudents(params: GetStudentsParams) {
  const response = await axiosInstance.get<GetStudentsResponse>('/api/admin/students', {
    params,
  })

  return response.data.data
}
