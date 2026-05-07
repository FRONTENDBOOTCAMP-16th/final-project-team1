import { useNavigate } from 'react-router-dom'
import Button from "@/components/common/button/ui/button"
import lionImage from '@/assets/404_lion.png'
import S from './notfound.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={S.notFoundContainer}>
      <img src={lionImage} sizes='200px' alt="404 사자 이미지" className={S.lionImage} />
      <div className={S.textContainer}>
        <h3 className={S.notFoundTitle}>
          <span className={S.color}>404</span> Not Found
        </h3>
        <p className={S.notFoundText}>
          이런! 페이지를 찾을 수 없습니다.<br/>
          이전 페이지로 돌아가시겠습니까?
        </p>
        <Button variant="primary" onClick={() => navigate(-1)}>
          이전으로 돌아가기
        </Button>
      </div>
    </div>
  )
}