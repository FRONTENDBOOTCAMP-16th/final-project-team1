// React 기본 Hook import
// useEffect: 화면이 뜨거나 조건이 바뀔 때 API 호출
// useMemo: 컬럼 배열처럼 매번 새로 만들 필요 없는 값을 기억
// useState: 검색어, 페이지, 학생 목록 같은 상태 관리
import { useEffect, useMemo, useState } from 'react'

// 아이콘 라이브러리에서 Key 아이콘 import
import { Key } from 'lucide-react'

// 학생 목록 페이지 전용 CSS
import './styles/student.css'

// Sidebar + Header가 포함된 관리자 공통 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// 학생 검색 필터 컴포넌트
import StudentFilterBar from './components/StudentFilterBar'

// 공통 페이지네이션 컴포넌트
import Pagination from '@/components/common/pagination/Pagination'

// 공통 테이블 컴포넌트
import Table from '@/components/common/table/Table'

// 공통 버튼 컴포넌트
import Button from '@/components/common/button/ui/button'

// 테이블 컬럼 타입
import type { TableColumn } from '@/components/common/table/table.types'

// 관리자 학생 목록 데이터 타입
import type { AdminStudent } from './api/student.types'

// 학생 목록 조회 API 함수
import { getAdminStudents } from './api/student.api'

// 강의 목록 조회 API 함수
import { getLectureList } from '../lecture/api/lecture.api'

// 한 페이지에 보여줄 학생 수
const PAGE_SIZE = 10

export default function StudentListPage() {
  // 검색 input에 입력 중인 값
  const [keyword, setKeyword] = useState('')

  // 실제 검색 버튼을 눌렀을 때 적용되는 검색어
  const [searchKeyword, setSearchKeyword] = useState('')

  // 선택된 강의 ID
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)

  // 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1)

  // API에서 받아온 학생 목록
  const [students, setStudents] = useState<AdminStudent[]>([])

  // API에서 받아온 전체 학생 수
  const [totalCount, setTotalCount] = useState(0)

  // 강의 목록
  const [courses, setCourses] = useState<{ classId: number; className: string }[]>([])

  // 컴포넌트 마운트 시 강의 목록 조회
  useEffect(() => {
    async function fetchCourses() {
      try {
        const result = await getLectureList({ page: 1, size: 1000 })
        setCourses(result.items.map(({ classId, className }) => ({ classId, className })))
      } catch (error) {
        console.error('강의 목록 조회 실패:', error)
      }
    }
    fetchCourses()
  }, [])

  // 검색어, 강의명, 페이지가 바뀔 때마다 학생 목록 다시 조회
  useEffect(() => {
    async function fetchStudents() {
      try {
        // 백엔드 학생 목록 API 호출
        const result = await getAdminStudents({
          keyword: searchKeyword,
          classId: selectedClassId ?? undefined,
          page: currentPage,
          size: PAGE_SIZE,
        })

        // 응답 데이터 중 실제 학생 목록 저장
        setStudents(result.items)

        // 전체 학생 수 저장
        setTotalCount(result.totalCount)
      } catch (error) {
        // API 실패 시 콘솔에 에러 출력
        console.error('학생 목록 조회 실패:', error)

        // 화면이 깨지지 않도록 빈 데이터 처리
        setStudents([])
        setTotalCount(0)
      }
    }

    // 함수 실행
    fetchStudents()
  }, [searchKeyword, selectedClassId, currentPage])

  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    // 입력 중인 keyword를 실제 검색어로 반영
    setSearchKeyword(keyword)

    // 검색하면 첫 페이지로 이동
    setCurrentPage(1)
  }

  // 강의 select 변경 시 실행
  const handleChangeCourse = (classId: number | null) => {
    setSelectedClassId(classId)
    setCurrentPage(1)
  }

  // 테이블 컬럼 정의
  // useMemo를 쓰면 렌더링될 때마다 컬럼 배열을 새로 만들지 않음
  const studentColumns: TableColumn<AdminStudent>[] = useMemo(
    () => [
      {
        key: 'name',
        header: '이름',
        render: (row: AdminStudent) => (
          <div className="name-box">
            <span className="tit">{row.name}</span>
          </div>
        ),
      },
      {
        key: 'studentId',
        header: '학번',
      },
      {
        key: 'className',
        header: '강의명',
      },
      {
        key: 'phoneNumber',
        header: '연락처',
      },
      {
        key: 'statusName',
        header: '상태',
        render: (row: AdminStudent) => {
          const colorClass =
            row.statusCode === 'S001' ? 'status-gray'
            : row.statusCode === 'S002' ? 'status-blue'
            : 'status-orange'
          return <span className={`status ${colorClass}`}>{row.statusName}</span>
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
    ],
    [],
  )

  return (
    <AdminLayout>
      {/* 검색어 + 강의명 필터 영역 */}
      <StudentFilterBar
        keyword={keyword}
        selectedCourse={selectedClassId}
        courses={courses}
        onChangeKeyword={setKeyword}
        onChangeCourse={handleChangeCourse}
        onSearch={handleSearch}
      />

      {/* 학생 목록 테이블 */}
      <Table columns={studentColumns} data={students} rowKey={(row) => row.studentId} />

      {/* 하단 총 개수 + 페이지네이션 영역 */}
      <div className="table-footer">
        <span>
          총 {totalCount}명 중 {totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
          {Math.min(currentPage * PAGE_SIZE, totalCount)}명 표시
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
