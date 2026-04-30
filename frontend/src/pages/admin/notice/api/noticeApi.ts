import { api } from '@/api/axios'

// 리스트 조회
export async function getRecentNoticeRequests() {
  const res = await api.get('/api/admin/notices', {
    params: {
      page: 1,
      size: 100,
    },
  })

  return res.data.data.items
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
  return api.put(`/api/admin/notices/${noticeId}`, payload)
}
