import DOMPurify from 'dompurify'
import Button from '../button/ui/button'
import S from './noticeBoard.module.css'

interface NoticeBoardProps {
    title: string
    date: string
    content: string
    onBackClick: () => void
}

export default function NoticeBoard({
    title,
    date,
    content,
    onBackClick,
}: NoticeBoardProps) {
    return (
        <div className={S.noticeBoard}>
            <div className={S.noticeTitle}>
                <h2 className={S.noticeHeading}>{title}</h2>
                <p className={S.noticeDate}>작성일 {date}</p>
            </div>
            <div className={S.noticeContent}>
                <div
                    className={S.noticeText}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
                />
            </div>
            <div className={S.returnList}>
                <Button 
                    type="button" 
                    variant="primary" 
                    size="lg"
                    onClick={onBackClick}
                >
                    목록으로 돌아가기
                </Button>
            </div>
        </div>
    )
}