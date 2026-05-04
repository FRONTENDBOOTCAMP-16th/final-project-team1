import { Search, Plus, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import comboStyle from '@/components/common/comboBox/comboBox.module.css'
import searchStyle from '@/components/common/search/search.module.css'

interface Props {
  keyword: string
  selectedCourse: string
  onChangeKeyword: (value: string) => void
  onChangeCourse: (value: string) => void
  onSearch: () => void
}

export default function StudentFilterBar({
  keyword,
  selectedCourse,
  onChangeKeyword,
  onChangeCourse,
  onSearch,
}: Props) {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div className={comboStyle.comboBox}>
          <select
            value={selectedCourse}
            onChange={(e) => onChangeCourse(e.target.value)}
            className={comboStyle.comboSelect}
          >
            <option value="">전체 보기</option>
            <option value="웹 개발 기초 과정">웹 개발 기초 과정</option>
            <option value="모바일 앱 개발">모바일 앱 개발</option>
            <option value="UI/UX 디자인 심화">UI/UX 디자인 심화</option>
            <option value="프론트엔드 프레임워크">프론트엔드 프레임워크</option>
          </select>

          <ChevronDown className={comboStyle.arrow} size={16} />
        </div>
      </div>

      <div style={{ flex: 3 }}>
        <div className={searchStyle.searchBar}>
          <Search size={16} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => onChangeKeyword(e.target.value)}
            placeholder="학생 이름 또는 학번 검색"
            className={searchStyle.searchInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
          />
        </div>
      </div>

      <button type="button" onClick={onSearch} className="button primary">
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
