import S from './table.module.css'
import type { CommonTableProps } from './table.types'

export default function CommonTable<T>({
  columns,
  data,
  rowKey,
  totalCount,
  currentPage = 1,
  pageSize = 12,
  countLabel = '명',
  onRowClick,
}: CommonTableProps<T>) {
  const startCount = (currentPage - 1) * pageSize + 1
  const endCount = Math.min(currentPage * pageSize, totalCount ?? data.length)

  return (
    <div className={S.tableBox}>
      <table className={S.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width, textAlign: column.align ?? 'center' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={S.empty}>
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} style={{ textAlign: column.align ?? 'center' }}>
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalCount !== undefined && (
        <div className={S.tableFooter}>
          총 {totalCount}
          {countLabel} 중 {startCount}-{endCount}
          {countLabel} 표시
        </div>
      )}
    </div>
  )
}