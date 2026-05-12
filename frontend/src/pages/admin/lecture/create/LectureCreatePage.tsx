import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

import styles from './LectureCreatePage.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import { createLecture } from '../api/lecture.api'

const lectureSchema = z
  .object({
    className: z.string().min(1, '강의 이름을 입력해 주세요'),
    startDate: z.string().min(1, '시작일자를 선택해 주세요'),
    endDate: z.string().min(1, '종료일자를 선택해 주세요'),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: '시작일자는 종료일자보다 늦을 수 없습니다',
    path: ['endDate'],
  })

type LectureCreateForm = z.infer<typeof lectureSchema>

export default function LectureCreatePage() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [buttonType, setButtonType] = useState<'one' | 'two'>('one')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LectureCreateForm>({
    resolver: zodResolver(lectureSchema),
    defaultValues: { className: '', startDate: '', endDate: '' },
  })

  const openModal = (message: string, success = false, type: 'one' | 'two' = 'one') => {
    setModalMessage(message)
    setIsSuccess(success)
    setButtonType(type)
    setOpen(true)
  }

  const onSubmit = async (data: LectureCreateForm) => {
    try {
      const result = await createLecture({
        className: data.className,
        startDate: data.startDate,
        endDate: data.endDate,
        isCompleted: false,
      })
      openModal(result.message || '강의 등록 성공', true, 'two')
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || '강의 등록 중 오류가 발생했습니다.'
        : '강의 등록 중 알 수 없는 오류가 발생했습니다.'
      openModal(message)
    }
  }

  const handleOk = () => {
    setOpen(false)
    if (isSuccess) navigate('/admin/lecture')
  }

  return (
    <AdminLayout>
      <form className={styles.page} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>강의 이름</label>
          <input {...register('className')} placeholder="강의명을 입력하세요" />
          {errors.className && <p className={styles.errorText}>{errors.className.message}</p>}
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>시작일자</label>
            <input type="date" {...register('startDate')} />
            {errors.startDate && <p className={styles.errorText}>{errors.startDate.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>종료일자</label>
            <input type="date" {...register('endDate')} />
            {errors.endDate && <p className={styles.errorText}>{errors.endDate.message}</p>}
          </div>
        </div>

        <div className={styles.buttonArea}>
          <button type="submit" className={styles.submitButton}>
            강의 등록하기
          </button>
        </div>
      </form>

      <Modal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleOk} buttonType={buttonType}>
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
