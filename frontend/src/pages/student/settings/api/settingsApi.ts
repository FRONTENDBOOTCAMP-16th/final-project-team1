export interface StudentProfile {
  name: string
  phoneNumber: string
  studentId: string
  className: string
  email: string
}

interface SettingsResponse {
  success: boolean
  message: string
  data: StudentProfile
}
export const fetchStudentProfile = async (studentId: string): Promise<StudentProfile> => {
  const token = localStorage.getItem('accessToken')

  const params = new URLSearchParams({ studentId })

  try {
    const response = await fetch(
      `https://final-project-team1.onrender.com/api/student/settings?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    )

    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('서버로부터 올바른 응답(JSON)을 받지 못했습니다.')
    }

    const result: SettingsResponse = await response.json()

    if (!result.success) {
      throw new Error(result.message || '정보 조회 실패')
    }

    return result.data
  } catch (error) {
    console.error('학생 상세 조회 실패', error)
    throw error
  }
}
