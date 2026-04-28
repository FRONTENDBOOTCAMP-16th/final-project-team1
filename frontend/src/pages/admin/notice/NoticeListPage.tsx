import { FileText, Check, X } from 'lucide-react'
import { useState } from 'react'

import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import NoticeFilterBar from './components/NoticeFilterBar'

import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

import S from '@/pages/admin/leave/styles/leave.module.css'


import AdminLayout from '@/pages/sample/AdminLayout'

import { Button } from '@/components'

import Table, { type TableColumn } from '@/components/common/table'

type Notice = {
  no: string
  title: string
  createdAt: string
  isPublic: boolean
}

const noticeColumns: TableColumn<Notice>[] = [
  { key: 'no', header: '번호' },
  { key: 'title', header: '제목' },
  { key: 'createdAt', header: '작성일' },
  {
    key: 'isPublic',
    header: '공개여부',
    render: () => (
      <div className={S.actionBox}>
        <Button type="button" variant="active">
          <Check size={16} />
          공개
        </Button>

        <Button type="button" variant="inactive">
          <X size={16} />
          비공개
        </Button>
      </div>
    ),
  },
]

const noticeSummaryCards: SummaryCard[] = [
  {
    label: '전체 공지',
    count: 8,
    color: 'orange',
    icon: <FileText size={20} />,
  },
  {
    label: '공개 중',
    count: 6,
    color: 'green',
    icon: <Check size={20} />,
  },
]


export default function NoticeListPage() {

  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    console.log('검색:', keyword)
  }
  const handleDelete = () => {
    console.log('삭제')
  }
  const handleCreate = () => {
    console.log('등록')
  }

  const noticeData: Notice[] = [
    {
      no: '01',
      title: '공지사항 제목을 입력해주세요',
      createdAt: '2026.04.20',
      isPublic: true,
    },
    {
      no: '02',
      title: '공지사항 제목을 입력해주세요',
      createdAt: '2026.04.20',
      isPublic: false,
    },
  ]

  return (
    <AdminLayout>
      <div className={S.page}>
        <main className={S.main}>
          <section>
            <StatusSummary cards={noticeSummaryCards} />
          </section>

          <section className={S.content}>
            <NoticeFilterBar
              keyword={keyword}
              onChangeKeyword={setKeyword}
              onSearch={handleSearch}
              onDelete={handleDelete}
              onCreate={handleCreate}
            />
            <Table
              columns={noticeColumns}
              data={noticeData}
              totalCount={248}
              currentPage={1}
              pageSize={12}
              countLabel="명"
            />
          </section>
        </main>
      </div>
    </AdminLayout>
  )
}
