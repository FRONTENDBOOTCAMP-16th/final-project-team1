import StudentLayout from '@/pages/sample/StudentLayout'
import AttendanceActionCard from '@/pages/student/dashboard/components/AttendanceActionCard'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import S from './styles/dashboard.module.css'

function DashboardPage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const dateText = now.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  const timeText = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return (
    <StudentLayout>
      <div className={S.page}>
        <section className={S.todayCard}>
          <div className={S.timeCard}>
            <div>
              <p className={S.date}> {dateText}</p>
              <Clock size={40} />
              <strong className={S.time}>{timeText}</strong>
            </div>

            <div className={S.monthRate}>
              <span>이번 달 출석률</span>
              <strong>95%</strong>
            </div>
          </div>

          <div className={S.statusCard}>
            <h3 className={S.sectionTitle}>오늘의 출석 현황</h3>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>입실 시간</span>
              <strong className={S.checkInTime}>09:15</strong>
            </div>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>퇴실 시간</span>
              <strong className={S.checkOutTime}>--:--</strong>
            </div>
          </div>
        </section>

        <div className={S.action}>
          <AttendanceActionCard type="checkIn" />
          <AttendanceActionCard type="checkOut" />
        </div>

        <div className={S.content}>
          <AttendanceCalendar />

          <div className={S.sideArea}>
            <LeaveStatus />
            <NoticeList />
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

function AttendanceCalendar() {
  const year = 2026
  const month = 4

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
        {days.map((day, index) =>
          day ? (
            <div key={index} className={S.day}>
              {day}
            </div>
          ) : (
            <div key={index} className={S.empty} />
          ),
        )}
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

function LeaveStatus() {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>휴가승인 현황</h3>

      <div className={`${S.listItem} ${S.rejected}`}>
        <strong>휴가 승인이 반려되었습니다.</strong>
        <span>2026.04.10 - 2026.04.12</span>
      </div>

      <div className={`${S.listItem} ${S.approved}`}>
        <strong>휴가 승인이 완료되었습니다.</strong>
        <span>2026.04.10 - 2026.04.10</span>
      </div>
    </section>
  )
}

function NoticeList() {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>멋사 공지사항</h3>

      <div className={`${S.listItem} ${S.noticeImportant}`}>
        <strong>4월 정기 출석체크 일정 안내</strong>
        <span>2026.04.15</span>
      </div>

      <div className={`${S.listItem} ${S.noticeNormal}`}>
        <strong>봄학기 중간 평가 공지</strong>
        <span>2026.04.10</span>
      </div>
    </section>
  )
}

export default DashboardPage
