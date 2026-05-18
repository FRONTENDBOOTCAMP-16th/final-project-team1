// 외부 라이브러리
import { useMemo, useState } from 'react'
import { TrendingUp, UserCheck, Clock, UserX } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

// 공통 컴포넌트
import { Button } from '@/components'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
import DatePicker from '@/components/common/datePicker'
import CountCard from '@/components/common/countCard/CountCard'

// 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// API / 스타일
import {
  getAttendanceList,
  type AttendanceApiItem,
} from '@/pages/admin/attendance/api/attendanceApi'
import S from './styles/attendance.module.css'

/** 한 페이지에 보여줄 데이터 개수 */
const PAGE_SIZE = 10

type AttendanceStatus = '출석완료' | '지각' | '결석'
type FilterStatus = AttendanceStatus | '전체'

/** 출결 상태 스타일 */
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

/** 날짜 포맷 변환 */
function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function AttendanceListPage() {
  /** 현재 페이지 번호 */
  const [currentPage, setCurrentPage] = useState(1)

  /** 시작 날짜 */
  const [startDate, setStartDate] = useState<Date | null>(null)

  /** 종료 날짜 */
  const [endDate, setEndDate] = useState<Date | null>(null)

  /** 선택된 출결 상태 */
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('전체')

  /** API 요청에 사용할 시작 날짜 */
  const startDateValue = startDate ? formatDate(startDate) : undefined

  /** API 요청에 사용할 종료 날짜 */
  const endDateValue = endDate ? formatDate(endDate) : undefined

  /** 출결 목록 조회 */
  const {
    data: attendanceData = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery<AttendanceApiItem[]>({
    queryKey: ['attendanceList', startDateValue, endDateValue],
    queryFn: () =>
      getAttendanceList({
        startDate: startDateValue,
        endDate: endDateValue,
        page: 1,
        size: 100,
      }),
  })

  /** 시작 날짜 변경 */
  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
    setCurrentPage(1)
  }

  /** 종료 날짜 변경 */
  const handleEndChange = (date: Date | null) => {
    setEndDate(date)
    setCurrentPage(1)
  }

  /** 출석 인원 수 */
  const presentCount = useMemo(() => {
    return attendanceData.filter((item) => item.attendanceStatusName === '출석완료').length
  }, [attendanceData])

  /** 지각 인원 수 */
  const lateCount = useMemo(() => {
    return attendanceData.filter((item) => item.attendanceStatusName === '지각').length
  }, [attendanceData])

  /** 결석 인원 수 */
  const absentCount = useMemo(() => {
    return attendanceData.filter((item) => item.attendanceStatusName === '결석').length
  }, [attendanceData])

  /** 출석률 계산 */
  const attendanceRate = useMemo(() => {
    if (attendanceData.length === 0) return 0

    return Math.round(((presentCount + lateCount) / attendanceData.length) * 100)
  }, [attendanceData.length, presentCount, lateCount])

  /** 상태 필터링된 출결 목록 */
  const filteredAttendances = useMemo(() => {
    if (selectedStatus === '전체') {
      return attendanceData
    }

    return attendanceData.filter((item) => item.attendanceStatusName === selectedStatus)
  }, [attendanceData, selectedStatus])

  /** 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(filteredAttendances.length / PAGE_SIZE))

  /** 현재 페이지에 보여줄 출결 목록 */
  const pagedAttendances = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    return filteredAttendances.slice(start, end)
  }, [filteredAttendances, currentPage])

  /** 테이블 컬럼 */
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
        const statusName = row.attendanceStatusName as AttendanceStatus
        const status = attendanceStatusMap[statusName]

        if (!status) {
          return <span className={S.statusBadge}>{row.attendanceStatusName}</span>
        }

        return <span className={`${S.statusBadge} ${status.className}`}>{status.label}</span>
      },
    },
  ]

  /** 로딩 표시 여부 */
  const showLoading = isLoading || isFetching

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
        {showLoading ? (
          <div className={S.skeletonWrapper}>
            <TableSkeleton
              columns={[
                { header: '이름', width: '16%' },
                { header: '출석일', width: '16%' },
                { header: '학번', width: '18%' },
                { header: '입실시간', width: '16%' },
                { header: '퇴실시간', width: '16%' },
                { header: '출결상태', width: '18%' },
              ]}
              rows={PAGE_SIZE}
            />
          </div>
        ) : isError ? (
          <div className={S.empty}>데이터를 불러오는데 실패했습니다.</div>
        ) : (
          <Table columns={attendanceColumns} data={pagedAttendances} />
        )}

        {!showLoading && !isError && (
          <div className={S.table_footer}>
            <span>
              총 {filteredAttendances.length}명 중{' '}
              {filteredAttendances.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
              {Math.min(currentPage * PAGE_SIZE, filteredAttendances.length)}명 표시
            </span>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </AdminLayout>
  )
}
