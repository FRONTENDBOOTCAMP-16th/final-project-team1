import AdminLayout from '@/pages/sample/AdminLayout'
import { useEffect, useState } from 'react'
import { Clock, ScrollText, TrendingUp, UserCheck, UserX, Check, X } from 'lucide-react'

import CountCard from '@/components/common/countCard/CountCard'
import {
  getAdminDashboardSummary,
  getAttendanceStatusByClass,
  getNoticeList,
  getLeaveRequestList,
  updateLeaveRequestStatus,
  type AttendanceItem,
  type AdminDashboardData,
  type NoticeItem,
  type LeaveRequestItem,
} from '@/pages/admin/dashboard/api/dashboardApi'
import AttendanceStatusChart from '@/pages/admin/dashboard/components/AttendanceStatusChart'
import SystemNoticeList from './components/NoticeList'
import Table, { type TableColumn } from '@/components/common/table'
import { Button } from '@/components'

import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

import Pagination from '@/components/common/pagination/Pagination'

type VacationType = '병결' | '공결' | '개인사유'

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

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<AdminDashboardData | null>(null)
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const [noticeData, setNoticeData] = useState<NoticeItem[]>([])

  const [vacationData, setVacationData] = useState<LeaveRequestItem[]>([])
  const [leaveTotalCount, setLeaveTotalCount] = useState(0)

  useEffect(() => {
    const fetchLeaveRequestList = async () => {
      try {
        const data = await getLeaveRequestList(currentPage, pageSize)

        setVacationData(data.items)
        setLeaveTotalCount(data.totalCount)
      } catch (error) {
        console.error(error)
      }
    }

    fetchLeaveRequestList()
  }, [currentPage])

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

  const handleApprove = async (row: LeaveRequestItem) => {
    try {
      await updateLeaveRequestStatus(row.leaveRequestId, 'V002')

      const data = await getLeaveRequestList(currentPage, pageSize)

      setVacationData(data.items)
      setLeaveTotalCount(data.totalCount)
    } catch (error) {
      console.error(error)
    }
  }

  const handleReject = async (row: LeaveRequestItem) => {
    try {
      await updateLeaveRequestStatus(row.leaveRequestId, 'V003')

      const data = await getLeaveRequestList(currentPage, pageSize)

      setVacationData(data.items)
      setLeaveTotalCount(data.totalCount)
    } catch (error) {
      console.error(error)
    }
  }

  const pageSize = 10
  const totalPages = Math.ceil(leaveTotalCount / pageSize)

  const vacationColumns: TableColumn<LeaveRequestItem>[] = [
    {
      key: 'studentName',
      header: '신청자',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.circle}>{row.studentInitial}</span>
          <span className={S.tit}>{row.studentName}</span>
        </div>
      ),
    },
    { key: 'studentId', header: '학번' },
    {
      key: 'leaveTypeName',
      header: '휴가종류',
      render: (row) => {
        const vacation = vacationTypeMap[row.leaveTypeName as VacationType]

        return (
          <span className={`${S.statusBadge} ${vacation?.className ?? ''}`}>
            {row.leaveTypeName || '기타'}
          </span>
        )
      },
    },
    { key: 'periodText', header: '기간' },
    {
      key: 'approvalStatusName',
      header: '처리상태',
      render: (row) => <span>{row.approvalStatusName}</span>,
    },
    {
      key: 'action',
      header: '처리',
      render: (row) => {
        const isCompleted = row.approvalStatusCode !== 'V001'

        return (
          <div className={S.actionBox}>
            <Button
              type="button"
              variant="active"
              disabled={isCompleted}
              onClick={() => handleApprove(row)}
            >
              <Check size={16} />
              승인
            </Button>

            <Button
              type="button"
              variant="inactive"
              disabled={isCompleted}
              onClick={() => handleReject(row)}
            >
              <X size={16} />
              반려
            </Button>
          </div>
        )
      },
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
            totalCount={leaveTotalCount}
            currentPage={currentPage}
            pageSize={pageSize}
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
