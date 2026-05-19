import StudentLayout from '@/pages/sample/StudentLayout'
import AttendanceActionCard from '@/pages/student/dashboard/components/AttendanceActionCard'
import AttendanceCalendar from '@/pages/student/dashboard/components/AttendanceCalendar'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getStudentDashboard } from '@/pages/student/dashboard/api/studentDashboardApi'
import { api } from '@/api/axios'
import { getStudentNoticeList } from '@/pages/student/dashboard/api/studentDashboardApi'
import Modal from '@/components/common/modal/Modal'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
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

  const today = new Date()
  const [calendarYear, setCalendarYear] = useState(today.getFullYear())
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth() + 1)

  const queryClient = useQueryClient()

  const navigate = useNavigate()

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
    return new Date(time).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

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

  const { data: notices = [], isLoading: isNoticeLoading } = useQuery({
    queryKey: ['studentNotices'],
    queryFn: getStudentNoticeList,
  })

  // 출결 캘린더
  const { data: attendanceItems = [], isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['studentAttendanceCalendar', calendarYear, calendarMonth],
    queryFn: async () => {
      const response = await api.get('/api/student/attendance-calendar', {
        params: {
          year: calendarYear,
          month: calendarMonth,
        },
      })

      if (!response.data.success) {
        return []
      }

      return response.data.data.items ?? []
    },
  })

  const totalDays = getWeekdayCount(calendarYear, calendarMonth)

  const attendanceRate =
    attendanceItems.length === 0 ? 0 : Math.round((attendanceItems.length / totalDays) * 100)

  //중복 입/퇴실
  const [popupMessage, setPopupMessage] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const openPopup = (message: string) => {
    setPopupMessage(message)
    setIsPopupOpen(true)
  }
  const checkInMutation = useMutation({
    mutationFn: () => axiosInstance.post('/api/student/attendance/check-in'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['studentDashboard'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['studentAttendanceCalendar'],
      })
    },
    onError: (error) => {
      console.error('입실 처리 실패', error)
    },
  })

  const checkOutMutation = useMutation({
    mutationFn: () => axiosInstance.post('/api/student/attendance/check-out'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['studentDashboard'],
      })

      await queryClient.invalidateQueries({
        queryKey: ['studentAttendanceCalendar'],
      })
    },
    onError: (error) => {
      console.error('퇴실 처리 실패', error)
    },
  })

  const handleCheckIn = () => {
    if (todayAttendance?.checkInTime) {
      openPopup('이미 입실 처리되었습니다.')
      return
    }

    checkInMutation.mutate()
  }

  const handleCheckOut = () => {
    if (todayAttendance?.checkOutTime) {
      openPopup('이미 퇴실 처리되었습니다.')
      return
    }

    checkOutMutation.mutate()
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [])

  const { data: studentDashboard } = useQuery({
    queryKey: ['studentDashboard'],
    queryFn: getStudentDashboard,
  })

  const todayAttendance = studentDashboard?.data.todayAttendance

  const displayCheckInTime = todayAttendance?.checkInTime
    ? formatApiTime(todayAttendance.checkInTime)
    : '--:--'

  const displayCheckOutTime = todayAttendance?.checkOutTime
    ? formatApiTime(todayAttendance.checkOutTime)
    : '--:--'

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

  const calendarAttendanceList = attendanceItems.map((item: AttendanceItem) => ({
    attendanceDate: item.attendanceDate,
    attendanceStatus: item.checkInTime ? ('PRESENT' as const) : ('ABSENT' as const),
  }))

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
              <strong className={S.checkInTime}>{displayCheckInTime}</strong>
            </div>

            <div className={S.statusBox}>
              <span className={S.statusLabel}>퇴실 시간</span>
              <strong className={S.checkOutTime}>{displayCheckOutTime}</strong>
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

            {isNoticeLoading ? (
              <section className={S.sideCard}>
                <h3 className={S.sectionTitle}>공지사항</h3>
                <TableSkeleton rows={3} columns={1} />
              </section>
            ) : (
              <NoticeList
                notices={notices}
                onNoticeClick={(noticeId) => navigate(`/student/notice/${noticeId}`)}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="알림"
        buttonType="one"
        onConfirm={() => setIsPopupOpen(false)}
      >
        <p>{popupMessage}</p>
      </Modal>
    </StudentLayout>
  )
}

//휴가 신청 현황
function LeaveStatus() {
  const navigate = useNavigate()
  const [isLeaveLoading, setIsLeaveLoading] = useState(true)
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

        if (!response.data.success) {
          setLeaveList([])
          return
        }

        const items = response.data.data.items ?? []

        const pendingItems = items
          .filter((item: LeaveItem) => item.approvalStatusName === '승인 대기')
          .slice(-3)
          .reverse()

        setLeaveList(pendingItems)
      } catch (error) {
        console.error('휴가 목록 조회 실패:', error)
        setLeaveList([])
      } finally {
        setIsLeaveLoading(false)
      }
    }

    fetchLeaveList()
  }, [])

  const statusMessageMap: Record<string, string> = {
    '승인 대기': '휴가 승인 대기 중입니다.',
    '승인 완료': '휴가 승인이 완료되었습니다.',
    반려: '휴가 승인이 반려되었습니다.',
  }
  if (isLeaveLoading) {
    return (
      <section className={S.sideCard}>
        <h3 className={S.sectionTitle}>휴가승인 현황</h3>
        <TableSkeleton rows={3} columns={1} />
      </section>
    )
  }
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>휴가승인 현황</h3>

      {leaveList.map((item) => (
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

// 공지사항
function NoticeList({ notices, onNoticeClick }: NoticeListProps) {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>멋사 공지사항</h3>

      {[...notices]
        .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
        .slice(0, 2)
        .map((notice, index) => (
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
