// 외부 라이브러리
import { useEffect, useState } from 'react'
import { FileText, Check, X } from 'lucide-react'

// 공통 컴포넌트
import { Button } from '@/components'
import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'

// 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// 페이지 내부 컴포넌트 / 타입 / API / 스타일
import LeaveStatusTabs from '@/pages/admin/leave/components/LeaveStatusTabs'
import type { TabType } from '@/pages/admin/leave/components/leaveStatusTabs.type'
import { getRecentLeaveRequests, updateLeaveRequestStatus } from './api/leaveApi'
import S from '@/pages/admin/leave/styles/leave.module.css'

/** 한 페이지에 보여줄 개수 */
const PAGE_SIZE = 10

/** 화면에서 사용할 휴가 타입 */
type VacationType = '병결' | '공결' | '개인사유'

/** 화면에서 사용할 데이터 구조 */
type Vacation = {
  leaveRequestId: number
  name: string
  studentNo: string
  vacationType: VacationType
  period: string
  status: TabType
}

/** 서버에서 내려오는 데이터 구조 */
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

/** 휴가 타입별 스타일 */
const vacationTypeMap = {
  병결: { label: '병결', className: S.vacationSick },
  공결: { label: '공결', className: S.vacationOfficial },
  개인사유: { label: '개인사유', className: S.vacationPersonal },
}

/** 서버 승인 상태값 -> 프론트 탭 상태값 */
const statusMap: Record<string, TabType> = {
  '승인 대기': 'pending',
  '승인 완료': 'approved',
  반려: 'rejected',
}

/** 서버 휴가 타입값 -> 화면 휴가 타입값 */
const vacationTypeMapSafe: Record<string, VacationType> = {
  병결: '병결',
  공결: '공결',
  개인사유: '개인사유',
}

/** API 데이터 -> 화면용 데이터 변환 */
const mapToVacation = (item: LeaveApiItem): Vacation => ({
  leaveRequestId: item.leaveRequestId,
  name: item.studentName,
  studentNo: item.studentId,
  vacationType: vacationTypeMapSafe[item.leaveTypeName] ?? '개인사유',
  period: `${item.startDate} - ${item.endDate}`,
  status: statusMap[item.approvalStatusName] ?? 'pending',
})

export default function LeaveApprovePage() {
  /** 전체 휴가 신청 데이터 */
  const [data, setData] = useState<Vacation[]>([])

  /** 현재 선택된 탭 */
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  /** 현재 페이지 */
  const [currentPage, setCurrentPage] = useState(1)

  /** 최초 진입 시 API 호출 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRecentLeaveRequests()
        const mapped = result.map(mapToVacation)

        setData(mapped)
      } catch (e: unknown) {
        console.error('데이터 조회 실패:', e)
        alert('데이터를 불러오는데 실패했습니다.')
      }
    }

    fetchData()
  }, [])

  /** 탭 변경 시 1페이지로 초기화 */
  const handleChangeTab = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  /** 상태 변경 처리 */
  const handleUpdateStatus = async (leaveRequestId: number, nextStatus: TabType) => {
    try {
      const statusCodeMap: Record<TabType, string> = {
        pending: 'V001',
        approved: 'V002',
        rejected: 'V003',
      }

      await updateLeaveRequestStatus(leaveRequestId, statusCodeMap[nextStatus])

      setData((prev) =>
        prev.map((item) =>
          item.leaveRequestId === leaveRequestId ? { ...item, status: nextStatus } : item,
        ),
      )
    } catch (e: unknown) {
      console.error('상태 변경 실패:', e)

      if (e instanceof Error) {
        alert(e.message)
      } else {
        alert('처리에 실패했습니다.')
      }
    }
  }

  /** 상태별 개수 계산 */
  const pendingCount = data.filter((item) => item.status === 'pending').length
  const approvedCount = data.filter((item) => item.status === 'approved').length
  const rejectedCount = data.filter((item) => item.status === 'rejected').length

  /** 상단 요약 카드 데이터 */
  const noticeSummaryCards: SummaryCard[] = [
    {
      label: '승인 대기',
      count: pendingCount,
      color: 'orange',
      icon: <FileText size={20} />,
    },
    {
      label: '승인 완료',
      count: approvedCount,
      color: 'green',
      icon: <Check size={20} />,
    },
    {
      label: '반려 내역',
      count: rejectedCount,
      color: 'red',
      icon: <X size={20} />,
    },
  ]

  /** 현재 탭에 맞는 전체 데이터 */
  const currentData = data.filter((item) => item.status === activeTab)

  /** 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(currentData.length / PAGE_SIZE))

  /** 현재 페이지에 보여줄 데이터 */
  const pagedData = currentData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  /** 처리 버튼 컬럼 */
  const actionColumn: TableColumn<Vacation> = {
    key: 'action',
    header: '처리',
    render: (row) => {
      if (activeTab === 'pending') {
        return (
          <div className={S.actionBox}>
            <Button
              type="button"
              variant="active"
              onClick={() => handleUpdateStatus(row.leaveRequestId, 'approved')}
            >
              <Check size={16} /> 승인
            </Button>

            <Button
              type="button"
              variant="inactive"
              onClick={() => handleUpdateStatus(row.leaveRequestId, 'rejected')}
            >
              <X size={16} /> 반려
            </Button>
          </div>
        )
      }

      if (activeTab === 'approved') {
        return (
          <Button type="button" variant="active">
            <Check size={16} /> 승인
          </Button>
        )
      }

      return (
        <Button type="button" variant="inactive">
          <X size={16} /> 반려
        </Button>
      )
    },
  }

  /** 테이블 컬럼 */
  const vacationColumns: TableColumn<Vacation>[] = [
    {
      key: 'name',
      header: '신청자',
      render: (row) => (
        <div className={S.nameBox}>
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
    actionColumn,
  ]

  return (
    <AdminLayout>
      <div className={S.page}>
        <main className={S.main}>
          <section>
            <StatusSummary cards={noticeSummaryCards} />
          </section>

          <section className={S.content}>
            <LeaveStatusTabs activeTab={activeTab} onChange={handleChangeTab} />

            <Table
              columns={vacationColumns}
              data={pagedData}
            />

            <div className={S.table_footer}>
              <span>
                총 {currentData.length}명 중{' '}
                {currentData.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(currentPage * PAGE_SIZE, currentData.length)}명 표시
              </span>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </main>
      </div>
    </AdminLayout>
  )
}
