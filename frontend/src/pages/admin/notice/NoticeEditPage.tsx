import { useState } from 'react'
import { Button } from '@/components'
import { SquarePen } from 'lucide-react'

import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import AdminLayout from '@/pages/sample/AdminLayout'
import S from './styles/noticeEditor.module.css'

export default function NoticeEditPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

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
          <Button variant="primary">
            <SquarePen size={16} />
            수정 하기
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
