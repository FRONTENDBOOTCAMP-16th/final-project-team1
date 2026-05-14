import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button'
import CommonTable from '@/components/common/table/Table'
import Pagination from '@/components/common/pagination'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { TableColumn } from '@/components/common/table/table.types'
import { Plus } from 'lucide-react'
import { getLeaveList } from './api/leaveApi'
import type { LeaveItem } from './api/leaveApi'
import { useAuthStore } from '@/store'
import S from './styles/leave.module.css'

const statusMap: Record<string, { className: string }> = {
  V001: { className: S.statusPending },
  V002: { className: S.statusApproved },
  V003: { className: S.statusRejected },
}

function LeaveListPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [leaveList, setLeaveList] = useState<LeaveItem[]>([])
  const [totalCount, setTotalCount] = useState(0)

  // 변경 전: localStorage.getItem('studentId') || ''
  const studentId = useAuthStore((state) => state.user?.userId) || ''
  const totalPages = Math.ceil(totalCount / 10)

  useEffect(() => {
    const fetchLeaveList = async () => {
      try {
        setIsLoading(true)
        const data = await getLeaveList({
          // studentId,
          page: currentPage,
          size: 10,
          statusCode: statusFilter || undefined,
        })
        setLeaveList(data.items)
        setTotalCount(data.totalCount)
      } catch (err) {
        console.error('휴가 목록 조회 실패:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (studentId) fetchLeaveList()
  }, [currentPage, statusFilter, studentId])

  const historyColumns: TableColumn<LeaveItem>[] = [
    { key: 'studentId', header: '학번' },
    {
      key: 'leaveTypeName',
      header: '종류',
      render: (row) => (
        <span className={`${S.statusBadge} ${S.reasonPersonal}`}>{row.leaveTypeName}</span>
      ),
    },
    {
      key: 'startDate',
      header: '휴가기간',
      render: (row) => (
        <span>
          {row.startDate} ~ {row.endDate}
        </span>
      ),
    },
    {
      key: 'approvalStatusName',
      header: '처리상태',
      render: (row) => {
        const result = statusMap[row.approvalStatusCode]
        return (
          <span className={`${S.statusBadge} ${result?.className}`}>{row.approvalStatusName}</span>
        )
      },
    },
  ]

  return (
    <div className={S.leaveContainer}>
      <StudentLayout>
        <div className={S.ButtonBox}>
          <div className={S.leftButton}>
            {[
              { label: '전체', code: '' },
              { label: '승인 대기', code: 'V001' },
              { label: '승인 완료', code: 'V002' },
              { label: '반려', code: 'V003' },
            ].map((option) => (
              <Button
                key={option.code}
                variant={statusFilter === option.code ? 'dark' : 'blank'}
                onClick={() => {
                  setStatusFilter(option.code)
                  setCurrentPage(1)
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className={S.rightButton}>
            <Button variant="primary" onClick={() => navigate('/student/leave/request')}>
              <Plus size={16} />
              휴가신청 하기
            </Button>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={4} />
        ) : (
          <CommonTable
              columns={historyColumns}
              data={leaveList}
              rowKey={(row) => row.leaveRequestId}
          />
        )}

        <div className={S.paginationBox}>
    <span>
        총 {totalCount}건 중{' '}
        {totalCount === 0 ? 0 : (currentPage - 1) * 10 + 1} -{' '}
        {Math.min(currentPage * 10, totalCount)}건 표시
    </span>
    <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
    />
</div>
      </StudentLayout>
    </div>
  )
}

export default LeaveListPage
