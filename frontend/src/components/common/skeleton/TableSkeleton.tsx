import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Column {
  header: string
  width?: string
}

interface Props {
  columns: Column[]
  rows?: number
}

export default function TableSkeleton({ columns, rows = 8 }: Props) {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                style={{
                  padding: '14px 16px',
                  background: '#fafafa',
                  borderBottom: '1px solid #efefef',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#222',
                  textAlign: 'center',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {columns.map((col) => (
                <td
                  key={col.header}
                  style={{
                    padding: '18px 16px',
                    borderBottom: '1px solid #efefef',
                    textAlign: 'center',
                  }}
                >
                  <Skeleton height={16} borderRadius={6} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </SkeletonTheme>
  )
}
