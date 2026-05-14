// 외부 라이브러리
import { useState } from 'react'
import { SquarePen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

// 공통 컴포넌트
import { Button } from '@/components'
import Modal from '@/components/common/modal/Modal'

// 레이아웃
import AdminLayout from '@/pages/sample/AdminLayout'

// 페이지 내부 API / 스타일
import { createNotice } from '../api/noticeApi'
import S from '../styles/noticeEditor.module.css'

export default function NoticeCreatePage() {
  /** 공지사항 제목 입력값 */
  const [title, setTitle] = useState('')

  /** 공지사항 본문 에디터 입력값 */
  const [content, setContent] = useState('')

  /** 등록 완료 모달 열림 여부 */
  const [open, setOpen] = useState(false)

  /** 모달에 표시할 메시지 */
  const [modalMessage, setModalMessage] = useState('')

  /** 모달 확인 후 실행할 동작 */
  const [modalAction, setModalAction] = useState<(() => void) | null>(null)

  /** 페이지 이동 함수 */
  const navigate = useNavigate()

  /** ReactQuill 에디터 툴바 설정 */
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }],
    ],
  }

  /** ReactQuill은 비어 있어도 <p><br></p>가 들어오므로 텍스트만 추출해서 빈 값 검사 */
  const isEmptyContent = (html: string) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent?.trim() === ''
  }

  /** 모달 열기 */
  const showModal = (message: string, action?: () => void) => {
    setModalMessage(message)
    setModalAction(() => action ?? null)
    setOpen(true)
  }

  /** 공지사항 등록 */
  const handleCreateNotice = async () => {
    if (!title.trim()) {
      showModal('제목을 입력해주세요.')
      return
    }

    if (isEmptyContent(content)) {
      showModal('내용을 입력해주세요.')
      return
    }

    try {
      await createNotice({
        title,
        content,
      })

      showModal('공지사항이 등록되었습니다.', () => {
        navigate('/admin/notice')
      })
    } catch (error) {
      console.error('공지 등록 실패:', error)
      showModal('공지 등록에 실패했습니다.')
    }
  }

  /** 모달 닫기 */
  const handleCloseModal = () => {
    setOpen(false)

    if (modalAction) {
      modalAction()
      setModalAction(null)
    }
  }

  return (
    <AdminLayout>
      <div className={S.page}>
        <div className={S.formGroup}>
          <label className={S.title}>본문 제목</label>
          <input
            className={S.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지사항 제목을 입력하세요"
          />
        </div>

        <div className={S.formGroup}>
          <label className={S.title}>본문 내용</label>

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="공지사항 본문을 입력하세요."
            className={S.editor}
          />
        </div>

        <div className={S.btn}>
          <Button variant="primary" onClick={handleCreateNotice}>
            <SquarePen size={16} />
            글쓰기
          </Button>
        </div>
      </div>

      <Modal isOpen={open} onClose={handleCloseModal} onConfirm={handleCloseModal} buttonType="one">
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
