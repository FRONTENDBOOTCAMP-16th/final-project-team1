import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Key } from 'lucide-react'

import './styles/student.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import StudentFilterBar from './components/StudentFilterBar'
import Pagination from '@/components/common/pagination/Pagination'
import Table from '@/components/common/table/Table'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
import Button from '@/components/common/button/ui/button'
import type { TableColumn } from '@/components/common/table/table.types'
import type { AdminStudent } from './api/student.types'
import { getAdminStudents } from './api/student.api'
import { getLectureList } from '../lecture/api/lecture.api'

const PAGE_SIZE = 10

// 검색 폼 스키마 — keyword만 관리 (강의 선택은 드롭다운 변경 시 즉시 적용)
const filterSchema = z.object({
  keyword: z.string(),
})
type FilterForm = z.infer<typeof filterSchema>

export default function StudentListPage() {
  const navigate = useNavigate()

  // API에 실제로 전달되는 적용된 값 (검색 버튼 눌렀을 때 반영)
  const [appliedKeyword, setAppliedKeyword] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // React Hook Form: 검색 input 상태 관리 + Zod 유효성 검사
  const { watch, setValue, handleSubmit } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: { keyword: '' },
  })

  const keyword = watch('keyword')

  // TanStack Query: 강의 목록 (드롭다운용 — 한 번 fetch 후 캐시)
  const { data: coursesData } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => getLectureList({ page: 1, size: 1000 }),
  })

  const courses = useMemo(
    () => (coursesData?.items ?? []).map(({ classId, className }) => ({ classId, className })),
    [coursesData],
  )

  // TanStack Query: 학생 목록 (queryKey가 바뀌면 자동으로 재요청)
  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['admin', 'students', appliedKeyword, selectedClassId, currentPage],
    queryFn: () =>
      getAdminStudents({
        keyword: appliedKeyword,
        classId: selectedClassId ?? undefined,
        page: currentPage,
        size: PAGE_SIZE,
      }),
  })

  const students = studentsData?.items ?? []
  const totalCount = studentsData?.totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // 검색 버튼: 폼 값을 검증 후 API 쿼리에 반영
  const onSubmit = ({ keyword }: FilterForm) => {
    setAppliedKeyword(keyword)
    setCurrentPage(1)
  }

  // 강의 드롭다운: 변경 즉시 반영
  const handleChangeCourse = (id: number | null) => {
    setSelectedClassId(id)
    setCurrentPage(1)
  }

  const studentColumns: TableColumn<AdminStudent>[] = useMemo(
    () => [
      {
        key: 'name',
        header: '이름',
        render: (row) => (
          <div className="name-box">
            <span className="tit">{row.name}</span>
          </div>
        ),
      },
      { key: 'studentId', header: '학번' },
      { key: 'className', header: '강의명' },
      { key: 'phoneNumber', header: '연락처' },
      {
        key: 'statusName',
        header: '상태',
        render: (row) => {
          const colorClass =
            row.statusCode === 'S001'
              ? 'status-gray'
              : row.statusCode === 'S002'
                ? 'status-blue'
                : 'status-orange'
          return <span className={`status ${colorClass}`}>{row.statusName}</span>
        },
      },
      {
        key: 'detail',
        header: '관리',
        render: (row) => (
          <Button
            type="button"
            variant="detail"
            onClick={() => navigate(`/admin/student/${row.studentId}/edit`)}
          >
            <Key size={16} />
            상세보기
          </Button>
        ),
      },
    ],
    [navigate],
  )

  return (
    <AdminLayout>
      <StudentFilterBar
        keyword={keyword}
        selectedCourse={selectedClassId}
        courses={courses}
        onChangeKeyword={(val) => setValue('keyword', val)}
        onChangeCourse={handleChangeCourse}
        onSearch={handleSubmit(onSubmit)}
      />

      {isLoading ? (
        <TableSkeleton
          columns={[
            { header: '이름', width: '15%' },
            { header: '학번', width: '20%' },
            { header: '강의명', width: '25%' },
            { header: '연락처', width: '18%' },
            { header: '상태', width: '12%' },
            { header: '관리', width: '10%' },
          ]}
          rows={PAGE_SIZE}
        />
      ) : (
        <Table columns={studentColumns} data={students} rowKey={(row) => row.studentId} />
      )}

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
