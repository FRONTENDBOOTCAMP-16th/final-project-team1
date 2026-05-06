import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './LectureCreatePage.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Modal from '@/components/common/modal/Modal'
import { createLecture } from '../api/lecture.api'

interface LectureCreateForm {
  className: string
  startDate: string
  endDate: string
}

export default function LectureCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] = useState<LectureCreateForm>({
    className: '',
    startDate: '',
    endDate: '',
  })

  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [buttonType, setButtonType] = useState<'one' | 'two'>('one')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const openModal = (message: string, success = false, type: 'one' | 'two' = 'one') => {
    setModalMessage(message)
    setIsSuccess(success)
    setButtonType(type)
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
      const result = await createLecture({
        className: form.className,
        startDate: form.startDate,
        endDate: form.endDate,
        isCompleted: false,
      })

      openModal(result.message || '강의 등록 성공', true, 'two')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || '강의 등록 중 오류가 발생했습니다.'
        openModal(message)
      } else {
        openModal('강의 등록 중 알 수 없는 오류가 발생했습니다.')
      }
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

        <div className={styles.buttonArea}>
          <button type="submit" className={styles.submitButton}>
            강의 등록하기
          </button>
        </div>
      </form>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleOk}
        buttonType={buttonType}
      >
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
