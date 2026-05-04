import AdminLayout from '@/pages/sample/AdminLayout'
import { useEffect, useState } from 'react'
import { Clock, ScrollText, TrendingUp, UserCheck, UserX, Check, X } from 'lucide-react'

import CountCard from '@/components/common/countCard/CountCard'
import {
  getAdminDashboardSummary,
  getAttendanceStatusByClass,
  getNoticeList,
  type AttendanceItem,
  type AdminDashboardData,
  type NoticeItem,
} from '@/pages/admin/dashboard/api/dashboardApi'
import AttendanceStatusChart from '@/pages/admin/dashboard/components/AttendanceStatusChart'
import SystemNoticeList from './components/NoticeList'
import Table, { type TableColumn } from '@/components/common/table'
import { Button } from '@/components'
import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

import Pagination from '@/components/common/pagination/Pagination'

type VacationType = '병결' | '공결' | '개인사유'

type Vacation = {
  name: string
  studentNo: string
  vacationType: VacationType
  period: string
}

const vacationTypeMap = {
  병결: {
    label: '병결',
    className: S.vacationSick,
  },
  공결: {
    label: '공결',
    className: S.vacationOfficial,
  },
  개인사유: {
    label: '개인사유',
    className: S.vacationPersonal,
  },
}

const vacationData: Vacation[] = [
  {
    name: '김민수',
    studentNo: '2024001',
    vacationType: '병결',
    period: '00.00 - 00.00',
  },
  {
    name: '황재호',
    studentNo: '2024001',
    vacationType: '공결',
    period: '00.00 - 00.00',
  },
  {
    name: '정호영',
    studentNo: '2024001',
    vacationType: '개인사유',
    period: '00.00 - 00.00',
  },
]

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminDashboardData | null>(null)
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [noticeData, setNoticeData] = useState<NoticeItem[]>([])

  useEffect(() => {
    const fetchNoticeList = async () => {
      try {
        const data = await getNoticeList()
        setNoticeData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchNoticeList()
  }, [])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAdminDashboardSummary()
        setSummary(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSummary()
  }, [])

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const data = await getAttendanceStatusByClass()
        setAttendanceData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAttendanceData()
  }, [])

  const handleApprove = (row: Vacation) => {
    console.log('승인', row)
  }

  const handleReject = (row: Vacation) => {
    console.log('반려', row)
  }

  const pageSize = 12
  const totalCount = 248
  const totalPages = Math.ceil(totalCount / pageSize)

  const vacationColumns: TableColumn<Vacation>[] = [
    {
      key: 'name',
      header: '신청자',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.circle}>{row.name[0]}</span>
          <span className={S.tit}>{row.name}</span>
        </div>
      ),
    },
    { key: 'studentNo', header: '학번' },
    {
      key: 'vacationType',
      header: '휴가종류',
      render: (row) => {
        const vacation = vacationTypeMap[row.vacationType]

        return <span className={`${S.statusBadge} ${vacation.className}`}>{vacation.label}</span>
      },
    },
    { key: 'period', header: '기간' },
    {
      key: 'action',
      header: '처리',
      render: (row) => (
        <div className={S.actionBox}>
          <Button type="button" variant="active" onClick={() => handleApprove(row)}>
            <Check size={16} />
            승인
          </Button>

          <Button type="button" variant="inactive" onClick={() => handleReject(row)}>
            <X size={16} />
            반려
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className={S.dashboard}>
        <section className={S.cardSection}>
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
          <CountCard
            label="휴가승인대기"
            value={summary?.pendingLeaveCount ?? 0}
            unit="명"
            icon={<ScrollText />}
            variant="orange"
          />
        </section>
        <div className={S.topGrid}>
          <section className={S.chartSection}>
            <div className={S.container}>
              <AttendanceStatusChart data={attendanceData} />
            </div>
          </section>

          <section className={S.noticeSection}>
            <div className={S.container}>
              <SystemNoticeList data={noticeData} />
            </div>
          </section>
        </div>

        <section className={S.recentLeave}>
          <h3>최근 휴가 신청 내역</h3>

          <Table
            columns={vacationColumns}
            data={vacationData}
            totalCount={248}
            currentPage={1}
            pageSize={12}
            countLabel="명"
          />

          <div className={S.paginationBox}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
