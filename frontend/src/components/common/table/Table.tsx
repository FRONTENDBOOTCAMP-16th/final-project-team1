import S from './table.module.css'
import type { CommonTableProps } from './table.types'

export default function CommonTable<T>({ columns, data, rowKey }: CommonTableProps<T>) {
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
          {data.map((row, rowIndex) => (
            <tr key={rowKey ? rowKey(row, rowIndex) : rowIndex}>
              {columns.map((column) => (
                <td key={String(column.key)} style={{ textAlign: column.align ?? 'center' }}>
                  {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
