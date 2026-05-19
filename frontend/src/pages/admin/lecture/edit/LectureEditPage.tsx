import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'

import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import styles from '../create/LectureCreatePage.module.css'
import { getLectureDetail, updateLecture, deleteLecture } from '../api/lecture.api'

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

type LectureEditForm = z.infer<typeof lectureSchema>

export default function LectureEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isCompleted, setIsCompleted] = useState(false)
  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<LectureEditForm>({
    resolver: zodResolver(lectureSchema),
    defaultValues: { className: '', startDate: '', endDate: '' },
  })

  useEffect(() => {
    if (!id) return
    getLectureDetail(Number(id))
      .then((result) => {
        reset({
          className: result.className,
          startDate: result.startDate,
          endDate: result.endDate,
        })
        setIsCompleted(result.isCompleted)
      })
      .catch(() => {
        setModalMessage('강의 정보를 불러오지 못했습니다.')
        setIsSuccess(false)
        setOpen(true)
      })
  }, [id, reset])

  const openModal = (message: string, success = false) => {
    setModalMessage(message)
    setIsSuccess(success)
    setOpen(true)
  }

  const onSubmit = async (data: LectureEditForm) => {
    if (!id) return
    try {
      const result = await updateLecture(Number(id), {
        className: data.className,
        startDate: data.startDate,
        endDate: data.endDate,
        isCompleted,
      })
      openModal(result.message || '강의 수정 성공', true)
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? '강의 수정 중 오류가 발생했습니다.'
        : '강의 수정 중 오류가 발생했습니다.'
      openModal(message)
    }
  }

  const handleOk = () => {
    setOpen(false)
    if (isSuccess) navigate('/admin/lecture')
  }

  const handleDelete = async () => {
    if (!id) return
    setShowDeleteConfirm(false)
    try {
      const result = await deleteLecture(Number(id))
      if (!result.success) {
        openModal(result.message)
        return
      }
      navigate('/admin/lecture')
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? '강의 삭제 중 오류가 발생했습니다.'
        : '강의 삭제 중 오류가 발생했습니다.'
      openModal(message)
    }
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
            <input type="date" {...register('endDate')} min={watch('startDate') || undefined} />
            {errors.endDate && <p className={styles.errorText}>{errors.endDate.message}</p>}
          </div>
        </div>

        <div className={styles.statusBox}>
          <div>
            <label className={styles.statusTitle}>수료 상태</label>
            <p className={styles.statusDesc}>
              {isCompleted ? '이미 수강완료 처리된 강의입니다.' : '현재 진행 중인 강의입니다.'}
            </p>
          </div>
          <div className={styles.statusAction}>
            <span className={isCompleted ? styles.completedBadge : styles.progressBadge}>
              {isCompleted ? '수강완료' : '진행중'}
            </span>
            {!isCompleted && (
              <button
                type="button"
                className={styles.completeButton}
                onClick={() => setIsCompleted(true)}
              >
                수강완료로 변경
              </button>
            )}
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
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => navigate('/admin/lecture')}
            >
              목록으로
            </button>
            <button type="submit" className={styles.submitButton}>
              수정하기
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={showDeleteConfirm}
        title="강의 삭제"
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        buttonType="two"
      >
        소속 학생이 있는 경우 삭제할 수 없습니다. 정말 삭제하시겠습니까?
      </Modal>

      <Modal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleOk} buttonType="two">
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
