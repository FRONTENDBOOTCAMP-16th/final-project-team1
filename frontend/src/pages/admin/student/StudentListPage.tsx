import { useMemo, useState } from 'react'
import { Plus, Search, Key } from 'lucide-react'

import './styles/student.css'

import AdminLayout from '@/pages/sample/AdminLayout'
import Pagination from '@/components/common/pagination/Pagination'
import Table from '@/components/common/table/Table'
import Button from '@/components/common/button/ui/button'
import SearchBar from '@/components/common/search/search'
import ComboBox from '@/components/common/comboBox/customComboBox'

import type { TableColumn } from '@/components/common/table/table.types'
import type { Student } from './data/studentData'

import { studentData } from './data/studentData'
import { studentStatusMap } from './data/studentStatusMap'

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

  const studentColumns: TableColumn<Student>[] = [
    {
      key: 'name',
      header: '이름',
      render: (row) => (
        <div className="name-box">
          <span className="tit">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'studentNo',
      header: '학번',
    },
    {
      key: 'courseName',
      header: '강의명',
    },
    {
      key: 'phone',
      header: '연락처',
    },
    {
      key: 'status',
      header: '상태',
      render: (row) => {
        const status = studentStatusMap[row.status]

        return <span className={`status-badge ${status.className}`}>{status.label}</span>
      },
    },
    {
      key: 'detail',
      header: '관리',
      render: () => (
        <Button type="button" variant="detail">
          <Key size={16} />
          상세보기
        </Button>
      ),
    },
  ]

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
          <ComboBox
            value={selectedCourse}
            options={[
              '웹 개발 기초 과정',
              '모바일 앱 개발',
              'UI/UX 디자인 심화',
              '프론트엔드 프레임워크',
            ]}
            placeholder="강의명 콤보박스"
            onChange={handleChangeCourse}
          />
        </div>

        <div style={{ flex: 3 }}>
          <SearchBar
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="학생 이름 또는 학번 검색"
          />
        </div>

        <Button type="button" variant="dark" size="md" onClick={handleSearch}>
          <Search size={16} />
          검색
        </Button>

        <Button type="button" variant="primary">
          <Plus size={16} />
          신규 강의등록
        </Button>
      </div>

      <Table columns={studentColumns} data={pagedStudents} rowKey={(row) => row.studentNo} />

      <div className="table-footer">
        <span>
          총 {filteredStudents.length}명 중{' '}
          {filteredStudents.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}명 표시
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
