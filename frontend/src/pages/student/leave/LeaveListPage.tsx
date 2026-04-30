import StudentLayout from "@/pages/sample/StudentLayout"
import Button from "@/components/common/button/ui/button"
import CommonTable from "@/components/common/table/Table"
import type { TableColumn } from "@/components/common/table/table.types"
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import S from './styles/leave.module.css'

// ==========================================
// 1. 타입 정의
// ==========================================
type VacationResultStatus = '승인 대기' | '승인 완료' | '반려'
type LeaveReason = '병결' | '공결' | '개인사유'

interface VacationHistory {
    leaveRequestId: number
    studentNo: string
    reason: LeaveReason
    period: string
    status: VacationResultStatus
}

// ==========================================
// 2. 처리상태 맵 (3가지 색상 구분)
// ==========================================
const statusMap: Record<VacationResultStatus, { className: string }> = {
    '승인 대기': {
        className: S.statusPending,
    },
    '승인 완료': {
        className: S.statusApproved,
    },
    '반려': {
        className: S.statusRejected,
    },
}

// ==========================================
// 3. 메인 컴포넌트
// ==========================================
function LeaveListPage() {
   const navigate = useNavigate()   

    const historyColumns: TableColumn<VacationHistory>[] = [
        { key: 'studentNo', header: '학번' },
        {
            key: 'reason',
            header: '종류',
            render: (row) => (
                <span className={`${S.statusBadge} ${S.reasonPersonal}`}>
                    {row.reason}
                </span>
            ),
        },
        { key: 'period', header: '휴가기간' },
        {
            key: 'status',
            header: '처리상태',
            render: (row) => {
                const result = statusMap[row.status]
                return (
                    <span className={`${S.statusBadge} ${result.className}`}>
                        {row.status}
                    </span>
                )
            },
        },
    ]

    const historyData: VacationHistory[] = [
        {
            leaveRequestId: 1,
            studentNo: '2024001',
            reason: '공결',
            period: '2024.04.20 - 2024.04.21',
            status: '승인 완료',
        },
        {
            leaveRequestId: 2,
            studentNo: '2024001',
            reason: '병결',
            period: '2024.04.25 - 2024.04.25',
            status: '반려',
        },
        {
            leaveRequestId: 3,
            studentNo: '2024001',
            reason: '개인사유',
            period: '2024.04.30 - 2024.05.02',
            status: '승인 대기',
        },
    ]

    return (
        <div className={S.leaveContainer}>
            <StudentLayout>
                <div className={S.ButtonBox}>
                    <div className={S.leftButton}>
                        <Button variant="dark">전체</Button>
                        <Button variant="blank">승인 대기</Button>
                        <Button variant="blank">완료</Button>         
                    </div>
                    <div className={S.rightButton}>
                        <Button variant="primary" onClick={() => navigate('/student/leave/request')} >
                            <Plus size={16} />
                            휴가신청 하기
                        </Button>
                    </div>
                </div>
                
                <CommonTable 
                    columns={historyColumns} 
                    data={historyData}
                    rowKey={(row) => row.leaveRequestId}
                />
            </StudentLayout>
        </div>
    )
}

export default LeaveListPage