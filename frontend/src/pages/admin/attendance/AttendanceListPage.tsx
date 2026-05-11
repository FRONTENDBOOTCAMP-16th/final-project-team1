import { useEffect, useMemo, useState } from 'react'
import { TrendingUp, UserCheck, Clock, UserX } from 'lucide-react'
import { Button } from '@/components'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'
import S from './styles/attendance.module.css'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
import AdminLayout from '@/pages/sample/AdminLayout'
import DatePicker from '@/components/common/datePicker'
import CountCard from '@/components/common/countCard/CountCard'

import {
  getAttendanceList,
  type AttendanceApiItem,
} from '@/pages/admin/attendance/api/attendanceApi'

const PAGE_SIZE = 10

type AttendanceStatus = '출석완료' | '지각' | '결석'

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

export default function AttendanceListPage() {
  const [attendanceData, setAttendanceData] = useState<AttendanceApiItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)


  const [isLoading, setIsLoading] = useState(false)

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    const fetchAttendanceList = async () => {
      setIsLoading(true)
      try {
        const data = await getAttendanceList()
        console.log('출결 목록 API 데이터:', data)
        setAttendanceData(data)
      } catch (error) {
        console.error('출결 목록 API 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendanceList()
  }, [])

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
    setCurrentPage(1)
  }

  const filteredAttendances = useMemo(() => {
    return attendanceData
  }, [attendanceData])

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
    { key: 'studentId', header: '학번' },
    { key: 'checkInTime', header: '입실시간' },
    { key: 'checkOutTime', header: '퇴실시간' },
    {
      key: 'attendanceStatusName',
      header: '출결상태',
      render: (row) => {
        const status = attendanceStatusMap[row.attendanceStatusName as AttendanceStatus]

        if (!status) return <span>-</span>

        return <span className={`${S.statusBadge} ${status.className}`}>{status.label}</span>
      },
    },
  ]

  return (
    <AdminLayout>
      <section className={S.count_box}>
        <CountCard label="오늘의 출석률" value={0} unit="%" icon={<TrendingUp />} variant="gray" />
        <CountCard label="출석완료" value={0} unit="명" icon={<UserCheck />} variant="green" />
        <CountCard label="지각인원" value={0} unit="명" icon={<Clock />} variant="yellow" />
        <CountCard label="결석인원" value={0} unit="명" icon={<UserX />} variant="red" />
      </section>

      <section className={S.filter_box}>
        <div className={S.date_box}>
          <DatePicker value={startDate} onChange={handleStartChange} placeholder="0000-00-00" />
          <span>-</span>
          <DatePicker
            value={endDate}
            onChange={(date) => {
              setEndDate(date)
              setCurrentPage(1)
            }}
            minDate={startDate || undefined}
            placeholder="0000-00-00"
          />
        </div>

        <div>
          <Button variant="success">출석</Button>
          <Button variant="warning">지각</Button>
          <Button variant="error">결석</Button>
          <Button variant="blank">전체</Button>
        </div>
      </section>

      <section className={S.tableBox}>
        {isLoading ? (
          <TableSkeleton
            columns={[
              { header: '이름', width: '15%' },
              { header: '학번', width: '20%' },
              { header: '입실시간', width: '25%' },
              { header: '퇴실시간', width: '25%' },
              { header: '출결상태', width: '15%' },
            ]}
            rows={PAGE_SIZE}
          />
        ) : (
          <Table columns={attendanceColumns} data={pagedAttendances} />
        )}
        
        
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
