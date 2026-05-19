import { Search, Plus, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import comboStyle from '@/components/common/comboBox/comboBox.module.css'
import searchStyle from '@/components/common/search/search.module.css'
import styles from './StudentFilterBar.module.css'

interface Course {
  classId: number
  className: string
}

interface Props {
  keyword: string
  selectedCourse: number | null
  courses: Course[]
  onChangeKeyword: (value: string) => void
  onChangeCourse: (classId: number | null) => void
  onSearch: () => void
}

export default function StudentFilterBar({
  keyword,
  selectedCourse,
  courses,
  onChangeKeyword,
  onChangeCourse,
  onSearch,
}: Props) {
  const navigate = useNavigate()

  return (
    <div className={styles.filterBar}>
      <div className={styles.selectWrap}>
        <div className={comboStyle.comboBox}>
          <select
            value={selectedCourse ?? ''}
            onChange={(e) => onChangeCourse(e.target.value ? Number(e.target.value) : null)}
            className={comboStyle.comboSelect}
          >
            <option value="">전체 보기</option>
            {courses.map((course) => (
              <option key={course.classId} value={course.classId}>
                {course.className}
              </option>
            ))}
          </select>

          <ChevronDown className={comboStyle.arrow} size={16} />
        </div>
      </div>

      <div className={styles.searchWrap}>
        <div className={searchStyle.searchBar}>
          <Search size={16} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value)}
            placeholder="학생 이름 또는 학번 검색"
            className={searchStyle.searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch()
            }}
          />
        </div>
      </div>

      <button type="button" onClick={onSearch} className="search-button">
        <Search size={16} />
        검색
      </button>

      <button
        type="button"
        onClick={() => navigate('/admin/student/create')}
        className="add-button"
      >
        <Plus size={16} />
        신규학생 추가
      </button>
    </div>
  )
}
