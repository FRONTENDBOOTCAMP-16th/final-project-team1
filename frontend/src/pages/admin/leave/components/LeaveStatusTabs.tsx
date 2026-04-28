import S from '@/pages/admin/leave/styles/leaveTabs.module.css'
import type { TabType } from '@/pages/admin/leave/components/leaveStatusTabs.type'

type Props = {
  activeTab: TabType
  onChange: (tab: TabType) => void
}

const tabs: { key: TabType; label: string }[] = [
  { key: 'pending', label: '승인 대기' },
  { key: 'approved', label: '승인 완료' },
  { key: 'rejected', label: '반려 내역' },
]

export default function LeaveStatusTabs({ activeTab, onChange }: Props) {
  return (
    <div className={S.statusTab}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={`${S.tab} ${activeTab === tab.key ? S.active : ''}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}