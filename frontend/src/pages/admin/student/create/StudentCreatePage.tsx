import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StudentCreatePage.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import { getLectureList } from '@/pages/admin/lecture/api/lecture.api'
import { addStudent } from '../api/student.api'

type StudentStatusCode = 'S001' | 'S002' | 'S003'

interface StudentCreateForm {
  name: string
  password: string
  phoneNumber: string
  email: string
  classId: string
  studentStatusCode: StudentStatusCode
}

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function StudentCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<StudentCreateForm>({
    name: '',
    password: '1234',
    phoneNumber: '',
    email: '',
    classId: '',
    studentStatusCode: 'S003',
  })

  const [emailError, setEmailError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [courses, setCourses] = useState<{ classId: number; className: string }[]>([])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const result = await getLectureList({ page: 1, size: 1000 })
        setCourses(result.items.map(({ classId, className }) => ({ classId, className })))
      } catch (error) {
        console.error('강의 목록 조회 실패:', error)
      }
    }
    fetchCourses()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phoneNumber: formatPhoneNumber(e.target.value) }))
  }

  const handleEmailBlur = () => {
    if (form.email && !isValidEmail(form.email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.email && !isValidEmail(form.email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
      return
    }

    try {
      await addStudent({
        name: form.name,
        password: form.password,
        phoneNumber: form.phoneNumber,
        email: form.email,
        classId: Number(form.classId),
        studentStatusCode: form.studentStatusCode,
      })
      setShowModal(true)
    } catch (error) {
      console.error('학생 등록 실패:', error)
    }
  }

  const goToList = () => navigate('/admin/student')

  return (
    <AdminLayout>
      <Modal
        isOpen={showModal}
        title="등록 완료"
        onClose={goToList}
        onConfirm={goToList}
        buttonType="two"
      >
        등록이 완료되었습니다.
      </Modal>

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
              <label>학번</label>
              <input
                value=""
                readOnly
                disabled
                placeholder="자동 생성됩니다"
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                휴대폰 번호 <span>*</span>
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handlePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
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
              onChange={(e) => {
                handleChange(e)
                if (emailError) setEmailError('')
              }}
              onBlur={handleEmailBlur}
              placeholder="student@likelion.net"
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                수강목록 <span>*</span>
              </label>
              <select name="classId" value={form.classId} onChange={handleChange}>
                <option value="">수강 과정을 선택하세요</option>
                {courses.map((course) => (
                  <option key={course.classId} value={course.classId}>
                    {course.className}
                  </option>
                ))}
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
            <button type="button" className={styles.cancelButton} onClick={goToList}>
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
