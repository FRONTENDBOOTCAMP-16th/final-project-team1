import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

const notices = [
  { id: 1, title: '4월 훈련평가 일정', date: '2026.04.20' },
  { id: 2, title: '공결 신청 시 증빙서류 제출 항목', date: '2026.04.11' },
  { id: 3, title: '공결 신청 시 증빙서류 제출 항목', date: '2026.04.11' },
  { id: 4, title: '공결 신청 시 증빙서류 제출 항목', date: '2026.04.11' },
  { id: 4, title: '공결 신청 시 증빙서류 제출 항목', date: '2026.04.11' },
  { id: 4, title: '공결 신청 시 증빙서류 제출 항목', date: '2026.04.11' },
]

export default function NoticeList() {
  return (
    <div className={S.container}>
      <h2 className={S.title}>시스템 공지사항</h2>

      <ul className={S.list}>
        {notices.slice(0, 4).map((notice, index) => (
          <li key={notice.id} className={`${S.item} ${index === 0 ? S.highlight : ''}`}>
            <p className={S.noticeTitle}>{notice.title}</p>
            <span className={S.date}>{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
