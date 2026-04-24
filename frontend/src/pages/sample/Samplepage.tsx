import DatePicker from '../../components/common/datePicker'
import { useState } from 'react'

export default function LoginPage() {
  {/* 달력컴포넌트: Datepicker */}
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleStartChange = (date: Date | null) => {
    setStartDate(date)
    setEndDate(null)
  }
  {/* //달력컴포넌트: Datepicker */}

  return (
    <div>
      {/* 달력컴포넌트: Datepicker */}
      <h3 style={{ textAlign: 'left' }}>1. 달력 컴포넌트 샘플</h3>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {/* DatePicker는 width:100% 기준, 실제 크기는 부모에서 제어 */}
        <DatePicker
          value={startDate}
          onChange={handleStartChange}
          placeholder="0000-00-00"
        />
        <span>-</span>
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          minDate={startDate || undefined} // 시작일 이전 선택 방지
          placeholder="0000-00-00"
        />
      </div>
      {/* //달력컴포넌트: Datepicker */}
    </div>
  )
}