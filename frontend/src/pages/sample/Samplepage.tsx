import DatePicker from '../../components/common/datePicker'
import Sidebar from '../../components/common/sidebar/Sidebar'
import SearchBar from '../../components/common/search/search'
import ComboBox from '../../components/common/comboBox/customComboBox'
import { Header, Button } from '../../components'
import {
  Plus,
  Search,
  Trash,
  SquarePen,
  X,
  Check,
  Key,
  Clock,
  UserCheck,
  UserX,
  TrendingUp,
  ScrollText,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import CountCard from '../../components/common/countCard/CountCard'
import Pagination from '../../components/common/pagination'

import Table, { type TableColumn } from '../../components/common/table'
import S from '../../components/common/table/table.module.css'
import {
  getAdminDashboardSummary,
  type AdminDashboardData,
} from '@/pages/admin/dashboard/api/dashboardApi'

{
  /* 테이블 컴포넌트 */
}
type StudentStatus = '수료중' | '수료완료' | '중도포기'
type AttendanceStatus = '출석완료' | '지각' | '결석'
type VacationType = '병결' | '공결' | '개인사유'
type VacationResultStatus = '승인' | '반려'

type Student = {
  name: string
  studentNo: string
  course: string
  phone: string
  status: StudentStatus
}

type Attendance = {
  name: string
  studentNo: string
  enterTime: string
  leaveTime: string
  attendanceStatus: AttendanceStatus
}

type Vacation = {
  name: string
  studentNo: string
  vacationType: VacationType
  period: string
}

type Notice = {
  no: string
  title: string
  createdAt: string
  isPublic: boolean
}

type VacationHistory = {
  name: string
  studentNo: string
  reason: '병결' | '공결' | '개인사유'
  period: string
  status: VacationResultStatus
}

const studentStatusMap = {
  수료중: {
    label: '수료중',
    className: S.statusProgress,
  },
  수료완료: {
    label: '수료완료',
    className: S.statusComplete,
  },
  중도포기: {
    label: '중도포기',
    className: S.statusDrop,
  },
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

const noticeColumns: TableColumn<Notice>[] = [
  { key: 'no', header: '번호' },
  { key: 'title', header: '제목' },
  { key: 'createdAt', header: '작성일' },
  {
    key: 'isPublic',
    header: '공개여부',
    render: () => (
      <div className={S.actionBox}>
        <Button type="button" variant="active">
          <Check size={16} />
          공개
        </Button>

        <Button type="button" variant="inactive">
          <X size={16} />
          비공개
        </Button>
      </div>
    ),
  },
]

const resultStatusMap = {
  승인: {
    icon: <Check size={14} />,
    className: S.resultSuccess,
  },
  반려: {
    icon: <X size={14} />,
    className: S.resultReject,
  },
}
{
  /* //테이블 컴포넌트 */
}

export default function LoginPage() {
  {
    /* 달력컴포넌트: Datepicker */
  }
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
  }
  {
    /* //달력컴포넌트: Datepicker */
  }

  {
    /* 카운트 카드 컴포넌트 */
  }
  const [summary, setSummary] = useState<AdminDashboardData | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getAdminDashboardSummary()
        console.log('대시보드 API 데이터:', data)
        setSummary(data)
      } catch (error) {
        console.error('대시보드 API 실패:', error)
      }
    }

    fetchSummary()
  }, [])

  {
    /* //카운트 카드 컴포넌트 */
  }

  {
    /* 페이지네이션 컴포넌트 */
  }
  const [currentPage, setCurrentPage] = useState(1)
  {
    /* //페이지네이션 컴포넌트 */
  }

  {
    /* 테이블 컴포넌트 */
  }
  const studentColumns: TableColumn<Student>[] = [
    {
      key: 'name',
      header: '이름',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.circle}>{row.name[0]}</span>
          <span className={S.tit}>{row.name}</span>
        </div>
      ),
    },
    { key: 'studentNo', header: '학번' },
    { key: 'course', header: '강의명' },
    { key: 'phone', header: '연락처' },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const status = studentStatusMap[row.status]

        return <span className={`${S.statusBadge} ${status.className}`}>{status.label}</span>
      },
    },
    {
      key: 'detail',
      header: '관리',
      render: () => (
        <Button type="button" variant="detail">
          <Key size={16} />
          상세보기
        </Button>
      ),
    },
  ]

  const attendanceColumns: TableColumn<Attendance>[] = [
    {
      key: 'name',
      header: '이름',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.circle}>{row.name[0]}</span>
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
      render: () => (
        <div className={S.actionBox}>
          <Button type="button" variant="active">
            <Check size={16} />
            승인
          </Button>

          <Button type="button" variant="inactive">
            <X size={16} />
            반려
          </Button>
        </div>
      ),
    },
  ]

  const historyColumns: TableColumn<VacationHistory>[] = [
    {
      key: 'name',
      header: '이름',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.circle}>{row.name[0]}</span>
          <span className={S.tit}>{row.name}</span>
        </div>
      ),
    },
    { key: 'studentNo', header: '학번' },
    {
      key: 'reason',
      header: '사유',
      render: (row) => {
        const type = vacationTypeMap[row.reason]

        return <span className={`${S.statusBadge} ${type.className}`}>{row.reason}</span>
      },
    },
    { key: 'period', header: '날짜' },
    {
      key: 'status',
      header: '처리',
      render: (row) => {
        const result = resultStatusMap[row.status]

        return <span className={`${S.resultIcon} ${result.className}`}>{result.icon}</span>
      },
    },
  ]

  const studentData: Student[] = [
    {
      name: '김민수',
      studentNo: '2024001',
      course: '웹 개발 기초 과정',
      phone: '010-1234-5678',
      status: '수료중',
    },
    {
      name: '황재호',
      studentNo: '2024002',
      course: '모바일 앱 개발',
      phone: '010-2222-3333',
      status: '수료완료',
    },
    {
      name: '정호영',
      studentNo: '2024003',
      course: 'UI/UX 디자인 심화',
      phone: '010-4444-5555',
      status: '중도포기',
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

  const noticeData: Notice[] = [
    {
      no: '01',
      title: '공지사항 제목을 입력해주세요',
      createdAt: '2026.04.20',
      isPublic: true,
    },
    {
      no: '02',
      title: '공지사항 제목을 입력해주세요',
      createdAt: '2026.04.20',
      isPublic: false,
    },
  ]

  const historyData: VacationHistory[] = [
    {
      name: '김민수',
      studentNo: '2024001',
      reason: '공결',
      period: '00.00 - 00.00',
      status: '승인',
    },
    {
      name: '황재호',
      studentNo: '2024001',
      reason: '병결',
      period: '00.00 - 00.00',
      status: '반려',
    },
  ]
  {
    /* // 테이블 컴포넌트 */
  }

  return (
    <div>
      <Header />
      {/* // 헤더 컴포넌트 */}

      {/* 달력컴포넌트: Datepicker */}
      <h3>1. 달력 컴포넌트 샘플</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* DatePicker는 width:100% 기준, 실제 크기는 부모에서 제어 */}
        <DatePicker value={startDate} onChange={handleStartChange} placeholder="0000-00-00" />
        <span>-</span>
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || undefined}
          placeholder="0000-00-00"
        />
      </div>
      {/* 달력컴포넌트: Datepicker */}

      {/* 공통 버튼 컴포넌트: lucied-react */}
      <h3>2. 버튼 컴포넌트 샘플</h3>
      <Button variant="primary">
        <Plus size={16} />
        신규 강의등록
      </Button>

      <Button variant="primary">
        <SquarePen size={16} />
        글쓰기
      </Button>

      <Button variant="blank">
        <Trash size={16} />
        공지사항 삭제
      </Button>
      <Button variant="dark" size="md">
        <Search size={16} />
        검색
      </Button>
      <Button variant="dark" size="lg">
        <Key size={16} />
        비밀번호 변경
      </Button>
      <Button variant="success">출석</Button>
      <Button variant="warning">지각</Button>
      <Button variant="error">결석</Button>
      <Button variant="blank">전체</Button>
      <Button variant="active" size="xs">
        <Check size={16} />
        승인
      </Button>
      <Button variant="inactive" size="xs">
        <X size={16} />
        비승인
      </Button>
      <Button variant="detail" size="sm">
        <Key size={16} />
        상세보기
      </Button>

      {/* 사이드바 컴포넌트 */}
      <h3 style={{ textAlign: 'left' }}>3. 사이드바 컴포넌트 샘플</h3>

      <div style={{ display: 'flex' }}>
        <div>
          <strong>관리자용</strong>
          <Sidebar role="admin" />
        </div>
        <div>
          <strong>학생용</strong>
          <Sidebar role="student" />
        </div>
      </div>
      {/* //사이드바 컴포넌트 */}

      {/* 카운트 카드 컴포넌트 */}
      <h3 style={{ textAlign: 'left' }}>4. 카운트 카드 컴포넌트 샘플</h3>
      <div style={{ display: 'flex', gap: '16px' }}>
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
      </div>
      {/* //카운트 카드 컴포넌트 */}

      {/* 검색바/콤보박스 컴포넌트 샘플 */}
      <h3 style={{ textAlign: 'left' }}>5. 검색바/콤보박스 컴포넌트 샘플</h3>

      <ComboBox
        options={['커스텀 옵션 1', '커스텀 옵션 2', '커스텀 옵션 3']}
        placeholder="커스텀 콤보박스 선택"
      />
      <SearchBar placeholder="강의검색" />
      <SearchBar placeholder="강의명을 입력하세요" />
      {/* //검색바/콤보박스 컴포넌트 샘플 */}

      {/* 페이지네이션 컴포넌트 */}
      <h3 style={{ textAlign: 'left' }}>5. 페이지네이션 컴포넌트 샘플</h3>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>
      {/* //페이지네이션 컴포넌트 */}

      {/* 테이블 컴포넌트 */}
      <h3>6-1. 학생 관리 테이블</h3>
      <Table columns={studentColumns} data={studentData} />

      <h3>6-2. 출석 관리 테이블</h3>
      <Table columns={attendanceColumns} data={attendanceData} />

      <h3>6-3. 휴가 관리 테이블</h3>
      <Table columns={vacationColumns} data={vacationData} />

      <h3>6-4.공지사항 관리 테이블</h3>
      <Table columns={noticeColumns} data={noticeData} />

      <h3>6-5. 휴가신청 내역 테이블</h3>
      <Table columns={historyColumns} data={historyData} />
      {/* // 테이블 컴포넌트 */}
    </div>
  )
}
