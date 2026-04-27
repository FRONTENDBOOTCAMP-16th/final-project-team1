import DatePicker from '../../components/common/datePicker'
import { Header, Button } from '../../components'
import { Plus, Search, Trash, SquarePen, X, Check, Key } from 'lucide-react'
import { useState } from 'react'

import Table, { type TableColumn } from '../../components/common/table'
import S from '../../components/common/table/table.module.css'

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
    render: (row) => (
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

export default function Samplepage() {
  {/* 달력컴포넌트: Datepicker */}
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
  }
  {/* //달력컴포넌트: Datepicker */}
  
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

  return (
    <div>
      <Header />

      {/* 달력컴포넌트: Datepicker */}
      <h3>1. 달력 컴포넌트 샘플</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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

      <Button variant="dark">
        <Search size={16} />
        검색
      </Button>

      <Button variant="active">
        <Check size={16} />
        승인
      </Button>

      <Button variant="inactive">
        <X size={16} />
        비승인
      </Button>
      {/* //공통 버튼 컴포넌트: lucied-react */}

      <h3>3-1. 학생 관리 테이블</h3>
      <Table columns={studentColumns} data={studentData} />

      <h3>3-2. 출석 관리 테이블</h3>
      <Table columns={attendanceColumns} data={attendanceData} />

      <h3>3-3. 휴가 관리 테이블</h3>
      <Table columns={vacationColumns} data={vacationData} />

      <h3>3-4.공지사항 관리 테이블</h3>
      <Table columns={noticeColumns} data={noticeData} />

      <h3>3-5. 휴가신청 내역 테이블</h3>
      <Table columns={historyColumns} data={historyData} />
    </div>
  )
}
