import StudentLayout from '@/pages/sample/StudentLayout'
import AttendanceActionCard from '@/pages/student/dashboard/components/AttendanceActionCard'
import AttendanceCalendar from '@/pages/student/dashboard/components/AttendanceCalendar'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudentDashboard } from '@/pages/student/dashboard/api/studentDashboardApi'
import { api } from '@/api/axios'
import {
  getStudentNoticeList,
  type StudentNoticeItem,
} from '@/pages/student/dashboard/api/studentDashboardApi'
import S from '@/pages/student/dashboard/styles/dashboard.module.css'
import { axiosInstance } from '@/api/axios'

interface AttendanceItem {
  attendanceDate: string
  attendanceStatus: string
  checkInTime: string | null
  checkOutTime: string | null
}

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

interface LeaveItem {
  leaveRequestId: number
  studentId: string
  leaveTypeCode: string
  leaveTypeName: string
  startDate: string
  endDate: string
  approvalStatusCode: string
  approvalStatusName: string
}

function DashboardPage() {
  const [now, setNow] = useState(new Date())

  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [attendanceRate, setAttendanceRate] = useState<number>(0)

  const today = new Date()
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth() + 1)

  const [attendanceItems, setAttendanceItems] = useState<AttendanceItem[]>([])
  const [notices, setNotices] = useState<StudentNoticeItem[]>([])
  const navigate = useNavigate()
  const [isAttendanceLoading, setIsAttendanceLoading] = useState(true)

  const handlePrevMonth = () => {
    if (calendarMonth === 1) {
      setCalendarYear((prev) => prev - 1)
      setCalendarMonth(12)
      return
    }

    setCalendarMonth((prev) => prev - 1)
  }

  const handleNextMonth = () => {
    if (calendarMonth === 12) {
      setCalendarYear((prev) => prev + 1)
      setCalendarMonth(1)
      return
    }

    setCalendarMonth((prev) => prev + 1)
  }

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
        const response = await axiosInstance.get('/api/student/dashboard')

        console.log('학생 대시보드 응답:', response.data)
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

  const getWeekdayCount = (year: number, month: number) => {
    const lastDate = new Date(year, month, 0).getDate()

    let weekdayCount = 0

    for (let day = 1; day <= lastDate; day++) {
      const date = new Date(year, month - 1, day)
      const weekDay = date.getDay()

      if (weekDay !== 0 && weekDay !== 6) {
        weekdayCount += 1
      }
    }

    return weekdayCount
  }

  useEffect(() => {
    const fetchAttendanceItems = async () => {
      try {
        setIsAttendanceLoading(true)

        const response = await api.get('/api/student/attendance-calendar', {
          params: {
            year: calendarYear,
            month: calendarMonth,
          },
        })

        console.log('출결 캘린더 응답:', response.data)

        if (!response.data.success) {
          setAttendanceItems([])
          return
        }

        const items: AttendanceItem[] = response.data.data.items ?? []
        console.log('캘린더 변환 데이터:', calendarAttendanceList)

        const totalDays = getWeekdayCount(calendarYear, calendarMonth)
        const rate = items.length === 0 ? 0 : Math.round((items.length / totalDays) * 100)

        console.log('출석률 계산용 items:', items)
        console.log('출석률 계산:', {
          calendarYear,
          calendarMonth,
          totalDays,
          attendanceCount: items.length,
          rate,
        })

        setAttendanceRate(rate)
        setAttendanceItems(items)

        setIsAttendanceLoading(false)
      } catch (error) {
        console.error('출결 캘린더 조회 실패:', error)
        setAttendanceItems([])
        setIsAttendanceLoading(false)
      }
    }

    fetchAttendanceItems()
  }, [calendarYear, calendarMonth])

  const handleCheckIn = async () => {
    if (checkInTime) {
      alert('이미 입실 처리되었습니다.')
      return
    }

    try {
      const response = await axiosInstance.post('/api/student/attendance/check-in')

      const time = response.data.data.checkInTime

      setCheckInTime(formatApiTime(time))
    } catch (error) {
      console.error('입실 처리 실패', error)
    }
  }

  const handleCheckOut = async () => {
    console.log('퇴실 함수 실행됨')
    if (checkOutTime) {
      alert('이미 퇴실 처리되었습니다.')
      return
    }

    try {
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

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const response = await getStudentDashboard()

        const todayAttendance = response.data.todayAttendance

        console.log('입실 원본 시간:', todayAttendance?.checkInTime)
        console.log('퇴실 원본 시간:', todayAttendance?.checkOutTime)

        setCheckInTime(todayAttendance?.checkInTime ?? null)
        setCheckOutTime(todayAttendance?.checkOutTime ?? null)
      } catch (error) {
        console.error('오늘 출석 정보 조회 실패:', error)
      }
    }

    fetchTodayAttendance()
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

  const calendarAttendanceList = attendanceItems.map((item) => ({
    attendanceDate: item.attendanceDate,
    attendanceStatus:
      item.checkInTime && !item.checkOutTime
        ? ('ONGOING' as const)
        : item.checkOutTime
          ? ('PRESENT' as const)
          : ('ABSENT' as const),
  }))

  const formatTime = (time: string | null) => {
    if (!time) return '--:--'

    if (time.includes('T')) {
      return time.split('T')[1].slice(0, 5)
    }

    return time.slice(0, 5)
  }

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
              <strong className={S.checkInTime}>{formatTime(checkInTime)}</strong>
            </div>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>퇴실 시간</span>
              <strong className={S.checkOutTime}>{formatTime(checkOutTime)}</strong>
            </div>
          </div>
        </section>

        <div className={S.actionCardList}>
          <AttendanceActionCard type="checkIn" onClick={handleCheckIn} />
          <AttendanceActionCard type="checkOut" onClick={handleCheckOut} />
        </div>

        <div className={S.content}>
          <AttendanceCalendar
            year={calendarYear}
            month={calendarMonth}
            attendanceList={calendarAttendanceList}
            isLoading={isAttendanceLoading}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
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
  const navigate = useNavigate()

  const [leaveList, setLeaveList] = useState<LeaveItem[]>([])

  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        const response = await api.get('/api/student/leave-requests', {
          params: {
            page: 1,
            size: 10,
          },
        })

        console.log('휴가 목록 응답 전체:', response.data)
        console.log('휴가 items:', response.data.data?.items)

        console.log('휴가 목록 응답:', response.data)

        if (!response.data.success) {
          setLeaveList([])
          return
        }

        setLeaveList(response.data.data.items ?? [])
      } catch (error) {
        console.error('휴가 목록 조회 실패:', error)
        setLeaveList([])
      }
    }

    fetchLeaveList()
  }, [])

  const statusMessageMap: Record<string, string> = {
    '승인 대기': '휴가 승인 대기 중입니다.',
    '승인 완료': '휴가 승인이 완료되었습니다.',
    반려: '휴가 승인이 반려되었습니다.',
  }

  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>휴가승인 현황</h3>

      {leaveList.slice(0, 3).map((item) => (
        <div
          key={item.leaveRequestId}
          className={`${S.listItem} ${
            item.approvalStatusName === '승인 완료'
              ? S.approved
              : item.approvalStatusName === '반려'
                ? S.rejected
                : S.pending
          }`}
          onClick={() => navigate('/student/leave')}
        >
          <strong>{statusMessageMap[item.approvalStatusName]}</strong>

          <span>
            {item.startDate} - {item.endDate}
          </span>
        </div>
      ))}
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
