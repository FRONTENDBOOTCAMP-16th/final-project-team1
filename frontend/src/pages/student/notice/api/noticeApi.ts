import { api } from '@/api/axios'

// 타입 정의
export interface NoticeItem {
    noticeId: number
    title: string
    createdDate: string
    isOpen: boolean
}

export interface NoticeDetail {
    noticeId: number
    title: string
    content: string
    createdDate: string
}

// 공지사항 목록 조회
export async function getNoticeList(params: {
    keyword?: string
    page: number
    size: number
}) {
    const response = await api.get('/api/student/notices', { params })
    return response.data.data
}

// 공지사항 상세 조회
export async function getNoticeDetail(noticeId: number) {
    const response = await api.get(`/api/student/notices/${noticeId}`)
    return response.data.data
}