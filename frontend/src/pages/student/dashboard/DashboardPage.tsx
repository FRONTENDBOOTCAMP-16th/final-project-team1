import StudentLayout from '@/pages/sample/StudentLayout'
import AttendanceActionCard from '@/pages/student/dashboard/components/AttendanceActionCard'
import AttendanceCalendar from '@/pages/student/dashboard/components/AttendanceCalendar'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/axios'
import {
  getStudentNoticeList,
  type StudentNoticeItem,
} from '@/pages/student/dashboard/api/studentDashboardApi'
import S from '@/pages/student/dashboard/styles/dashboard.module.css'
import { axiosInstance } from '@/api/axios'

interface NoticeItem {
  noticeId: number
  title: string
  createdDate: string
  isOpen?: boolean
}

interface NoticeListProps {
  notices: NoticeItem[]
  onNoticeClick: (noticeId: number) => void
}

function DashboardPage() {
  const [now, setNow] = useState(new Date())

  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [attendanceRate, setAttendanceRate] = useState<number>(0)

  const [attendanceItems, setAttendanceItems] = useState([])
  const [notices, setNotices] = useState<StudentNoticeItem[]>([])
  const navigate = useNavigate()

  const formatApiTime = (time: string) => {
    return new Date(`${time}Z`).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  useEffect(() => {
    const fetchStudentDashboard = async () => {
      try {
        // const studentId = localStorage.getItem('studentId')

        // const response = await api.get('/api/student/dashboard', {
        //   params: {
        //     studentId,
        //   },
        // })

        const response = await axiosInstance.get('/api/student/dashboard')

        console.log('학생 대시보드 응답:', response.data)

        setAttendanceRate(response.data.data.attendanceRate)
      } catch (error) {
        console.error('학생 대시보드 조회 실패:', error)
      }
    }

    const fetchNotices = async () => {
      try {
        const data = await getStudentNoticeList()

        setNotices(data)
      } catch (error) {
        console.error('공지사항 조회 실패:', error)
      }
    }

    fetchStudentDashboard()
    fetchNotices()
  }, [])

  useEffect(() => {
    const fetchAttendanceItems = async () => {
      try {
        const response = await api.get('/api/admin/attendances', {
          params: {
            size: 40,
          },
        })

        console.log('출결 목록 응답:', response.data)

        console.log(
          '전체 studentId 목록:',
          response.data.data.items.map((item: { studentId: string }) => item.studentId),
        )

        const studentId = localStorage.getItem('studentId')

        const myAttendanceItems = response.data.data.items.filter(
          (item: { studentId: string }) => item.studentId === studentId,
        )

        console.log('내 출결 목록:', myAttendanceItems)

        setAttendanceItems(myAttendanceItems)
      } catch (error) {
        console.error('출결 목록 조회 실패:', error)
      }
    }

    fetchAttendanceItems()
  }, [])

  const handleCheckIn = async () => {
    try {
      // const studentId = localStorage.getItem('studentId')

      // const response = await api.post('/api/student/attendance/check-in', {
      //   studentId,
      // })

      const response = await axiosInstance.post('/api/student/attendance/check-in')

      const time = response.data.data.checkInTime

      setCheckInTime(formatApiTime(time))
    } catch (error) {
      console.error('입실 처리 실패', error)
    }
  }

  const handleCheckOut = async () => {
    console.log('퇴실 함수 실행됨')

    try {
      // const studentId = localStorage.getItem('studentId')
      // console.log('studentId:', studentId)

      // const response = await api.post('/api/student/attendance/check-out', {
      //   studentId,
      // })

      const response = await axiosInstance.post('/api/student/attendance/check-out')

      console.log('퇴실 응답:', response.data)

      const time = response.data.data.checkOutTime

      setCheckOutTime(formatApiTime(time))
    } catch (error) {
      console.error('퇴실 처리 실패', error)
    }
  }

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
              <strong>{attendanceRate}%</strong>
            </div>
          </div>

          <div className={S.statusCard}>
            <h3 className={S.sectionTitle}>오늘의 출석 현황</h3>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>입실 시간</span>
              <strong className={S.checkInTime}>{checkInTime ?? '--:--'}</strong>
            </div>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>퇴실 시간</span>
              <strong className={S.checkOutTime}>{checkOutTime ?? '--:--'}</strong>
            </div>
          </div>
        </section>

        <div className={S.actionCardList}>
          <AttendanceActionCard type="checkIn" onClick={handleCheckIn} />
          <AttendanceActionCard type="checkOut" onClick={handleCheckOut} />
        </div>

        <div className={S.content}>
          <AttendanceCalendar attendanceList={attendanceItems} />
          <div className={S.sideArea}>
            <LeaveStatus />
            <NoticeList
              notices={notices}
              onNoticeClick={(noticeId) => navigate(`/student/notice/${noticeId}`)}
            />
          </div>
        </div>
      </div>
    </StudentLayout>
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

function NoticeList({ notices, onNoticeClick }: NoticeListProps) {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>멋사 공지사항</h3>

      {notices.slice(0, 2).map((notice, index) => (
        <div
          key={notice.noticeId}
          className={`${S.listItem} ${index === 0 ? S.noticeImportant : S.noticeNormal}`}
          onClick={() => onNoticeClick(notice.noticeId)}
        >
          <strong>{notice.title}</strong>
          <span>{notice.createdDate}</span>
        </div>
      ))}
    </section>
  )
}

export default DashboardPage
