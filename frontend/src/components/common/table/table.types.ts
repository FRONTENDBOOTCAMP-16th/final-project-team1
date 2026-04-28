import type { ReactNode } from 'react'

export type TableColumn<T> = {
  key: keyof T | string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

export type CommonTableProps<T> = {
  columns: TableColumn<T>[]
  data: T[]
  rowKey?: (row: T, index: number) => string | number

  totalCount?: number
  currentPage?: number
  pageSize?: number
  countLabel?: string
}
