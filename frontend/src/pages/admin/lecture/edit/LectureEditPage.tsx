import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'

import styles from '../create/LectureCreatePage.module.css'
import { getLectureDetail, updateLecture } from '../api/lecture.api'

interface LectureEditForm {
  className: string
  startDate: string
  endDate: string
  isCompleted: boolean
}

export default function LectureEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState<LectureEditForm>({
    className: '',
    startDate: '',
    endDate: '',
    isCompleted: false,
  })

  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    async function fetchLectureDetail() {
      if (!id) return

      try {
        const result = await getLectureDetail(Number(id))

        setForm({
          className: result.className,
          startDate: result.startDate,
          endDate: result.endDate,
          isCompleted: result.isCompleted,
        })
      } catch (error) {
        setModalMessage('강의 정보를 불러오지 못했습니다.')
        setIsSuccess(false)
        setOpen(true)
      }
    }

    fetchLectureDetail()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const openModal = (message: string, success = false) => {
    setModalMessage(message)
    setIsSuccess(success)
    setOpen(true)
  }

  const handleCompleteClick = () => {
    setForm((prev) => ({
      ...prev,
      isCompleted: true,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!id) return

    if (!form.className.trim()) {
      openModal('강의 이름을 입력해 주세요.')
      return
    }

    if (!form.startDate) {
      openModal('시작일자를 선택해 주세요.')
      return
    }

    if (!form.endDate) {
      openModal('종료일자를 선택해 주세요.')
      return
    }

    if (form.startDate > form.endDate) {
      openModal('시작일자는 종료일자보다 늦을 수 없습니다.')
      return
    }

    try {
      const result = await updateLecture(Number(id), {
        className: form.className,
        startDate: form.startDate,
        endDate: form.endDate,
        isCompleted: form.isCompleted,
      })

      openModal(result.message || '강의 수정 성공', true)
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? '강의 수정 중 오류가 발생했습니다.'
        : '강의 수정 중 오류가 발생했습니다.'
      openModal(message)
    }
  }

  const handleOk = () => {
    setOpen(false)

    if (isSuccess) {
      navigate('/admin/lecture')
    }
  }

  return (
    <AdminLayout>
      <form className={styles.page} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>강의 이름</label>
          <input
            name="className"
            value={form.className}
            onChange={handleChange}
            placeholder="강의명을 입력하세요"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>시작일자</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label>종료일자</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.statusBox}>
          <div>
            <label className={styles.statusTitle}>수료 상태</label>
            <p className={styles.statusDesc}>
              {form.isCompleted ? '이미 수강완료 처리된 강의입니다.' : '현재 진행 중인 강의입니다.'}
            </p>
          </div>

          <div className={styles.statusAction}>
            <span className={form.isCompleted ? styles.completedBadge : styles.progressBadge}>
              {form.isCompleted ? '수강완료' : '진행중'}
            </span>

            {!form.isCompleted && (
              <button type="button" className={styles.completeButton} onClick={handleCompleteClick}>
                수강완료로 변경
              </button>
            )}
          </div>
        </div>

        <div className={styles.buttonArea}>
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
      </form>

      <Modal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleOk} buttonType="two">
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
