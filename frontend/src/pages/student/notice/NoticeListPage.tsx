import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentLayout from "@/pages/sample/StudentLayout"
import Table from "@/components/common/table/Table"
import Button from "@/components/common/button/ui/button"
import type { TableColumn } from "@/components/common/table/table.types"
import { SearchBar } from "@/components"
import Pagination from "@/components/common/pagination"
import { getNoticeList } from './api/noticeApi'
import type { NoticeItem } from './api/noticeApi'
import S from './styles/noticeList.module.css'

function NoticeListPage() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [noticeList, setNoticeList] = useState<NoticeItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [keyword, setKeyword] = useState('')

    const totalPages = Math.ceil(totalCount / 10)

    useEffect(() => {
        const fetchNoticeList = async () => {
            try {
                const data = await getNoticeList({
                    keyword: keyword || undefined,
                    page: currentPage,
                    size: 10,
                })
                setNoticeList(data.items)
                setTotalCount(data.totalCount)
            } catch (err) {
                console.error('공지사항 목록 조회 실패:', err)
            }
        }

        fetchNoticeList()
    }, [currentPage, keyword])

    const noticeColumns: TableColumn<NoticeItem>[] = [
        { key: 'noticeId', header: '번호', width: '100px' },
        {
            key: 'title',
            header: '제목',
            align: 'left',
            render: (row) => (
                <button
                    type="button"
                    className={S.TitleButton}
                    onClick={() => navigate(`/student/notice/${row.noticeId}`)}
                >
                    {row.title}
                </button>
            ),
        },
        { key: 'createdDate', header: '작성일', width: '150px' },
    ]

    return (
    <div className={S.noticeListContainer}>
        <StudentLayout>
            <div className={S.searchBox}>
    <SearchBar
        placeholder="공지사항 검색"
        onChange={(e) => {
            setKeyword(e.target.value)
            setCurrentPage(1)
        }}
    />
    <Button variant="dark" onClick={() => setCurrentPage(1)}>
        검색
    </Button>
</div>
            <div className={S.tableBox}>
                <Table 
                    columns={noticeColumns} 
                    data={noticeList}
                    rowKey={(row) => row.noticeId}
                />
            </div>
            <div className={S.paginationBox}>
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </StudentLayout>
    </div>
)
}

export default NoticeListPage