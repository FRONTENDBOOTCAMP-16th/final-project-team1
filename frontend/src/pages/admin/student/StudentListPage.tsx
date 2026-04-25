import { useMemo, useState } from 'react'
import './styles/student.css'

import StudentFilterBar from './components/StudentFilterBar'
import StudentTable from './components/StudentTable'
import Pagination from './components/Pagination'
import { studentData } from './data/studentData'

const PAGE_SIZE = 10

export default function StudentListPage() {
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // 검색 조건
  const filteredStudents = useMemo(() => {
    return studentData.filter((student) => {
      const matchesKeyword =
        student.name.includes(searchKeyword) || student.studentNo.includes(searchKeyword)

      const matchesCourse = selectedCourse === '' || student.courseName === selectedCourse

      return matchesKeyword && matchesCourse
    })
  }, [searchKeyword, selectedCourse])

  // 전체 페이지 수
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE)

  // 현재 페이지에 보여줄 데이터만 자르기
  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  //검색 버튼 눌렀을때
  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  //강의 선택 바꿨을 때
  const handleChangeCourse = (value: string) => {
    setSelectedCourse(value)
    setCurrentPage(1)
  }

  //화면 렌더링 페이지
  return (
    <div className="layout">
      <main className="content">
        <StudentFilterBar
          keyword={keyword}
          selectedCourse={selectedCourse}
          onChangeKeyword={setKeyword}
          onChangeCourse={handleChangeCourse}
          onSearch={handleSearch}
        />

        <StudentTable students={pagedStudents} />

        <div className="table-footer">
          <span>
            총 {filteredStudents.length}명 중 {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}명 표시
          </span>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
          />
        </div>
      </main>
    </div>
  )
}
