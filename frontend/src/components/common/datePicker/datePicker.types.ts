export type DatePickerProps = {
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
}
