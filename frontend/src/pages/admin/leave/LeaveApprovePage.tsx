import { FileText, Check, X } from 'lucide-react'
import { useState } from 'react'

import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

import { Header } from '@/components'
import Sidebar from '@/components/common/sidebar/Sidebar'
import S from '@/pages/admin/leave/styles/leave.module.css'

import LeaveStatusTabs from '@/pages/admin/leave/components/leaveStatusTabs'
import type { TabType } from '@/pages/admin/leave/components/leaveStatusTabs.type'



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


export default function LeaveApprovePage() {
  
const [activeTab, setActiveTab] = useState<TabType>('pending')
  return (
    <div className={S.page}>
      <Sidebar role="admin" />

      <main className={S.main}>
        <Header />

        <section className={S.content}>
          <StatusSummary cards={noticeSummaryCards} />
        </section>

        <div>
          <LeaveStatusTabs activeTab={activeTab} onChange={setActiveTab} />

          {/* 조건 렌더링 */}
          {activeTab === 'pending' && <div>승인 대기 리스트</div>}
          {activeTab === 'approved' && <div>승인 완료 리스트</div>}
          {activeTab === 'rejected' && <div>반려 내역 리스트</div>}
        </div>
      </main>
    </div>
  )
}