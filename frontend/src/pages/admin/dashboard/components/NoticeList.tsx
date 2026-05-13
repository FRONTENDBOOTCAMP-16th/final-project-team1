import S from '@/pages/admin/dashboard/styles/dashboard.module.css'
import type { NoticeItem } from '@/pages/admin/dashboard/api/dashboardApi'
import { useNavigate } from 'react-router-dom'

interface Props {
  data: NoticeItem[]
}

export default function NoticeList({ data }: Props) {
  const navigate = useNavigate()
  return (
    <>
      <h3 className={S.title}>시스템 공지사항</h3>

      <ul className={S.list}>
        {data.slice(0, 5).map((item) => (
          <li
            key={item.noticeId}
            className={S.item}
            onClick={() => navigate(`/admin/notice/${item.noticeId}`)}
          >
            <strong className={S.noticeTitle}>{item.title}</strong>
            <span className={S.noticeDate}>{item.createdDate}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
