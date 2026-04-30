import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button' 
import S from './styles/noticeList.module.css'

function NoticeDetailPage() {
  return (
    <div className={S.noticeDetailContainer}>
      <StudentLayout>
        <div className="noticeNote">  
          <div className={S.noticeTitle}>
            <h2 className={S.noticeTitle}>타이틀</h2>
            <p className={S.noticeContent}>공지사항 요약 내용</p>
          </div>
          <div className={S.noticeInfo}></div>
          <div className={S.returnNoticeList}>
             <Button variant="primary" size="lg">목록으로 돌아가기</Button>
          </div>
        </div>
      </StudentLayout>
    </div>
  )
}

export default NoticeDetailPage
