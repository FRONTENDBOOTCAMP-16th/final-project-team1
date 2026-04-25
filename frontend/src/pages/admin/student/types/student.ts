export type StudentStatus = '중도포기' | '수료완료' | '수료중'

export interface Student {
  id: number
  name: string
  studentNo: string
  courseName: string
  phone: string
  status: StudentStatus
}
