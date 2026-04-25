interface Props {
  currentPage: number
  totalPages: number
  onChangePage: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onChangePage }: Props) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="pagination">
      <button onClick={() => onChangePage(currentPage - 1)} disabled={currentPage === 1}>
        이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChangePage(page)}
          className={currentPage === page ? 'active-page' : ''}
        >
          {page}
        </button>
      ))}

      <button onClick={() => onChangePage(currentPage + 1)} disabled={currentPage === totalPages}>
        다음
      </button>
    </div>
  )
}
