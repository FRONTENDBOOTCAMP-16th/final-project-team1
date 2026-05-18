// 외부 라이브러리
import { useState } from 'react'
import { SquarePen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
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

/** 공지사항 입력값 유효성 검사 */
const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이하로 입력해주세요.')
    .regex(
      /^(?![ㄱ-ㅎㅏ-ㅣ]+$).*/,
      '자음 또는 모음만 입력할 수 없습니다.',
    ),
  

  content: z.string().refine(
    (value) => {
      const div = document.createElement('div')
      div.innerHTML = value
      return div.textContent?.trim() !== ''
    },
    {
      message: '내용을 입력해주세요.',
    },
  ),
})

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

  /** 모달 열기 */
  const showModal = (message: string, action?: () => void) => {
    setModalMessage(message)
    setModalAction(() => action ?? null)
    setOpen(true)
  }

  /** 공지사항 등록 */
  const handleCreateNotice = async () => {
    const result = noticeSchema.safeParse({
      title,
      content,
    })

    if (!result.success) {
      showModal(result.error.issues[0].message)
      return
    }

    try {
      await createNotice(result.data)

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
