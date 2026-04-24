import { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import S from './datePicker.module.css'

import arrow from '../../../assets/arrow.svg'
import { FiCalendar } from 'react-icons/fi'

import type { DatePickerProps } from './datePicker.types'

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={S.datepicker}>
      <ReactDatePicker
        selected={value}
        onChange={(date: Date | null) => {
          onChange(date)
          setOpen(false)
        }}
        onCalendarOpen={() => setOpen(true)}
        onCalendarClose={() => setOpen(false)}
        minDate={minDate}
        maxDate={maxDate}
        placeholderText={placeholder || '0000-00-00'}
        dateFormat="yyyy-MM-dd"
        className={S.input}
        onChangeRaw={(e) => e?.preventDefault()}
      />
      <FiCalendar className={S.icon} />
      <img src={arrow} className={`${S.arrow} ${open ? S.rotate : ''}`} alt="arrow" />
    </div>
  )
}
