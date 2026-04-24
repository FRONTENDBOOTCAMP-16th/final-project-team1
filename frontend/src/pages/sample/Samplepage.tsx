import DatePicker from '../../components/common/datePicker'
import { Header, Button } from '../../components'
import { Plus, Search, Trash, SquarePen, X, Check, Key } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../../components/common/sidebar/Sidebar'

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

      <Button variant="dark">
        <Search size={16} />
        검색
      </Button>
      <Button variant="dark">
        <Key size={16} />
        비밀번호 변경
      </Button>
      <Button variant="success">출석</Button>
      <Button variant="warning">지각</Button>
      <Button variant="error">결석</Button>
      <Button variant="blank">전체</Button>
      <Button variant="active">
        <Check size={16} />
        승인
      </Button>
      <Button variant="inactive">
        <X size={16} />
        비승인
      </Button>
      <Button variant="detail">
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
    </div>
  )
}
