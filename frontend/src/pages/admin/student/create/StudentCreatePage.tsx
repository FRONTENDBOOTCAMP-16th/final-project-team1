import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

import styles from './StudentCreatePage.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import { getLectureList } from '@/pages/admin/lecture/api/lecture.api'
import { addStudent } from '../api/student.api'

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

const studentSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  phoneNumber: z
    .string()
    .min(1, '휴대폰 번호를 입력하세요')
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, { message: '올바른 형식으로 입력하세요 (예: 010-1234-5678)' }),
  email: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  classId: z.string().min(1, '수강 과정을 선택하세요'),
  studentStatusCode: z.enum(['S001', 'S002', 'S003']),
})

type StudentCreateForm = z.infer<typeof studentSchema>

export default function StudentCreatePage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [courses, setCourses] = useState<{ classId: number; className: string }[]>([])

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<StudentCreateForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      classId: '',
      studentStatusCode: 'S003',
    },
  })

  useEffect(() => {
    getLectureList({ page: 1, size: 1000 })
      .then((result) => {
        setCourses(
          result.items
            .filter((item) => !item.isCompleted)
            .map(({ classId, className }) => ({ classId, className })),
        )
      })
      .catch((error) => console.error('강의 목록 조회 실패:', error))
  }, [])

  const onSubmit = async (data: StudentCreateForm) => {
    try {
      await addStudent({
        name: data.name,
        password: '1234',
        phoneNumber: data.phoneNumber,
        email: data.email,
        classId: Number(data.classId),
        studentStatusCode: data.studentStatusCode,
      })
      setShowModal(true)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message ?? ''
        if (message.includes('핸드폰')) {
          setError('phoneNumber', { message })
          return
        }
      }
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

      <form className={styles.page} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formBox}>
          <div className={styles.formGroup}>
            <label>
              이름 <span>*</span>
            </label>
            <input {...register('name')} placeholder="학생 이름을 입력하세요" />
            {errors.name && <p className={styles.errorText}>{errors.name.message}</p>}
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
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                    placeholder="010-0000-0000"
                    maxLength={13}
                  />
                )}
              />
              {errors.phoneNumber && (
                <p className={styles.errorText}>{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              메일 <span>*</span>
            </label>
            <input {...register('email')} placeholder="student@likelion.net" />
            {errors.email && <p className={styles.errorText}>{errors.email.message}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>
                수강목록 <span>*</span>
              </label>
              <select {...register('classId')}>
                <option value="">수강 과정을 선택하세요</option>
                {courses.map((course) => (
                  <option key={course.classId} value={course.classId}>
                    {course.className}
                  </option>
                ))}
              </select>
              {errors.classId && <p className={styles.errorText}>{errors.classId.message}</p>}
            </div>

            <div className={styles.formGroup}>
              <label>
                상태 <span>*</span>
              </label>
              <div className={styles.checkboxGroup}>
                <label>
                  <input type="radio" value="S003" {...register('studentStatusCode')} />
                  재학
                </label>
                <label>
                  <input type="radio" value="S002" {...register('studentStatusCode')} />
                  수료
                </label>
                <label>
                  <input type="radio" value="S001" {...register('studentStatusCode')} />
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
