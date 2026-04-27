import S from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage === 1) {
      return [1, 2, 3, '...', totalPages]
    }

    if (currentPage === 2) {
      return [1, 2, 3, '...', totalPages]
    }

    if (currentPage === 3) {
      return [1, 2, 3, 4, '...', totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  const pages = getPages()

  return (
    <nav className={S.pagination}>
      <button
        type="button"
        className={S.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className={S.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            type="button"
            className={`${S.pageButton} ${currentPage === page ? S.active : ''}`}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className={S.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </nav>
  )
}
