import { useEffect, useState } from 'react'
import { TrendingUp, UserCheck, Clock, UserX } from 'lucide-react'
import { Button } from '@/components'
import Table, { type TableColumn } from '@/components/common/table'
import S from './styles/attendance.module.css'

import AdminLayout from '@/pages/sample/AdminLayout'
import DatePicker from '@/components/common/datePicker'
import CountCard from '@/components/common/countCard/CountCard'

import {
  getAttendanceSummary,
  type AttendanceSummaryData,
} from '@/pages/admin/attendance/api/attendanceApi'

type AttendanceStatus = '출석완료' | '지각' | '결석'

type Attendance = {
  name: string
  studentNo: string
  enterTime: string
  leaveTime: string
  attendanceStatus: AttendanceStatus
}

const attendanceStatusMap = {
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
  const [summary, setSummary] = useState<AttendanceSummaryData | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAttendanceSummary()
        console.log('대시보드 API 데이터:', data)
        setSummary(data)
      } catch (error) {
        console.error('대시보드 API 실패:', error)
      }
    }

    fetchSummary()
  }, [])

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
  }

  const attendanceColumns: TableColumn<Attendance>[] = [
    {
      key: 'name',
      header: '이름',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.tit}>{row.name}</span>
        </div>
      ),
    },
    { key: 'studentNo', header: '학번' },
    { key: 'enterTime', header: '입실시간' },
    { key: 'leaveTime', header: '퇴실시간' },
    {
      key: 'attendanceStatus',
      header: '출결상태',
      render: (row) => {
        const status = attendanceStatusMap[row.attendanceStatus]

        return <span className={`${S.statusBadge} ${status.className}`}>{status.label}</span>
      },
    },
  ]

  const attendanceData: Attendance[] = [
    {
      name: '김민수',
      studentNo: '2024001',
      enterTime: '08:50',
      leaveTime: '18:00',
      attendanceStatus: '출석완료',
    },
    {
      name: '황재호',
      studentNo: '2024002',
      enterTime: '10:30',
      leaveTime: '18:00',
      attendanceStatus: '지각',
    },
    {
      name: '정호영',
      studentNo: '2024003',
      enterTime: '00:00',
      leaveTime: '00:00',
      attendanceStatus: '결석',
    },
  ]

  return (
    <AdminLayout>
      <section className={S.count_box}>
        <CountCard
          label="오늘의 출석률"
          value={summary?.attendanceRate ?? 0}
          unit="%"
          icon={<TrendingUp />}
          variant="gray"
        />
        <CountCard
          label="출석완료"
          value={summary?.presentCount ?? 0}
          unit="명"
          icon={<UserCheck />}
          variant="green"
        />
        <CountCard
          label="지각인원"
          value={summary?.lateCount ?? 0}
          unit="명"
          icon={<Clock />}
          variant="yellow"
        />
        <CountCard
          label="결석인원"
          value={summary?.absentCount ?? 0}
          unit="명"
          icon={<UserX />}
          variant="red"
        />
      </section>
      <section className={S.filter_box}>
        <div className={S.date_box}>
          <DatePicker value={startDate} onChange={handleStartChange} placeholder="0000-00-00" />
          <span>-</span>
          <DatePicker
            value={endDate}
            onChange={setEndDate}
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
        <Table
          columns={attendanceColumns}
          data={attendanceData}
          totalCount={248}
          currentPage={1}
          pageSize={12}
          countLabel="명"
        />
      </section>
    </AdminLayout>
  )
}

