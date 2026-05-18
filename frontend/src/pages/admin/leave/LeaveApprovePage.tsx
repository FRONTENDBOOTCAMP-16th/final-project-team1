// 외부 라이브러리
import { useCallback, useMemo, useState } from 'react'
import { FileText, Check, X } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// 공통 컴포넌트
import { Button } from '@/components'
import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'
import Modal from '@/components/common/modal/Modal'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'

// 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// 페이지 내부 컴포넌트 / 타입 / API / 스타일
import LeaveStatusTabs from '@/pages/admin/leave/components/LeaveStatusTabs'
import type { TabType } from '@/pages/admin/leave/components/leaveStatusTabs.type'
import { getRecentLeaveRequests, updateLeaveRequestStatus } from './api/leaveApi'
import S from '@/pages/admin/leave/styles/leave.module.css'

/** 한 페이지에 보여줄 데이터 개수 */
const PAGE_SIZE = 10

/** 서버에서 내려오는 휴가 신청 데이터 구조 */
type LeaveApiItem = {
  leaveRequestId: number
  studentInitial: string
  studentName: string
  studentId: string
  leaveTypeCode: string
  leaveTypeName: string
  startDate: string
  endDate: string
  approvalStatusCode: string
  approvalStatusName: string
}

/** 휴가 종류별 배지 스타일 */
const vacationTypeMap: Record<string, { label: string; className: string }> = {
  병결: { label: '병결', className: S.vacationSick },
  공결: { label: '공결', className: S.vacationOfficial },
  개인사유: { label: '개인사유', className: S.vacationPersonal },
}

/** 서버 상태명과 프론트 탭 값을 연결 */
const statusMap: Record<string, TabType> = {
  '승인 대기': 'pending',
  '승인 완료': 'approved',
  반려: 'rejected',
}

/** 상태 코드 매핑 */
const statusCodeMap: Record<TabType, string> = {
  pending: 'V001',
  approved: 'V002',
  rejected: 'V003',
}

/** 상태 이름 매핑 */
// const statusNameMap: Record<TabType, string> = {
//   pending: '승인 대기',
//   approved: '승인 완료',
//   rejected: '반려',
// }

