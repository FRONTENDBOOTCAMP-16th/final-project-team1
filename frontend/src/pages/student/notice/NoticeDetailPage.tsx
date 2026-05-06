import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import StudentLayout from '@/pages/sample/StudentLayout'
import NoticeBoard from '@/components/common/noticeBoard/noticeBoard'
import { getNoticeDetail } from './api/noticeApi'
import type { NoticeDetail } from './api/noticeApi'
import S from './styles/noticeDetail.module.css'

function NoticeDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [notice, setNotice] = useState<NoticeDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const data = await getNoticeDetail(Number(id))
                setNotice(data)
            } catch (err) {
                console.error('공지사항 조회 실패:', err)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchNotice()
    }, [id])

    if (isLoading) return null 
    if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>

    return (
        <div className={S.noticeDetailContainer}>
            <StudentLayout>
                <NoticeBoard
                    title={notice.title}
                    date={notice.createdDate}
                    content={notice.content}
                    onBackClick={() => navigate('/student/notice')}
                />
            </StudentLayout>
        </div>
    )
}

export default NoticeDetailPage