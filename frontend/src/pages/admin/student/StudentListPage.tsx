import { useMemo, useState } from 'react'

import './styles/student.css'

import StudentFilterBar from './components/StudentFilterBar'
import StudentTable from './components/StudentTable'
import Pagination from './components/Pagination'
import { studentData } from './data/studentData'

// Header 쓸 거면 실제 경로/파일명 맞춰서 import 필요
// import { Header } from '../../../components/common/header/header'

const PAGE_SIZE = 10

export default function StudentListPage() {
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredStudents = useMemo(() => {
    return studentData.filter((student) => {
      const matchesKeyword =
        student.name.includes(searchKeyword) || student.studentNo.includes(searchKeyword)

      const matchesCourse = selectedCourse === '' || student.courseName === selectedCourse

      return matchesKeyword && matchesCourse
    })
  }, [searchKeyword, selectedCourse])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))

  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredStudents.slice(start, end)
  }, [filteredStudents, currentPage])

  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleChangeCourse = (value: string) => {
    setSelectedCourse(value)
    setCurrentPage(1)
  }

  return (
    <div className="layout">
      {/* Header import 아직 안 했으면 일단 주석 처리 */}
      {/* <Header /> */}

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
            총 {filteredStudents.length}명 중{' '}
            {filteredStudents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
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
