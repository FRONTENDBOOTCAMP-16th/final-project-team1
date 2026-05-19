import AdminLayout from '@/pages/sample/AdminLayout'
import { useState } from 'react'
import { Clock, ScrollText, TrendingUp, UserCheck, UserX, Check, X } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import CountCard from '@/components/common/countCard/CountCard'
import {
  getAdminDashboardSummary,
  getAttendanceStatusByClass,
  getNoticeList,
  getLeaveRequestList,
  updateLeaveRequestStatus,
  type LeaveRequestItem,
} from '@/pages/admin/dashboard/api/dashboardApi'
import AttendanceStatusChart from '@/pages/admin/dashboard/components/AttendanceStatusChart'
import SystemNoticeList from './components/NoticeList'
import Table, { type TableColumn } from '@/components/common/table'
import { Button } from '@/components'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'

import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

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
  const [processingId, setProcessingId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  //휴가 신청 현황

  const { data: vacationData = [], isLoading: isLeaveLoading } = useQuery({
    queryKey: ['admin-dashboard-leave-requests'],
    queryFn: async () => {
      const data = await getLeaveRequestList(1, 50)

      return [...data.items]
        .filter((item) => item.approvalStatusCode === 'V001')
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        .slice(0, 5)
    },
  })

  //공지사항 리스트

  const { data: noticeData = [], isLoading: isNoticeLoading } = useQuery({
    queryKey: ['admin-dashboard-notices'],
    queryFn: getNoticeList,
  })

  //출결 현황 그래프
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard-data'],
    queryFn: async () => {
      const [summaryData, attendanceData] = await Promise.all([
        getAdminDashboardSummary(),
        getAttendanceStatusByClass(),
      ])

      return {
        summary: summaryData,
        attendanceData,
      }
    },
  })

  const summary = dashboardData?.summary
  const attendanceData = dashboardData?.attendanceData ?? []

  //휴가 신청 승인/반려
  const handleApprove = async (row: LeaveRequestItem) => {
    try {
      setProcessingId(row.leaveRequestId)

      await updateLeaveRequestStatus(row.leaveRequestId, 'V002')

      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard-leave-requests'],
      })
    } catch (error) {
      console.error('휴가 승인 처리 실패:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (row: LeaveRequestItem) => {
    try {
      setProcessingId(row.leaveRequestId)

      await updateLeaveRequestStatus(row.leaveRequestId, 'V003')

      await queryClient.invalidateQueries({
        queryKey: ['admin-dashboard-leave-requests'],
      })
    } catch (error) {
      console.error('휴가 반려 처리 실패:', error)
    } finally {
      setProcessingId(null)
    }
  }
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
        return (
          <div className={S.actionBox}>
            <Button
              type="button"
              variant="active"
              onClick={() => handleApprove(row)}
              disabled={processingId === row.leaveRequestId}
            >
              <Check size={16} />
              {processingId === row.leaveRequestId ? '...' : '승인'}
            </Button>

            <Button
              type="button"
              variant="inactive"
              onClick={() => handleReject(row)}
              disabled={processingId === row.leaveRequestId}
            >
              <X size={16} />
              {processingId === row.leaveRequestId ? '...' : '반려'}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <AdminLayout>
      <div className={S.dashboardWrapper}>
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
              value={(summary?.presentCount ?? 0) + (summary?.lateCount ?? 0)}
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
                {isLoading ? (
                  <>
                    <Skeleton width={180} height={24} borderRadius={8} />
                    <div style={{ marginTop: '24px' }}>
                      <Skeleton height={280} borderRadius={16} />
                    </div>
                  </>
                ) : (
                  <AttendanceStatusChart data={attendanceData} />
                )}
              </div>
            </section>
            <section className={S.noticeSection}>
              <div className={S.container}>
                {isNoticeLoading ? (
                  <TableSkeleton rows={5} columns={2} />
                ) : (
                  <SystemNoticeList data={noticeData} />
                )}
              </div>
            </section>
          </div>
          <section className={S.recentLeave}>
            <div className={S.header}>
              <h3>최근 휴가 신청 내역</h3>
              <p className={S.description}>최근 등록된 5개 내역만 표시됩니다.</p>
            </div>
            <div className={S.tableBox}>
              {isLeaveLoading ? (
                <div className={S.tableSkeletonBox}>
                  <TableSkeleton
                    columns={[
                      { header: '신청자', width: '15%' },
                      { header: '학번', width: '13%' },
                      { header: '휴가종류', width: '13%' },
                      { header: '기간', width: '25%' },
                      { header: '처리상태', width: '12%' },
                      { header: '처리', width: '15%' },
                    ]}
                    rows={5}
                  />
                </div>
              ) : (
                <Table
                  columns={vacationColumns}
                  data={vacationData.slice(0, 5)}
                  totalCount={5}
                  countLabel="명"
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
