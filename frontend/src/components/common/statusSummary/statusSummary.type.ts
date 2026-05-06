import type { ReactNode } from 'react'

export type SummaryCard = {
  label: string
  count: number
  color: 'orange' | 'green' | 'red'
  icon?: ReactNode
}
