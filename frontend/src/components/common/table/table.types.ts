import type { ReactNode } from 'react'

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

export interface CommonTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  rowKey?: (row: T, rowIndex: number) => string | number
}
