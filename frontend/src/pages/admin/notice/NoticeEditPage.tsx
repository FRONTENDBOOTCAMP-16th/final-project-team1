import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components'
import { SquarePen } from 'lucide-react'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import AdminLayout from '@/pages/sample/AdminLayout'
import FormSkeleton from '@/components/common/skeleton/FormSkeleton'
import Modal from '@/components/common/modal/Modal'

import { getNoticeDetail, updateNotice } from './api/noticeApi'
import S from './styles/noticeEditor.module.css'

/** 공지사항 입력값 유효성 검사 */
const noticeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력해주세요.')
    .max(30, '제목은 30자 이하로 입력해주세요.')
    .regex(/^(?![ㄱ-ㅎㅏ-ㅣ]+$).*/, '자음 또는 모음만 입력할 수 없습니다.'),

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

  isOpen: z.boolean(),
})

export default function NoticeEditPage() {
  /** 제목 상태 */
  const [title, setTitle] = useState('')

  /** 본문 상태 */
  const [content, setContent] = useState('')

  /** 공개 여부 상태 */
  const [isOpen, setIsOpen] = useState(true)

  /** 상세 조회 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false)

  /** 안내 팝업 상태 */
  const [open, setOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  /** 팝업 확인 후 실행할 동작 */
  const [modalAction, setModalAction] = useState<(() => void) | null>(null)

  /** URL 파라미터 가져오기 */
  const { id } = useParams()

  /** 페이지 이동 */
  const navigate = useNavigate()

  /** 공지 상세 조회 */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // id 없으면 종료
        if (!id) return

        setIsLoading(true)

        // 상세 조회 API 호출
        const detail = await getNoticeDetail(Number(id))

        // state 세팅
        setTitle(detail.title)
        setContent(detail.content)
        setIsOpen(detail.isOpen)
      } catch (error) {
        console.error('공지 상세 조회 실패:', error)

        setModalMessage('공지 데이터를 불러오지 못했습니다.')
        setModalAction(null)
        setOpen(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  /** 공지 수정 */
  const handleUpdateNotice = async () => {
    const result = noticeSchema.safeParse({
      title,
      content,
      isOpen,
    })

    if (!result.success) {
      setModalMessage(result.error.issues[0].message)
      setModalAction(null)
      setOpen(true)
      return
    }

    try {
      if (!id) return

      await updateNotice(Number(id), result.data)

      setModalMessage('수정되었습니다.')

      // 확인 버튼 클릭 시 목록 페이지로 이동
      setModalAction(() => () => {
        navigate('/admin/notice')
      })

      setOpen(true)
    } catch (error) {
      console.error('공지 수정 실패:', error)

      setModalMessage('공지 수정에 실패했습니다.')
      setModalAction(null)
      setOpen(true)
    }
  }

  /** 팝업 닫기 */
  const handleCloseModal = () => {
    setOpen(false)

    if (modalAction) {
      modalAction()
      setModalAction(null)
    }
  }

  /** ReactQuill 툴바 설정 */
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'bullet' }, { list: 'ordered' }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }],
    ],
  }

  return (
    <AdminLayout>
      <div className={S.page}>
        {/* 제목 입력 */}
        <div className={S.formGroup}>
          <label className={S.title}>본문 제목</label>

          {isLoading ? (
            <FormSkeleton type="input" />
          ) : (
            <input
              className={S.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
            />
          )}
        </div>

        {/* 본문 입력 */}
        <div className={S.formGroup}>
          <label className={S.title}>본문 내용</label>

          {isLoading ? (
            <FormSkeleton type="editor" />
          ) : (
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="공지사항 본문을 입력하세요."
              className={S.editor}
            />
          )}
        </div>

        {/* 수정 버튼 */}
        <div className={S.btn}>
          <Button variant="primary" onClick={handleUpdateNotice} disabled={isLoading}>
            <SquarePen size={16} />
            수정 하기
          </Button>
        </div>
      </div>

      <Modal isOpen={open} onClose={handleCloseModal} onConfirm={handleCloseModal} buttonType="one">
        {modalMessage}
      </Modal>
    </AdminLayout>
  )
}
