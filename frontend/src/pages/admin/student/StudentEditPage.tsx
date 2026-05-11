import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './styles/studentEdit.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import { getLectureList } from '@/pages/admin/lecture/api/lecture.api'
import { getStudentDetail, updateStudent, deleteStudent } from './api/student.api'

type StudentStatusCode = 'S001' | 'S002' | 'S003'

interface EditForm {
  name: string
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

export default function StudentEditPage() {
  const { id: studentId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<EditForm>({
    name: '',
    phoneNumber: '',
    email: '',
    classId: '',
    studentStatusCode: 'S003',
  })

  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courses, setCourses] = useState<{ classId: number; className: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [detail, lectureResult] = await Promise.all([
          getStudentDetail(studentId!),
          getLectureList({ page: 1, size: 1000 }),
        ])
        setForm({
          name: detail.name,
          phoneNumber: detail.phoneNumber,
          email: detail.email,
          classId: String(detail.classId),
          studentStatusCode: detail.statusCode as StudentStatusCode,
        })
        setCourses(lectureResult.items.map(({ classId, className }) => ({ classId, className })))
      } catch (error) {
        console.error('학생 정보 조회 실패:', error)
      }
    }
    fetchData()
  }, [studentId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (phoneError) setPhoneError('')
    setForm((prev) => ({ ...prev, phoneNumber: formatPhoneNumber(e.target.value) }))
  }

  const handleEmailBlur = () => {
    if (form.email && !isValidEmail(form.email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
    } else {
      setEmailError('')
    }
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.email && !isValidEmail(form.email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.')
      return
    }

    try {
      await updateStudent(studentId!, {
        name: form.name,
        phoneNumber: form.phoneNumber,
        email: form.email,
        classId: Number(form.classId),
        studentStatusCode: form.studentStatusCode,
      })
      setShowUpdateModal(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? ''
        if (message.includes('핸드폰')) {
          setPhoneError(message)
          return
        }
      }
      console.error('학생 수정 실패:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteStudent(studentId!)
      navigate('/admin/student')
    } catch (error) {
      console.error('학생 삭제 실패:', error)
    }
  }

  const goToList = () => navigate('/admin/student')

  return (
    <AdminLayout>
      <Modal
        isOpen={showUpdateModal}
        title="수정 완료"
        onClose={goToList}
        onConfirm={goToList}
        buttonType="two"
      >
        수정이 완료되었습니다.
      </Modal>

      <Modal
        isOpen={showDeleteConfirm}
        title="학생 삭제"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        buttonType="two"
      >
        정말 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.
      </Modal>

      <form className={styles.page} onSubmit={handleUpdate}>
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
                value={studentId ?? ''}
                readOnly
                disabled
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
              {phoneError && <p className={styles.errorText}>{phoneError}</p>}
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
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => setShowDeleteConfirm(true)}
            >
              삭제하기
            </button>

            <div className={styles.rightButtons}>
              <button type="button" className={styles.cancelButton} onClick={goToList}>
                목록으로 돌아가기
              </button>
              <button type="submit" className={styles.submitButton}>
                수정하기
              </button>
            </div>
          </div>
        </div>

        <p className={styles.notice}>
          <span>*</span> 표시된 항목은 필수 입력 항목입니다.
        </p>
      </form>
    </AdminLayout>
  )
}
