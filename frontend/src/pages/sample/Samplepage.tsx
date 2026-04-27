import DatePicker from '../../components/common/datePicker'
import Sidebar from '../../components/common/sidebar/Sidebar'
import SearchBar from '../../components/common/search/search'
import ComboBox from '../../components/common/comboBox/comboBox'
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
import CustomComboBox from '../../components/common/comboBox/customComboBox'

import CountCard from '../../components/common/countCard/CountCard'
import Pagination from '../../components/common/pagination'

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
  const countCardData = {
    attendaceRate: 92.74,
    presentCount: 230,
    lateCount: 16,
    absentCount: 2,
    leavePendingCount: 14,
  }

  // useEffect(( => {
  //   나중에 연결
  // },[]))
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
          value={countCardData.attendaceRate}
          unit="%"
          icon={<TrendingUp />}
          variant="gray"
        />
        <CountCard
          label="출석완료"
          value={countCardData.presentCount}
          unit="명"
          icon={<UserCheck />}
          variant="green"
        />
        <CountCard
          label="지각인원"
          value={countCardData.lateCount}
          unit="명"
          icon={<Clock />}
          variant="yellow"
        />
        <CountCard
          label="결석인원"
          value={countCardData.absentCount}
          unit="명"
          icon={<UserX />}
          variant="red"
        />
        <CountCard
          label="휴가승인대기"
          value={countCardData.leavePendingCount}
          unit="명"
          icon={<ScrollText />}
          variant="orange"
        />
      </div>
      {/* //카운트 카드 컴포넌트 */}

      {/* 검색바/콤보박스 컴포넌트 샘플 */}
      <h3 style={{ textAlign: 'left' }}>4. 검색바/콤보박스 컴포넌트 샘플</h3>

      <ComboBox options={['옵션 1', '옵션 2', '옵션 3']} placeholder="콤보박스 선택" />
      <CustomComboBox
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
    </div>
  )
}
