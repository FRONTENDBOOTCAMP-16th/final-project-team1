import S from '@/pages/student/dashboard/styles/dashboard.module.css'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AttendanceCalendarItem {
  attendanceDate: string
  attendanceStatus: 'PRESENT' | 'ABSENT'
}

interface Props {
  year: number
  month: number
  attendanceList: AttendanceCalendarItem[]
  isLoading: boolean
  onPrevMonth: () => void
  onNextMonth: () => void
}

function AttendanceCalendar({
  year,
  month,
  attendanceList,
  isLoading,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const lastDate = new Date(year, month, 0).getDate()

  const days = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: lastDate }, (_, index) => index + 1),
  ]

  return (
    <section className={S.calendarCard}>
      <div className={S.calendarHeader}>
        <h3 className={S.sectionTitle}>출석현황 캘린더</h3>

        <div className={S.monthController}>
          <button type="button" onClick={onPrevMonth} className={S.monthButton}>
            <ChevronLeft size={20} />
          </button>

          <span className={S.calendarMonth}>
            {year}년 {month}월
          </span>

          <button type="button" onClick={onNextMonth} className={S.monthButton}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className={S.calendarGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className={S.empty} />
          }

          const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

          const attendance = attendanceList.find((item) => item.attendanceDate === dateString)
          const weekDay = new Date(year, month - 1, day).getDay()
          const isWeekday = weekDay !== 0 && weekDay !== 6
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const currentDate = new Date(year, month - 1, day)
          currentDate.setHours(0, 0, 0, 0)

          const isFutureDate = currentDate > today

          const status = attendance
            ? attendance.attendanceStatus
            : !isLoading && isWeekday && !isFutureDate
              ? 'ABSENT'
              : undefined

          return (
            <div
              key={index}
              className={`${S.day} ${
                status === 'PRESENT' ? S.present : status === 'ABSENT' ? S.absent : ''
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div className={S.legend}>
        <h4 className={S.legendTitle}>출석현황</h4>

        <div className={S.legendItems}>
          <div className={S.legendItem}>
            <span className={`${S.dot} ${S.green}`} />
            <span>출석완료</span>
          </div>
          <div className={S.legendItem}>
            <span className={`${S.dot} ${S.red}`} />
            <span>결석</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AttendanceCalendar
