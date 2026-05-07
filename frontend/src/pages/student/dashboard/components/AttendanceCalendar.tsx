import S from '@/pages/student/dashboard/styles/dashboard.module.css'

interface AttendanceCalendarItem {
  attendanceDate: string
  attendanceStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'ONGOING'
}

interface Props {
  attendanceList: AttendanceCalendarItem[]
}

function AttendanceCalendar({ attendanceList }: Props) {
  const year = 2026
  const month = 5

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
        <span className={S.calendarMonth}>2026년 4월</span>
      </div>

      <div className={S.weekGrid}>
        {['일', '월', '화', '수', '목', '금', '토'].map((week) => (
          <span key={week} className={S.week}>
            {week}
          </span>
        ))}
      </div>

      <div className={S.calendarGrid}>
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className={S.empty} />
          }

          const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

          const attendance = attendanceList.find((item) => item.attendanceDate === dateString)

          return (
            <div
              key={index}
              className={`${S.day} ${
                attendance?.attendanceStatus === 'PRESENT'
                  ? S.present
                  : attendance?.attendanceStatus === 'LATE' ||
                      attendance?.attendanceStatus === 'ONGOING'
                    ? S.ongoing
                    : attendance?.attendanceStatus === 'ABSENT'
                      ? S.absent
                      : ''
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
            <span className={`${S.dot} ${S.orange}`} />
            <span>훈련중</span>
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
