import { useState } from 'react'
import styles from './StudentCreatePage.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'

type StudentStatusCode = 'S001' | 'S002' | 'S003'

interface StudentCreateForm {
  studentId: string
  name: string
  password: string
  phoneNumber: string
  email: string
  classId: string
  studentStatusCode: StudentStatusCode
}

export default function StudentCreatePage() {
  const [form, setForm] = useState<StudentCreateForm>({
    studentId: '',
    name: '',
    password: '1234',
    phoneNumber: '',
    email: '',
    classId: '',
    studentStatusCode: 'S003',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const requestBody = {
      studentId: form.studentId,
      name: form.name,
      password: form.password,
      phoneNumber: form.phoneNumber,
      email: form.email,
      classId: Number(form.classId),
      studentStatusCode: form.studentStatusCode,
    }

    console.log('학생 등록 요청 데이터:', requestBody)

    // TODO: API 연결
    // await addStudent(requestBody)
  }

  return (
    <AdminLayout>
      <form className={styles.page} onSubmit={handleSubmit}>
        <div className={styles.formBox}>
          <div className={styles.formGroup}>
            <label>
              이름 <span>*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="학생 이름을 입력하세요"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                학번 <span>*</span>
              </label>
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="20240001"
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                휴대폰 번호 <span>*</span>
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              메일 <span>*</span>
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@likelion.net"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                수강목록 <span>*</span>
              </label>
              <select name="classId" value={form.classId} onChange={handleChange}>
                <option value="">수강 과정을 선택하세요</option>
                <option value="1">웹 개발 기초 과정</option>
                <option value="2">프론트엔드 프레임워크</option>
                <option value="3">백엔드 개발 과정</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>
                상태 <span>*</span>
              </label>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="radio"
                    name="studentStatusCode"
                    value="S003"
                    checked={form.studentStatusCode === 'S003'}
                    onChange={handleChange}
                  />
                  재학
                </label>

                <label>
                  <input
                    type="radio"
                    name="studentStatusCode"
                    value="S002"
                    checked={form.studentStatusCode === 'S002'}
                    onChange={handleChange}
                  />
                  수료
                </label>

                <label>
                  <input
                    type="radio"
                    name="studentStatusCode"
                    value="S001"
                    checked={form.studentStatusCode === 'S001'}
                    onChange={handleChange}
                  />
                  중도포기
                </label>
              </div>
            </div>
          </div>

          <div className={styles.buttonArea}>
            <button type="button" className={styles.cancelButton}>
              목록으로 돌아가기
            </button>

            <button type="submit" className={styles.submitButton}>
              등록하기
            </button>
          </div>
        </div>

        <p className={styles.notice}>
          <span>*</span> 표시된 항목은 필수 입력 항목입니다. 학생 등록 후 시스템에서 자동으로 초기
          비밀번호가 발급됩니다.
        </p>
      </form>
    </AdminLayout>
  )
}
