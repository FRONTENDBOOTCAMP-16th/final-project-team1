import Pagination from "@/components/common/pagination"
import TableSkeleton from '@/components/common/skeleton/TableSkeleton'
import StudentLayout from "@/pages/sample/StudentLayout"
import Table from "@/components/common/table/Table"
import Button from "@/components/common/button/ui/button"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from "@/components"
import { getNoticeList } from './api/noticeApi'
import type { NoticeItem } from './api/noticeApi'
import type { TableColumn } from "@/components/common/table/table.types"
import S from './styles/noticeList.module.css'

const PAGE_SIZE = 10

function NoticeListPage() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [allNotices, setAllNotices] = useState<NoticeItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [keyword, setKeyword] = useState('')
    const [searchKeyword, setSearchKeyword] = useState('')

    const totalPages = Math.ceil(totalCount / PAGE_SIZE)
    const indexOfLastNotice = currentPage * PAGE_SIZE
    const indexOfFirstNotice = indexOfLastNotice - PAGE_SIZE
    const noticeList = allNotices.slice(indexOfFirstNotice, indexOfLastNotice)

    useEffect(() => {
        const fetchNoticeList = async () => {
            try {
                setLoading(true)
                const data = await getNoticeList({
                    keyword: searchKeyword || undefined,
                    page: currentPage,
                    size: PAGE_SIZE,
                })
                setAllNotices(
                    [...data.items].sort((a, b) =>
                        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                    )
                )
                setTotalCount(data.totalCount)
            } catch (err) {
                console.error('공지사항 목록 조회 실패:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchNoticeList()
    }, [currentPage, searchKeyword])

    const handleSearch = () => {
        setSearchKeyword(keyword)
        setCurrentPage(1)
    }

    const noticeColumns: TableColumn<NoticeItem>[] = [
        {
            key: 'noticeId',
            header: '번호',
            width: '100px',
            render: (row: NoticeItem) => {
                const index = allNotices.indexOf(row)
                return <span>{totalCount - index - (currentPage - 1) * PAGE_SIZE}</span>
            },
        },
        {
            key: 'title',
            header: '제목',
            align: 'left',
            render: (row) => <span className={S.title}>{row.title}</span>,
        },
        { key: 'createdDate', header: '작성일', width: '150px' },
    ]

    return (
        <div className={S.noticeListContainer}>
            <StudentLayout>
                <div className={S.searchBox}>
                    <SearchBar
                        placeholder="공지사항 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch()
                        }}
                    />
                    <Button variant="dark" onClick={handleSearch}>
                        검색
                    </Button>
                </div>
                <div className={S.tableBox}>
                    {isLoading ? (
                        <TableSkeleton rows={10} columns={3} />
                    ) : (
                        <Table
                            columns={noticeColumns}
                            data={noticeList}
                            rowKey={(row) => row.noticeId}
                            onRowClick={(row) => navigate(`/student/notice/${row.noticeId}`)}
                        />
                    )}
                </div>
                <div className={S.paginationBox}>
                    <span>
                        총 {totalCount}건 중{' '}
                        {totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} -{' '}
                        {Math.min(currentPage * PAGE_SIZE, totalCount)}건 표시
                    </span>
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