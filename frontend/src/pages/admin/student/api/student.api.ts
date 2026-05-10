import { axiosInstance } from '@/api/axios'
import type {
  GetStudentsParams,
  GetStudentsResponse,
  AddStudentRequest,
  AddStudentResponse,
  StudentDetailResponse,
  UpdateStudentRequest,
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

export async function getStudentDetail(studentId: string) {
  const response = await axiosInstance.get<StudentDetailResponse>(
    `/api/admin/students/${studentId}`,
  )
  return response.data.data
}

export async function updateStudent(studentId: string, body: UpdateStudentRequest) {
  const response = await axiosInstance.put(`/api/admin/students/${studentId}`, body)
  return response.data
}

export async function deleteStudent(studentId: string) {
  const response = await axiosInstance.delete(`/api/admin/students/${studentId}`)
  return response.data
}
