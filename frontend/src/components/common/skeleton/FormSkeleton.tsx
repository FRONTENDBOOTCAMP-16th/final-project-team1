import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface FormSkeletonProps {
  type?: 'input' | 'editor'
}

export default function FormSkeleton({ type = 'input' }: FormSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      {/* input 내부 스켈레톤 */}
      {type === 'input' ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {/* 실제 input 모양 */}
          <div
            style={{
              width: '100%',
              height: '48px',
              border: '1px solid #d9d9d9',
              borderRadius: '8px',
              background: '#fff',
            }}
          />

          {/* input 안쪽 skeleton */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              width: '240px',
            }}
          >
            <Skeleton height={18} />
          </div>
        </div>
      ) : (
        /* editor skeleton */
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {/* toolbar */}
          <div
            style={{
              height: '48px',
              borderBottom: '1px solid #e5e5e5',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Skeleton height={20} width={180} />
          </div>

          {/* editor body */}
          <div
            style={{
              padding: '16px',
            }}
          >
            <Skeleton height={18} width="40%" />
            <br />

            <Skeleton height={18} width="65%" />
            <br />

            <Skeleton height={18} width="90%" />
            <br />

            <Skeleton height={18} width="50%" />
            <br />

            <Skeleton height={18} width="75%" />
          </div>
        </div>
      )}
    </SkeletonTheme>
  )
}
