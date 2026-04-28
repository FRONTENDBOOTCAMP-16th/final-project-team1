import { FileText, Check, X } from 'lucide-react'
import StatusSummary from '@/components/common/statusSummary/StatusSummary'
import type { SummaryCard } from '@/components/common/statusSummary/statusSummary.type'

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

export default function NoticePage() {
  return <StatusSummary cards={noticeSummaryCards} />
}
