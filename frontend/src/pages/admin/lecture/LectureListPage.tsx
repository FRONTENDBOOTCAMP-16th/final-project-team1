import { useEffect, useState } from 'react'
import styles from './styles/LectureListPage.module.css'
import { getLectureList } from './api/lecture.api'
import type { LectureItem } from './api/lecture.types'
// Sidebar + Header가 포함된 관리자 공통 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'
import { useNavigate } from 'react-router-dom'

import { Plus } from 'lucide-react'

// 공통 페이지네이션 컴포넌트
import Pagination from '@/components/common/pagination/Pagination'
import { Search } from 'lucide-react'
const PAGE_SIZE = 10

export default function LectureListPage() {
  const [lectures, setLectures] = useState<LectureItem[]>([])
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  useEffect(() => {
    async function fetchLectures() {
      try {
        const result = await getLectureList({
          keyword: searchKeyword,
          page: currentPage,
          size: PAGE_SIZE,
        })

        setLectures(result.items)
        setTotalCount(result.totalCount)
      } catch (error) {
        console.error('강의 목록 조회 실패:', error)
        setLectures([])
        setTotalCount(0)
      }
    }

    fetchLectures()
  }, [searchKeyword, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchKeyword(keyword)
  }

  const navigate = useNavigate()
  return (
    <AdminLayout>
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              className={styles.searchInput}
              placeholder="강의 검색..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
          </div>
        </div>

        <button type="button" onClick={handleSearch} className="search-button">
          <Search size={16} />
          검색
        </button>

        <button
          type="button"
          onClick={() => navigate('/admin/lecture/create')}
          className="add-button"
        >
          <Plus size={16} />
          신규강의 추가
        </button>
      </div>

      {/* 테이블 */}
      <div className={styles.tableBox}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>강의명</th>
              <th>시작일자</th>
              <th>종료일자</th>
              <th>수료여부</th>
            </tr>
          </thead>
          <tbody>
            {lectures.map((lecture) => (
              <tr
                key={lecture.classId}
                onClick={() => navigate(`/admin/lecture/${lecture.classId}/edit`)}
                style={{ cursor: 'pointer' }}
              >
                <td>{lecture.className}</td>
                <td>{lecture.startDate}</td>
                <td>{lecture.endDate}</td>
                <td>
                  <span
                    className={lecture.isCompleted ? styles.completedBadge : styles.progressBadge}
                  >
                    {lecture.completedStatusName}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 하단 총 개수 + 페이지네이션 영역 */}
      <div className={styles['table-footer']}>
        <span>
          총 {totalCount}과목 중 {lectures.length}과목 조회
        </span>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  )
}
