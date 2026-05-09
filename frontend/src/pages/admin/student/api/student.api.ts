import { axiosInstance } from '@/api/axios'
import type {
  GetStudentsParams,
  GetStudentsResponse,
  AddStudentRequest,
  AddStudentResponse,
} from './student.types'

export async function getAdminStudents(params: GetStudentsParams) {
  const response = await axiosInstance.get<GetStudentsResponse>('/api/admin/students', {
    params,
  })

  return response.data.data
}

export async function addStudent(body: AddStudentRequest) {
  const response = await axiosInstance.post<AddStudentResponse>('/api/admin/addStudent', body)
  return response.data
}
