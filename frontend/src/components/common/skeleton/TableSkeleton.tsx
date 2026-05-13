import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface ColumnDef {
    header: string
    width?: string
}

interface TableSkeletonProps {
    rows?: number
    columns?: number | ColumnDef[]
}

export default function TableSkeleton({
    rows = 10,
    columns = 4,
}: TableSkeletonProps) {
    // columns가 숫자면 그 숫자만큼, 배열이면 배열 길이만큼
    const columnCount = typeof columns === 'number' ? columns : columns.length

    // columns가 배열이면 width 활용, 숫자면 균등 분배
    const gridTemplateColumns = typeof columns === 'number'
        ? `repeat(${columns}, 1fr)`
        : columns.map((col) => col.width ?? '1fr').join(' ')

    return (
        <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
            <div style={{overflowX: 'hidden'}}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                        key={rowIndex}
                        style={{
                            display: 'grid',
                            gridTemplateColumns,
                            gap: '16px',
                            padding: '16px 24px',
                            borderBottom: '1px solid #e5e5e5',
                        }}
                    >
                        {Array.from({ length: columnCount }).map((_, colIndex) => (
                            <Skeleton key={colIndex} height={16} />
                        ))}
                    </div>
                ))}
            </div>
        </SkeletonTheme>
    )
}