export default function LeaveApprovePage() {
  /** 현재 선택된 탭 */
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  /** 현재 페이지 번호 */
  const [currentPage, setCurrentPage] = useState(1)

  /** 승인/반려 처리 중인 행 ID */
  const [processingId, setProcessingId] = useState<number | null>(null)

  /** 승인 및 반려 처리 팝업 */
  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  /** React Query 캐시 제어 */
  const queryClient = useQueryClient()

  /** 휴가 신청 목록 조회 */
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<LeaveApiItem[]>({
    queryKey: ['leaveRequests'],
    queryFn: getRecentLeaveRequests,
  })

  /** 승인 / 반려 상태 변경 mutation */
  const updateStatusMutation = useMutation({
    mutationFn: ({ leaveRequestId, nextStatus }: { leaveRequestId: number; nextStatus: TabType }) =>
      updateLeaveRequestStatus(leaveRequestId, statusCodeMap[nextStatus]),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['leaveRequests'],
      })

      setModalMessage(variables.nextStatus === 'approved' ? '승인 되었습니다.' : '반려 되었습니다.')
      setOpen(true)
    },

    onError: (e) => {
      console.error('상태 변경 실패:', e)
      setModalMessage(e instanceof Error ? e.message : '처리에 실패했습니다.')
      setOpen(true)
    },

    onSettled: () => {
      setProcessingId(null)
    },
  })

  /** 탭 변경 시 첫 페이지로 이동 */
  const handleChangeTab = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  /** 승인 / 반려 상태 변경 */
  const handleUpdateStatus = useCallback(
    (leaveRequestId: number, nextStatus: TabType) => {
      if (processingId !== null) return

      setProcessingId(leaveRequestId)

      updateStatusMutation.mutate({
        leaveRequestId,
        nextStatus,
      })
    },
    [processingId, updateStatusMutation],
  )

  /**
   * 상태별 데이터 묶음
   *
   * 기존에는 pending, approved, rejected 개수를 구할 때마다
   * data.filter()를 여러 번 실행했음.
   *
   * useMemo로 data가 바뀔 때만 다시 계산하게 개선.
   */
  const groupedData = useMemo(() => {
    const result: Record<TabType, LeaveApiItem[]> = {
      pending: [],
      approved: [],
      rejected: [],
    }

    data.forEach((item) => {
      const tab = statusMap[item.approvalStatusName]

      if (tab) {
        result[tab].push(item)
      }
    })

    return result
  }, [data])

  /** 현재 탭에 해당하는 데이터 */
  const currentData = groupedData[activeTab]

  /** 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(currentData.length / PAGE_SIZE))

  /** 현재 페이지에 보여줄 데이터 */
  const pagedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = currentPage * PAGE_SIZE

    return currentData.slice(startIndex, endIndex)
  }, [currentData, currentPage])

  /** 상단 요약 카드 데이터 */
  const noticeSummaryCards: SummaryCard[] = useMemo(
    () => [
      {
        label: '승인 대기',
        count: groupedData.pending.length,
        color: 'orange',
        icon: <FileText size={20} />,
      },
      {
        label: '승인 완료',
        count: groupedData.approved.length,
        color: 'green',
        icon: <Check size={20} />,
      },
      {
        label: '반려 내역',
        count: groupedData.rejected.length,
        color: 'red',
        icon: <X size={20} />,
      },
    ],
    [groupedData],
  )

  /** 테이블 컬럼 */
  const vacationColumns: TableColumn<LeaveApiItem>[] = useMemo(
    () => [
      {
        key: 'studentName',
        header: '신청자',
        render: (row) => (
          <div className={S.nameBox}>
            <span className={S.tit}>{row.studentName}</span>
          </div>
        ),
      },
      { key: 'studentId', header: '학번' },
      {
        key: 'leaveTypeName',
        header: '휴가종류',
        render: (row) => {
          const vacation = vacationTypeMap[row.leaveTypeName] ?? vacationTypeMap['개인사유']

          return <span className={`${S.statusBadge} ${vacation.className}`}>{vacation.label}</span>
        },
      },
      {
        key: 'startDate',
        header: '기간',
        render: (row) => `${row.startDate} - ${row.endDate}`,
      },
      {
        key: 'action',
        header: activeTab === 'pending' ? '처리' : '처리내역',
        render: (row) => {
          const isProcessing = processingId === row.leaveRequestId

          if (activeTab === 'pending') {
            return (
              <div className={S.actionBox}>
                <Button
                  type="button"
                  variant="active"
                  disabled={processingId !== null}
                  onClick={() => handleUpdateStatus(row.leaveRequestId, 'approved')}
                >
                  <Check size={16} /> {isProcessing ? '처리중' : '승인'}
                </Button>

                <Button
                  type="button"
                  variant="inactive"
                  disabled={processingId !== null}
                  onClick={() => handleUpdateStatus(row.leaveRequestId, 'rejected')}
                >
                  <X size={16} /> {isProcessing ? '처리중' : '반려'}
                </Button>
              </div>
            )
          }

          if (activeTab === 'approved') {
            return (
              <Button type="button" variant="active" disabled>
                <Check size={16} /> 승인
              </Button>
            )
          }

          return (
            <Button type="button" variant="inactive" disabled>
              <X size={16} /> 반려
            </Button>
          )
        },
      },
    ],
    [activeTab, processingId, handleUpdateStatus],
  )

  return (
    <AdminLayout>
      <div className={S.page}>
        <main className={S.main}>
          <section>
            <StatusSummary cards={noticeSummaryCards} />
          </section>

          <section className={S.content}>
            <LeaveStatusTabs activeTab={activeTab} onChange={handleChangeTab} />

            <div className={S.tableBox}>
              {isLoading ? (
                <div className={S.skeletonWrapper}>
                  <TableSkeleton
                    columns={[
                      { header: '신청자', width: '25%' },
                      { header: '학번', width: '20%' },
                      { header: '휴가종류', width: '20%' },
                      { header: '기간', width: '20%' },
                      { header: '처리', width: '15%' },
                    ]}
                    rows={PAGE_SIZE}
                  />
                </div>
              ) : isError ? (
                <div className={S.empty}>데이터를 불러오는데 실패했습니다.</div>
              ) : (
                <Table columns={vacationColumns} data={pagedData} />
              )}
            </div>

            {!isLoading && !isError && (
              <div className={S.table_footer}>
                <span>
                  총 {currentData.length}건 중{' '}
                  {currentData.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
                  {Math.min(currentPage * PAGE_SIZE, currentData.length)}건 표시
                </span>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </section>
        </main>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        buttonType="one"
      >
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
