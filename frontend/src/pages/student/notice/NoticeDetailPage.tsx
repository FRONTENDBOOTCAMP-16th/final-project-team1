import { useParams, useNavigate } from 'react-router-dom'
import StudentLayout from '@/pages/sample/StudentLayout'
import NoticeBoard from '@/components/common/noticeBoard/noticeBoard'
import S from './styles/noticeList.module.css'

function NoticeDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    
    // 가상 데이터 (API 연동 시 교체)
    const notice = {
        noticeId: Number(id),
        title: '봄학기 중간 평가 공지',
        date: '2026.04.10',
        content: `멋쟁이사자처럼 16기 수강생 여러분께,

봄학기 중간 평가 일정을 안내드립니다.

■ 평가 일정
- 일시: 2026년 4월 25일(목) 오후 2시 ~ 5시
- 장소: 온라인 (Zoom 링크는 별도 공지)`,
    }
    
    return (
        <div className={S.noticeDetailContainer}>
            <StudentLayout>
                <NoticeBoard
                    title={notice.title}
                    date={notice.date}
                    content={notice.content}
                    onBackClick={() => navigate('/student/notice')}
                />
            </StudentLayout>
        </div>
    )
}

export default NoticeDetailPage