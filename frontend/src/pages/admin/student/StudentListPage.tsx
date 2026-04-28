// React에서 상태(useState)와 성능 최적화(useMemo)를 사용하기 위한 import
import { useMemo, useState } from 'react'

// 학생 목록 페이지 전용 CSS
import './styles/student.css'

// Sidebar + Header 포함된 관리자 공통 레이아웃 컴포넌트
import AdminLayout from '@/pages/sample/AdminLayout'

// 학생 검색 필터 컴포넌트 (검색창 + 과정 선택)
import StudentFilterBar from './components/StudentFilterBar'

// 학생 목록 테이블 컴포넌트
import StudentTable from './components/StudentTable'

// 페이지네이션 컴포넌트
import Pagination from './components/Pagination'

// 임시 mock 데이터 (나중에 API로 대체 예정)
import { studentData } from './data/studentData'

// 한 페이지에 보여줄 학생 수
const PAGE_SIZE = 10

export default function StudentListPage() {
  // 검색 입력창에 입력 중인 값 (아직 검색 버튼 누르기 전 상태)
  const [keyword, setKeyword] = useState('')

  // 실제 검색에 적용된 키워드 (검색 버튼 눌렀을 때 적용)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 선택된 과정명 필터 값
  const [selectedCourse, setSelectedCourse] = useState('')

  // 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1)

  // 검색어 + 과정 필터 조건에 맞는 학생 목록 계산
  // useMemo: 불필요한 재계산 방지 (성능 최적화)
  const filteredStudents = useMemo(() => {
    return studentData.filter((student) => {
      // 이름 또는 학번에 검색어 포함 여부 확인
      const matchesKeyword =
        student.name.includes(searchKeyword) || student.studentNo.includes(searchKeyword)

      // 과정 선택 필터 적용
      const matchesCourse = selectedCourse === '' || student.courseName === selectedCourse

      return matchesKeyword && matchesCourse
    })
  }, [searchKeyword, selectedCourse])

  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))

  // 현재 페이지에 해당하는 학생 목록만 잘라서 반환
  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    setSearchKeyword(keyword) // 실제 검색 적용
    setCurrentPage(1) // 페이지 초기화
  }

  // 과정 선택 변경 시 실행
  const handleChangeCourse = (value: string) => {
    setSelectedCourse(value)
    setCurrentPage(1)
  }

  // 화면 렌더링 영역
  return (
    // Sidebar + Header 포함된 공통 관리자 레이아웃
    <AdminLayout>
      {/* 학생 검색 필터 영역 */}
      <StudentFilterBar
        keyword={keyword}
        selectedCourse={selectedCourse}
        onChangeKeyword={setKeyword}
        onChangeCourse={handleChangeCourse}
        onSearch={handleSearch}
      />

      {/* 학생 목록 테이블 */}
      <StudentTable students={pagedStudents} />

      {/* 하단 페이지 정보 + 페이지 이동 버튼 */}
      <div className="table-footer">
        {/* 현재 표시 중인 학생 범위 텍스트 */}
        <span>
          총 {filteredStudents.length}명 중{' '}
          {filteredStudents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}명 표시
        </span>

        {/* 페이지 이동 컴포넌트 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={setCurrentPage}
        />
      </div>
    </AdminLayout>
  )
}
