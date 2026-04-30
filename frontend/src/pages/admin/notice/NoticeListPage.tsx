import { FileText, Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import NoticeFilterBar from './components/NoticeFilterBar'

import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

import S from './styles/notice.module.css'

import AdminLayout from '@/pages/sample/AdminLayout'
import { Button } from '@/components'

import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'

import type { Notice } from './data/noticeData'
import { noticeData } from './data/noticeData'

const PAGE_SIZE = 10

const noticeSummaryCards: SummaryCard[] = [
  {
    label: '전체 공지',
    count: 8,
    color: 'orange',
    icon: <FileText size={20} />,
  },
  {
    label: '공개 중',
    count: 6,
    color: 'green',
    icon: <Check size={20} />,
  },
]

export default function NoticeListPage() {
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [notices, setNotices] = useState<Notice[]>(noticeData)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelect = (no: string) => {
    setSelectedIds((prev) => (prev.includes(no) ? prev.filter((id) => id !== no) : [...prev, no]))
  }

  const handleTogglePublic = (no: string, value: boolean) => {
    setNotices((prev) =>
      prev.map((notice) => (notice.no === no ? { ...notice, isPublic: value } : notice)),
    )
  }

  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => notice.title.includes(searchKeyword))
  }, [notices, searchKeyword])

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE))

  const pagedNotices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredNotices.slice(start, end)
  }, [filteredNotices, currentPage])

  const noticeColumns: TableColumn<Notice>[] = [
    {
      key: 'checkbox',
      header: '',
      width: '100px',
      render: (row) => (
        <input
          type="checkbox"
          className={S.checkbox}
          checked={selectedIds.includes(row.no)}
          onChange={() => handleSelect(row.no)}
        />
      ),
    },
    { key: 'no', header: '번호', width: '100px' },
    {
      key: 'title',
      header: '제목',
      width: '600px',
      render: (row) => <div className={S.ellipsis}>{row.title}</div>,
    },
    { key: 'createdAt', header: '작성일', width: '200px' },
    {
      key: 'isPublic',
      header: '공개여부',
      width: '200px',
      render: (row) => (
        <div className={S.actionBox}>
          {row.isPublic ? (
            <Button
              type="button"
              variant="inactive"
              onClick={() => handleTogglePublic(row.no, false)}
            >
              <X size={16} />
              비공개
            </Button>
          ) : (
            <Button type="button" variant="active" onClick={() => handleTogglePublic(row.no, true)}>
              <Check size={16} />
              공개
            </Button>
          )}
        </div>
      ),
    },
  ]

  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 공지사항을 선택해주세요.')
      return
    }

    setNotices((prev) => prev.filter((notice) => !selectedIds.includes(notice.no)))
    setSelectedIds([])
    setCurrentPage(1)
  }

  const handleCreate = () => {
    console.log('등록')
  }

  return (
    <AdminLayout>
      <div className={S.page}>
        <main className={S.main}>
          <section>
            <StatusSummary cards={noticeSummaryCards} />
          </section>

          <section className={S.content}>
            <NoticeFilterBar
              keyword={keyword}
              onChangeKeyword={setKeyword}
              onSearch={handleSearch}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />

            <Table
              columns={noticeColumns}
              data={pagedNotices}
              totalCount={filteredNotices.length}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              countLabel="건"
            />

            <div className={S.paginationBox}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </section>
        </main>
      </div>
    </AdminLayout>
  )
}
