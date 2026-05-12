import { useEffect, useMemo, useState } from 'react'
import { TrendingUp, UserCheck, Clock, UserX } from 'lucide-react'

import { Button } from '@/components'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'
import AdminLayout from '@/pages/sample/AdminLayout'
import DatePicker from '@/components/common/datePicker'
import CountCard from '@/components/common/countCard/CountCard'

import {
  getAttendanceList,
  type AttendanceApiItem,
} from '@/pages/admin/attendance/api/attendanceApi'

import S from './styles/attendance.module.css'

const PAGE_SIZE = 10

type AttendanceStatus = '출석완료' | '지각' | '결석'
type FilterStatus = AttendanceStatus | '전체'

const attendanceStatusMap: Record<AttendanceStatus, { label: string; className: string }> = {
  출석완료: {
    label: '출석완료',
    className: S.attendanceComplete,
  },
  지각: {
    label: '지각',
    className: S.attendanceLate,
  },
  결석: {
    label: '결석',
    className: S.attendanceAbsent,
  },
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getAttendanceStatusByCheckIn(checkInTime: string): AttendanceStatus {
  if (!checkInTime || checkInTime === '00:00') {
    return '결석'
  }

  if (checkInTime > '09:00') {
    return '지각'
  }

  return '출석완료'
}

export default function AttendanceListPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceApiItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('전체')

  const startDateValue = startDate ? formatDate(startDate) : undefined
  const endDateValue = endDate ? formatDate(endDate) : undefined

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        const data = await getAttendanceList({
          startDate: startDateValue,
          endDate: endDateValue,
          page: 1,
          size: 100,
        })

        console.log('출결 목록 API 데이터:', data)

        setAttendanceData(data)
        setCurrentPage(1)
      } catch (error) {
        console.error('출결 목록 API 실패:', error)
      }
    }

    fetchAttendanceList()
  }, [startDateValue, endDateValue])

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
    setCurrentPage(1)
  }

  const handleEndChange = (date: Date | null) => {
    setEndDate(date)
    setCurrentPage(1)
  }

  const presentCount = useMemo(() => {
    return attendanceData.filter(
      (item) => getAttendanceStatusByCheckIn(item.checkInTime) === '출석완료',
    ).length
  }, [attendanceData])

  const lateCount = useMemo(() => {
    return attendanceData.filter(
      (item) => getAttendanceStatusByCheckIn(item.checkInTime) === '지각',
    ).length
  }, [attendanceData])

  const absentCount = useMemo(() => {
    return attendanceData.filter(
      (item) => getAttendanceStatusByCheckIn(item.checkInTime) === '결석',
    ).length
  }, [attendanceData])

  const attendanceRate = useMemo(() => {
    if (attendanceData.length === 0) return 0

    return Math.round(((presentCount + lateCount) / attendanceData.length) * 100)
  }, [attendanceData.length, presentCount, lateCount])

  const filteredAttendances = useMemo(() => {
    if (selectedStatus === '전체') {
      return attendanceData
    }

    return attendanceData.filter(
      (item) => getAttendanceStatusByCheckIn(item.checkInTime) === selectedStatus,
    )
  }, [attendanceData, selectedStatus])

  const totalPages = Math.max(1, Math.ceil(filteredAttendances.length / PAGE_SIZE))

  const pagedAttendances = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    return filteredAttendances.slice(start, end)
  }, [filteredAttendances, currentPage])

  const attendanceColumns: TableColumn<AttendanceApiItem>[] = [
    {
      key: 'studentName',
      header: '이름',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.tit}>{row.studentName}</span>
        </div>
      ),
    },

    {
      key: 'attendanceDate',
      header: '출석일',
    },

    {
      key: 'studentId',
      header: '학번',
    },

    {
      key: 'checkInTime',
      header: '입실시간',
    },

    {
      key: 'checkOutTime',
      header: '퇴실시간',
    },

    {
      key: 'attendanceStatusName',
      header: '출결상태',
      render: (row) => {
        const calculatedStatus = getAttendanceStatusByCheckIn(row.checkInTime)

        const status = attendanceStatusMap[calculatedStatus]

        return <span className={`${S.statusBadge} ${status.className}`}>{status.label}</span>
      },
    },
  ]

  return (
    <AdminLayout>
      <section className={S.count_box}>
        <CountCard
          label="출석률"
          value={attendanceRate}
          unit="%"
          icon={<TrendingUp />}
          variant="gray"
        />

        <CountCard
          label="출석완료"
          value={presentCount}
          unit="명"
          icon={<UserCheck />}
          variant="green"
        />

        <CountCard label="지각인원" value={lateCount} unit="명" icon={<Clock />} variant="yellow" />

        <CountCard label="결석인원" value={absentCount} unit="명" icon={<UserX />} variant="red" />
      </section>

      <section className={S.filter_box}>
        <div className={S.date_box}>
          <DatePicker value={startDate} onChange={handleStartChange} placeholder="0000-00-00" />

          <span>-</span>

          <DatePicker
            value={endDate}
            onChange={handleEndChange}
            minDate={startDate || undefined}
            placeholder="0000-00-00"
          />
        </div>

        <div>
          <Button
            variant="success"
            onClick={() => {
              setSelectedStatus('출석완료')
              setCurrentPage(1)
            }}
          >
            출석
          </Button>

          <Button
            variant="warning"
            onClick={() => {
              setSelectedStatus('지각')
              setCurrentPage(1)
            }}
          >
            지각
          </Button>

          <Button
            variant="error"
            onClick={() => {
              setSelectedStatus('결석')
              setCurrentPage(1)
            }}
          >
            결석
          </Button>

          <Button
            variant="blank"
            onClick={() => {
              setSelectedStatus('전체')
              setCurrentPage(1)
            }}
          >
            전체
          </Button>
        </div>
      </section>

      <section className={S.tableBox}>
        <Table columns={attendanceColumns} data={pagedAttendances} />

        <div className={S.table_footer}>
          <span>
            총 {filteredAttendances.length}건 중{' '}
            {filteredAttendances.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
            {Math.min(currentPage * PAGE_SIZE, filteredAttendances.length)}건 표시
          </span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </AdminLayout>
  )
}
