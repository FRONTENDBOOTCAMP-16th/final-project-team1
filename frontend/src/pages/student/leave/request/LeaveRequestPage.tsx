import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postLeaveRequest } from '../api/leaveApi'
import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button'
import CustomComboBox from '@/components/common/comboBox/customComboBox'
import Modal from '@/components/common/modal/Modal'
import DatePicker from '@/components/common/datePicker/DatePicker'
import { Info, FileText } from 'lucide-react'
import S from './styles/leaveRequest.module.css'

const LEAVE_TYPE_LABELS = ['개인사유', '병결', '공결']
const LEAVE_TYPE_CODE_MAP: Record<string, string> = {
  개인사유: 'H001',
  병결: 'H002',
  공결: 'H003',
}

function countWeekdays(start: Date, end: Date): number {
  let count = 0
  const current = new Date(start)
  while (current <= end) {
    const day = current.getDay()
    if (day !== 0 && day !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function LeaveRequestPage() {
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [leaveType, setLeaveType] = useState<string>('')
  const [modalMessage, setModalMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const today = getToday()

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!startDate || !endDate || !leaveType) {
      setModalMessage('모든 항목을 입력해주세요.')
      setIsSuccess(false)
      setIsModalOpen(true)
      return
    }

    const weekdays = countWeekdays(startDate, endDate)
    if (weekdays > 3) {
      setModalMessage('3일 이상 연속으로 신청할 수 없습니다.')
      setIsSuccess(false)
      setIsModalOpen(true)
      return
    }

    try {
      setIsSubmitting(true)
      await postLeaveRequest({
        studentId: localStorage.getItem('studentId') || '',
        leaveTypeCode: LEAVE_TYPE_CODE_MAP[leaveType],
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      })
      setModalMessage('휴가 신청이 완료되었습니다.')
      setIsSuccess(true)
      setIsModalOpen(true)
    } catch (err) {
      console.error('휴가 신청 실패:', err)
      setModalMessage('휴가 신청에 실패했습니다.')
      setIsSuccess(false)
      setIsModalOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalConfirm = () => {
    setIsModalOpen(false)
    if (isSuccess) {
      navigate('/student/leave')
    }
  }

  const handleCancel = () => {
    navigate('/student/leave')
  }

  return (
    <div className={S.leaveContainer}>
      <StudentLayout>
        <div className={S.RequestForm}>
          <div className={S.FormNotice}>
            <Info size={16} color="var(--default-orange)" />
            <div className={S.NoticeContent}>
              <p className={S.NoticeTitle}>휴가 신청 안내</p>
              <p className={S.NoticeText}>
                휴가는 최대 3일(평일 기준)까지 이어서 신청할 수 있습니다.
              </p>
            </div>
          </div>

          <form className={S.FormFields} onSubmit={handleSubmit}>
            <div className={S.DateRow}>
              <div className={S.FieldGroup}>
                <label className={S.FieldLabel}>시작일</label>
                <DatePicker
                  value={startDate}
                  onChange={handleStartDateChange}
                  minDate={today}
                  placeholder="0000-00-00"
                />
              </div>

              <div className={S.FieldGroup}>
                <label className={S.FieldLabel}>종료일</label>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate || undefined}
                  placeholder="0000-00-00"
                />
              </div>
            </div>

            <div className={S.FieldGroup}>
              <label className={S.FieldLabel}>
                <FileText size={16} color="var(--default-orange)" />
                휴가 사유
              </label>
              <CustomComboBox
                options={LEAVE_TYPE_LABELS}
                placeholder="휴가 사유를 선택하세요"
                value={leaveType}
                onChange={setLeaveType}
              />
            </div>

            <div className={S.ButtonRow}>
              <Button
                type="submit"
                variant="primary"
                className={S.SubmitButton}
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? '신청 중...' : '신청하기'}
              </Button>
              <Button type="button" variant="blank" size="lg" onClick={handleCancel}>
                취소
              </Button>
            </div>
          </form>
        </div>
      </StudentLayout>

      <Modal
        isOpen={isModalOpen}
        title="내용을 확인해 주세요"
        onClose={handleModalConfirm}
        onConfirm={handleModalConfirm}
        buttonType="one"
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  )
}

export default LeaveRequestPage
