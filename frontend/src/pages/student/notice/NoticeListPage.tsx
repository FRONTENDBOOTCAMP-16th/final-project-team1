import StudentLayout from "@/pages/sample/StudentLayout"
import Table from "@/components/common/table/Table"
import type { TableColumn } from "@/components/common/table/table.types"
import S from './styles/noticeList.module.css'
import { SearchBar } from "@/components"

// ==========================================
// 1. 타입 정의 (페이지 안에서)
// ==========================================
interface Notice {
    noticeId: number
    title: string
    createdDate: string
}

// ==========================================
// 2. 메인 컴포넌트
// ==========================================
function NoticeListPage() {
    // 컬럼 정의 (페이지 안에서)
    const noticeColumns: TableColumn<Notice>[] = [
        { key: 'noticeId', header: '번호', width: '100px' },
        { key: 'title', header: '제목', align: 'left' },
        { key: 'createdDate', header: '작성일', width: '150px' },
    ]

    // 가상 데이터 (페이지 안에서, 나중에 API로 교체)
    const noticeData: Notice[] = [
        {
            noticeId: 1,
            title: '휴가 신청 안내',
            createdDate: '2024.04.20',
        },
        {
            noticeId: 2,
            title: '시스템 점검 안내',
            createdDate: '2024.04.18',
        },
        {
            noticeId: 3,
            title: '강의 일정 변경 공지',
            createdDate: '2024.04.15',
        },
    ]

    return (
        <div className={S.noticeListContainer}>
            <StudentLayout>
                <SearchBar placeholder="공지사항 검색" />
                <Table 
                    columns={noticeColumns} 
                    data={noticeData}
                    rowKey={(row) => row.noticeId}
                />  
            </StudentLayout>
        </div>
    )
}

export default NoticeListPage