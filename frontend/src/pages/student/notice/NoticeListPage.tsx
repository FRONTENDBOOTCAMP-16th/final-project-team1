import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentLayout from "@/pages/sample/StudentLayout"
import Table from "@/components/common/table/Table"
import type { TableColumn } from "@/components/common/table/table.types"
import { SearchBar } from "@/components"
import Pagination from "@/components/common/pagination"
import Button from "@/components/common/button/ui/button"
import { getNoticeList } from './api/noticeApi'
import type { NoticeItem } from './api/noticeApi'
import S from './styles/noticeList.module.css'

function NoticeListPage() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [noticeList, setNoticeList] = useState<NoticeItem[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [keyword, setKeyword] = useState('')           // 입력값 (자동완성용)
    const [searchKeyword, setSearchKeyword] = useState('') // 검색 버튼 클릭 시 (목록 필터링용)
    const [suggestions, setSuggestions] = useState<{ id: number; label: string }[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    const totalPages = Math.ceil(totalCount / 10)

    // 목록 조회 (searchKeyword 변경 시에만)
    useEffect(() => {
        const fetchNoticeList = async () => {
            try {
                const data = await getNoticeList({
                    keyword: searchKeyword || undefined,
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
    }, [currentPage, searchKeyword])    // ← keyword → searchKeyword

    // 자동완성 (입력할 때마다)
    const handleKeywordChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyword(value)

    // 빈 값이면 전체 목록으로 초기화
    if (value === '') {
        setSearchKeyword('')
        setSuggestions([])
        setShowSuggestions(false)
        return
    }

    if (value.length >= 2) {
        try {
            const data = await getNoticeList({
                keyword: value,
                page: 1,
                size: 5,
            })
            setSuggestions(
                data.items.map((item: NoticeItem) => ({
                    id: item.noticeId,
                    label: item.title,
                }))
            )
            setShowSuggestions(true)
        } catch (err) {
            console.error('자동완성 조회 실패:', err)
        }
    } else {
        setSuggestions([])
        setShowSuggestions(false)
    }
}

    // 검색 버튼 클릭
    const handleSearch = () => {
        setSearchKeyword(keyword)    // 이때만 목록 필터링 적용
        setCurrentPage(1)
        setShowSuggestions(false)
    }

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
                        value={keyword} 
                        onChange={handleKeywordChange}
                        suggestions={suggestions}
                        showSuggestions={showSuggestions}
                        onSelectSuggestion={(suggestion) => {
                            setKeyword(suggestion.label)   
                            setShowSuggestions(false)      
                        }}

                        onKeyDown={(e) => { 
                            if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
                    />
                    <Button variant="dark" onClick={handleSearch}>
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