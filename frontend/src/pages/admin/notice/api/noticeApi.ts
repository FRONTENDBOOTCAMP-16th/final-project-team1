import { api } from '@/api/axios'

/** 공지사항 목록 조회 요청 파라미터 */
export type NoticeListParams = {
  keyword?: string
  page: number
  size: number
}

/** 서버에서 내려오는 공지사항 데이터 구조 */
export type NoticeApiItem = {
  noticeId: number
  displayNo: number
  title: string
  createdDate: string
  isOpen: boolean
  openStatusName: string
}

/** 공지사항 목록 조회 응답 구조 */
export type NoticeListResponse = {
  items: NoticeApiItem[]
  totalCount: number
}

/**
 * 리스트 조회
 *
 * 기존:
 * page: 1, size: 100 고정
 *
 * 변경:
 * 화면에서 넘긴 keyword, page, size 기준으로 조회
 */
export async function getRecentNoticeRequests({
  keyword = '',
  page,
  size,
}: NoticeListParams): Promise<NoticeListResponse> {
  const res = await api.get('/api/admin/notices', {
    params: {
      keyword,
      page,
      size,
    },
  })

  return res.data.data
}

// 삭제
export async function deleteNotice(noticeId: number) {
  const res = await api.delete(`/api/admin/notices/${noticeId}`)
  return res.data.data
}

// 상세 조회
export async function getNoticeDetail(noticeId: number) {
  const res = await api.get(`/api/admin/notices/${noticeId}`)
  return res.data.data
}

// 수정
export async function updateNotice(
  noticeId: number,
  payload: {
    title: string
    content: string
    isOpen: boolean
  },
) {
  const res = await api.put(`/api/admin/notices/${noticeId}`, payload)
  return res.data.data
}

// 리스트 등록
export async function createNotice(payload: { title: string; content: string }) {
  const res = await api.post('/api/admin/notices', payload)
  return res.data
}
