import { FileText, Check, X } from 'lucide-react'
import { useState } from 'react'

import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

import { Button} from '@/components'
import S from '@/pages/admin/leave/styles/leave.module.css'

import LeaveStatusTabs from '@/pages/admin/leave/components/leaveStatusTabs'
import type { TabType } from '@/pages/admin/leave/components/leaveStatusTabs.type'


import Table from '@/components/common/table'
import { type TableColumn } from '@/components/common/table'

import AdminLayout from '@/pages/sample/AdminLayout'

type VacationType = '병결' | '공결' | '개인사유'
type Vacation = {
  name: string
  studentNo: string
  vacationType: VacationType
  period: string
}

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
  {
    label: '공개 중',
    count: 6,
    color: 'red',
    icon: <X size={20} />,
  },
]

const vacationTypeMap = {
  병결: {
    label: '병결',
    className: S.vacationSick,
  },
  공결: {
    label: '공결',
    className: S.vacationOfficial,
  },
  개인사유: {
    label: '개인사유',
    className: S.vacationPersonal,
  },
}

export default function LeaveApprovePage() {
  
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  const actionColumn: TableColumn<Vacation> = {
    key: 'action',
    header: '처리',
    render: () => {
      if (activeTab === 'pending') {
        return (
          <div className={S.actionBox}>
            <Button type="button" variant="active">
              <Check size={16} />
              승인
            </Button>

            <Button type="button" variant="inactive">
              <X size={16} />
              반려
            </Button>
          </div>
        )
      }

      if (activeTab === 'approved') {
        return (
          <Button type="button" variant="active">
            <Check size={16} />
            승인
          </Button>
        )
      }

      return (
        <Button type="button" variant="inactive">
          <X size={16} />
          반려
        </Button>
      )
    },
  }
  
  const vacationColumns: TableColumn<Vacation>[] = [
    {
      key: 'name',
      header: '신청자',
      render: (row) => (
        <div className={S.nameBox}>
          <span className={S.tit}>{row.name}</span>
        </div>
      ),
    },
    { key: 'studentNo', header: '학번' },
    {
      key: 'vacationType',
      header: '휴가종류',
      render: (row) => {
        const vacation = vacationTypeMap[row.vacationType]
        return <span className={`${S.statusBadge} ${vacation.className}`}>{vacation.label}</span>
      },
    },
    { key: 'period', header: '기간' },
    actionColumn,
  ]

  const pendingData: Vacation[] = [
    {
      name: '김민수',
      studentNo: '2024001',
      vacationType: '병결',
      period: '2026.04.28 - 2026.04.29',
    },
  ]

  const approvedData: Vacation[] = [
    {
      name: '황재호',
      studentNo: '2024002',
      vacationType: '공결',
      period: '2026.04.20 - 2026.04.21',
    },
  ]

  const rejectedData: Vacation[] = [
    {
      name: '정호영',
      studentNo: '2024003',
      vacationType: '개인사유',
      period: '2026.04.15 - 2026.04.16',
    },
  ]

  let currentData = pendingData

  if (activeTab === 'approved') {
    currentData = approvedData
  } else if (activeTab === 'rejected') {
    currentData = rejectedData
  }


  return (
    <AdminLayout>
      <div className={S.page}>
        <main className={S.main}>
          <section>
            <StatusSummary cards={noticeSummaryCards} />
          </section>

          <section className={S.content}>
            <LeaveStatusTabs activeTab={activeTab} onChange={setActiveTab} />
            <Table columns={vacationColumns} data={currentData} />
          </section>
        </main>
      </div>
    </AdminLayout>
  )
}