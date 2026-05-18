// 외부 라이브러리
import { useState } from 'react'
import { FileText, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

// 공통 컴포넌트
import { Button } from '@/components'
import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'
import Table, { type TableColumn } from '@/components/common/table'
import Pagination from '@/components/common/pagination/Pagination'
import Modal from '@/components/common/modal/Modal'
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'

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

/** 한 페이지에 보여줄 데이터 개수 */
const PAGE_SIZE = 10

/** 서버에서 내려오는 공지사항 데이터 구조 */
type NoticeApiItem = {
  noticeId: number
  displayNo: number
  title: string
  createdDate: string
  isOpen: boolean
  openStatusName: string
}

/** 공지사항 목록 API 응답 구조 */
type NoticeListResponse = {
  items: NoticeApiItem[]
  totalCount: number
}

export default function NoticeListPage() {
  /** 검색어 입력값 */
  const [keyword, setKeyword] = useState('')

  /** 실제 검색에 사용되는 값 */
  const [searchKeyword, setSearchKeyword] = useState('')

  /** 현재 페이지 번호 */
  const [currentPage, setCurrentPage] = useState(1)

  /** 선택된 공지사항 ID 목록 */
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  /** 공지사항 공개, 비공개 완료 팝업 */
  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  /** 라우팅 이동 */
  const navigate = useNavigate()

  /** React Query 캐시 제어 */
  const queryClient = useQueryClient()

  /** 기본 alert 대신 공통 모달 열기 */
  const showAlert = (message: string) => {
    setModalMessage(message)
    setOpen(true)
  }

  /**
   * 공지사항 목록 조회
   * searchKeyword, currentPage가 바뀔 때마다 API 재호출
   */
  const {
    data: noticeResponse,
    isLoading,
    isFetching,
    isError,
  } = useQuery<NoticeListResponse>({
    queryKey: ['notices', searchKeyword, currentPage],
    queryFn: () =>
      getRecentNoticeRequests({
        keyword: searchKeyword,
        page: currentPage,
        size: PAGE_SIZE,
      }),
  })

  /** 검색어 유효성 검사 */
  const searchSchema = z
    .string({
      required_error: '검색어를 입력해주세요.',
    })
    .trim()
    .min(2, '검색어는 2글자 이상 입력해주세요.')
    .max(15, '검색어는 15자 이하로 입력해주세요.')
    .regex(/^[가-힣a-zA-Z0-9\s]+$/, '검색어에는 한글, 영문, 숫자만 입력할 수 있습니다.')

  /** 서버에서 받은 공지사항 목록 */
  const notices = noticeResponse?.items ?? []

  /** 서버에서 받은 전체 개수 */
  const totalCount = noticeResponse?.totalCount ?? 0

  /** 전체 페이지 수 */
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  /** 요약 카드 데이터 */
  const noticeSummaryCards: SummaryCard[] = [
    {
      label: '전체 공지',
      count: totalCount,
      color: 'orange',
      icon: <FileText size={20} />,
    },
    {
      label: '공개 중',
      count: notices.filter((notice) => notice.isOpen).length,
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

  /**
   * 공개 / 비공개 상태 변경 mutation
   * 상태 변경 성공 후 목록을 다시 조회함
   */
  const togglePublicMutation = useMutation({
    mutationFn: async ({ noticeId, value }: { noticeId: number; value: boolean }) => {
      const detail = await getNoticeDetail(noticeId)

      await updateNotice(noticeId, {
        title: detail.title,
        content: detail.content,
        isOpen: value,
      })

      return value
    },
    onSuccess: (value) => {
      queryClient.invalidateQueries({
        queryKey: ['notices'],
      })

      setModalMessage(value ? '공개되었습니다.' : '비공개되었습니다.')
      setOpen(true)
    },
    onError: (e) => {
      console.error('공개 상태 변경 실패:', e)
      showAlert('공개 상태 변경 실패')
    },
  })

  /** 공개 / 비공개 상태 변경 */
  const handleTogglePublic = (noticeId: number, value: boolean) => {
    togglePublicMutation.mutate({
      noticeId,
      value,
    })
  }

  /**
   * 검색
   * keyword: input에 입력 중인 값
   * searchKeyword: 실제 API 검색에 사용하는 값
   */
  const handleSearch = () => {
    const trimmed = keyword.trim()

    // 검색어 비어있으면 전체조회
    if (!trimmed) {
      setSearchKeyword('')
      setCurrentPage(1)
      return
    }
    const result = searchSchema.safeParse(keyword)

    if (!result.success) {
      setModalMessage(result.error.issues[0].message)
      setOpen(true)
      return
    }

    setSearchKeyword(result.data)
    setCurrentPage(1)
    setSelectedIds([])
  }

  /**
   * 선택 삭제 mutation
   * 삭제 성공 후 목록을 다시 조회함
   */
  const deleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((noticeId) => deleteNotice(noticeId)))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notices'],
      })

      setSelectedIds([])
      setCurrentPage(1)

      setModalMessage('삭제되었습니다.')
      setOpen(true)
    },
    onError: (e) => {
      console.error('삭제 실패:', e)
      showAlert('삭제에 실패했습니다.')
    },
  })

  /** 선택 삭제 */
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      setModalMessage('삭제할 공지사항을 선택해주세요.')
      setOpen(true)
      return
    }

    deleteMutation.mutate(selectedIds)
  }

  /** 등록 */
  const handleCreate = () => {
    navigate('/admin/notice/create')
  }

  /**
   * 현재 페이지에 보여줄 공지사항 목록 */
  const pagedNotices = notices.map((notice, index) => ({
    ...notice,

    // 화면 기준 번호
    displayNo: (currentPage - 1) * PAGE_SIZE + index + 1,
  }))

  /** 테이블 컬럼 */
  const noticeColumns: TableColumn<NoticeApiItem>[] = [
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
    {
      key: 'displayNo',
      header: '번호',
      width: '100px',
    },
    {
      key: 'title',
      header: '제목',
      width: '600px',
      render: (row) => (
        <button
          type="button"
          className={`${S.ellipsis} ${S.btn}`}
          onClick={() => navigate(`/admin/notice/${row.noticeId}/edit`)}
        >
          {row.title}
        </button>
      ),
    },
    {
      key: 'createdDate',
      header: '작성일',
      width: '200px',
    },
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

  /** 로딩 표시 여부 */
  const showLoading = isLoading || isFetching

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

            <div className={S.table_box}>
              {showLoading ? (
                <div className={S.skeletonWrapper}>
                  <TableSkeleton
                    columns={[
                      { header: '', width: '5%' },
                      { header: '번호', width: '10%' },
                      { header: '제목', width: '55%' },
                      { header: '작성일', width: '15%' },
                      { header: '공개여부', width: '15%' },
                    ]}
                    rows={PAGE_SIZE}
                  />
                </div>
              ) : isError ? (
                <div className={S.empty}>데이터를 불러오는데 실패했습니다.</div>
              ) : (
                <Table columns={noticeColumns} data={pagedNotices} />
              )}
            </div>

            <div className={S.table_footer}>
              <span>
                총 {totalCount}건 중 {totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
                {Math.min(currentPage * PAGE_SIZE, totalCount)}건 표시
              </span>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page)
                  setSelectedIds([])
                }}
              />
            </div>
          </section>
        </main>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        buttonType="one"
      >
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
