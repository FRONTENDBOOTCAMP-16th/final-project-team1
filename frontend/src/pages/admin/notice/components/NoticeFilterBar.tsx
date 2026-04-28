import { Search, Plus, Trash } from 'lucide-react'

import SearchBar from '@/components/common/search/search'
import { Button } from '@/components'

import S from './noticeFilterBar.module.css'

interface Props {
  keyword: string
  onChangeKeyword: (value: string) => void
  onSearch: () => void
  onDelete: () => void
  onCreate: () => void
}

export default function NoticeFilterBar({
  keyword,
  onChangeKeyword,
  onSearch,
  onDelete,
  onCreate,
}: Props) {
  return (
    <div className={S.wrapper}>
      {/* 왼쪽: 검색 */}
      <div className={S.left}>
        <SearchBar
          value={keyword}
          onChange={(e) => onChangeKeyword(e.target.value)}
          placeholder="공지사항 검색"
        />

        <Button variant="dark" onClick={onSearch}>
          <Search size={16} />
          검색
        </Button>
      </div>

      {/* 오른쪽: 버튼 */}
      <div className={S.right}>
        <Button variant="blank" onClick={onDelete}>
          <Trash size={16} />
          공지사항 삭제
        </Button>

        <Button variant="primary" onClick={onCreate}>
          <Plus size={16} />
          공지사항 글쓰기
        </Button>
      </div>
    </div>
  )
}
