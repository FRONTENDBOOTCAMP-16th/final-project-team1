import { FileText, Check, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import NoticeFilterBar from './components/NoticeFilterBar'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

import S from './styles/notice.module.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import { Button } from '@/components'

import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'

import { getRecentNoticeRequests } from './api/noticeApi'

/** 한 페이지에 보여줄 개수 */
const PAGE_SIZE = 10

/** 요약 카드 */
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

/** 서버 데이터 */
type NoticeApiItem = {
  noticeId: number
  displayNo: number
  title: string
  createdDate: string
  isOpen: boolean
  openStatusName: string
}

/** 화면 데이터 */
type Notice = {
  noticeId: number
  no: number
  title: string
  createdDate: string
  isOpen: boolean
  statusText: string
}

/** 변환 함수 */
const mapToNotice = (item: NoticeApiItem): Notice => ({
  noticeId: item.noticeId,
  no: item.displayNo,
  title: item.title,
  createdDate: item.createdDate,
  isOpen: item.isOpen,
  statusText: item.openStatusName,
})

export default function NoticeListPage() {
  const [data, setData] = useState<Notice[]>([])
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  /** API 호출 */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getRecentNoticeRequests()
        const mapped = result.map(mapToNotice)
        setData(mapped)
      } catch (e) {
        console.error('데이터 조회 실패:', e)
        alert('데이터를 불러오는데 실패했습니다.')
      }
    }

    fetchData()
  }, [])

  /** 체크박스 선택 */
  const handleSelect = (no: number) => {
    setSelectedIds((prev) => (prev.includes(no) ? prev.filter((id) => id !== no) : [...prev, no]))
  }

  /** 공개/비공개 토글 */
  const handleTogglePublic = (no: number, value: boolean) => {
    setData((prev) =>
      prev.map((notice) => (notice.no === no ? { ...notice, isOpen: value } : notice)),
    )
  }

  /** 검색 */
  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
  }

  /** 필터링 */
  const filteredNotices = useMemo(() => {
    return data.filter((notice) => notice.title.includes(searchKeyword))
  }, [data, searchKeyword])

  /** 페이징 */
  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE))

  const pagedNotices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredNotices
    .slice(start, end)
    .map((item, index) => ({
      ...item,
      no: start + index + 1,
    }))
  }, [filteredNotices, currentPage])

  /** 삭제 */
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 공지사항을 선택해주세요.')
      return
    }

    setData((prev) => prev.filter((notice) => !selectedIds.includes(notice.no)))
    setSelectedIds([])
    setCurrentPage(1)
  }

  const handleCreate = () => {
    console.log('등록')
  }

  /** 테이블 컬럼 */
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
    { key: 'createdDate', header: '작성일', width: '200px' },
    {
      key: 'isOpen',
      header: '공개여부',
      width: '200px',
      render: (row) => (
        <div className={S.actionBox}>
          {row.isOpen ? (
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

            <Table columns={noticeColumns} data={pagedNotices} />

            <div className={S.table_footer}>
              <span>
                총 {filteredNotices.length}건 중{' '}
                {filteredNotices.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(currentPage * PAGE_SIZE, filteredNotices.length)}건 표시
              </span>

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
