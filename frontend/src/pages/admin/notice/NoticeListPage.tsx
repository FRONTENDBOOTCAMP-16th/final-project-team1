// 외부 라이브러리
import { useEffect, useMemo, useState } from 'react'
import { FileText, Check } from 'lucide-react'

// 공통 컴포넌트
import { Button } from '@/components'
import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'

// 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// 페이지 내부 컴포넌트 / API / 스타일
import NoticeFilterBar from './components/NoticeFilterBar'
import {
  deleteNotice,
  getRecentNoticeRequests,
  getNoticeDetail,
  updateNotice,
} from './api/noticeApi'
import S from './styles/notice.module.css'

/** 한 페이지에 보여줄 개수 */
const PAGE_SIZE = 10

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

/** 서버 데이터 → 화면 데이터 변환 */
const mapToNotice = (item: NoticeApiItem): Notice => ({
  noticeId: item.noticeId,
  no: item.displayNo,
  title: item.title,
  createdDate: item.createdDate,
  isOpen: item.isOpen,
  statusText: item.openStatusName,
})

export default function NoticeListPage() {
  /** 전체 공지 데이터 */
  const [data, setData] = useState<Notice[]>([])

  /** 검색어 입력값 */
  const [keyword, setKeyword] = useState('')

  /** 실제 검색에 사용되는 값 */
  const [searchKeyword, setSearchKeyword] = useState('')

  /** 현재 페이지 */
  const [currentPage, setCurrentPage] = useState(1)

  /** 선택된 공지 ID 목록 */
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  /** 최초 진입 시 공지 목록 조회 */
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

  /** 요약 카드 데이터 */
  const noticeSummaryCards: SummaryCard[] = [
    {
      label: '전체 공지',
      count: data.length,
      color: 'orange',
      icon: <FileText size={20} />,
    },
    {
      label: '공개 중',
      count: data.filter((notice) => notice.isOpen).length,
      color: 'green',
      icon: <Check size={20} />,
    },
  ]

  /** 체크박스 선택 / 해제 */
  const handleSelect = (noticeId: number) => {
    setSelectedIds((prev) =>
      prev.includes(noticeId) ? prev.filter((id) => id !== noticeId) : [...prev, noticeId],
    )
  }

  /** 공개 / 비공개 토글 */
  const handleTogglePublic = async (noticeId: number, value: boolean) => {
    try {
      // 현재 데이터에서 기존 값 가져오기
      const target = data.find((item) => item.noticeId === noticeId)
      if (!target) return

      const detail = await getNoticeDetail(noticeId)

      await updateNotice(noticeId, {
        title: detail.title,
        content: detail.content,
        isOpen: value,
      })

      // 성공하면 화면 업데이트
      setData((prev) =>
        prev.map((item) => (item.noticeId === noticeId ? { ...item, isOpen: value } : item)),
      )
    } catch (e) {
      console.error(e)
      alert('공개 상태 변경 실패')
    }
  }

  /** 검색 */
  const handleSearch = () => {
    setSearchKeyword(keyword)
    setCurrentPage(1)
    setSelectedIds([])
  }

  /** 선택 삭제 */
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 공지사항을 선택해주세요.')
      return
    }

    if (!confirm('선택한 공지사항을 삭제하시겠습니까?')) return

    try {
      // 선택된 noticeId들을 서버에서 삭제
      await Promise.all(selectedIds.map((noticeId) => deleteNotice(noticeId)))

      // 삭제 성공 후 화면에서도 제거
      setData((prev) => prev.filter((notice) => !selectedIds.includes(notice.noticeId)))

      setSelectedIds([])
      setCurrentPage(1)

      alert('삭제되었습니다.')
    } catch (e) {
      console.error('삭제 실패:', e)
      alert('삭제에 실패했습니다.')
    }
  }

  /** 등록 */
  const handleCreate = () => {
    console.log('등록')
  }

  /** 검색 필터링 */
  const filteredNotices = useMemo(() => {
    return data.filter((notice) => notice.title.includes(searchKeyword))
  }, [data, searchKeyword])

  /** 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / PAGE_SIZE))

  /** 현재 페이지에 보여줄 데이터 */
  const pagedNotices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    return filteredNotices.slice(start, end).map((item, index) => ({
      ...item,
      no: start + index + 1,
    }))
  }, [filteredNotices, currentPage])

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
          checked={selectedIds.includes(row.noticeId)}
          onChange={() => handleSelect(row.noticeId)}
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
              onClick={() => handleTogglePublic(row.noticeId, false)}
            >
              비공개
            </Button>
          ) : (
            <Button
              type="button"
              variant="active"
              onClick={() => handleTogglePublic(row.noticeId, true)}
            >
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
