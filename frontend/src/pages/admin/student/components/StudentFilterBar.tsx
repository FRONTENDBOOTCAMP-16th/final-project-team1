interface Props {
  keyword: string
  selectedCourse: string
  onChangeKeyword: (value: string) => void
  onChangeCourse: (value: string) => void
  onSearch: () => void
}

export default function StudentFilterBar({
  keyword,
  selectedCourse,
  onChangeKeyword,
  onChangeCourse,
  onSearch,
}: Props) {
  return (
    <div className="filter-bar">
      <select
        value={selectedCourse}
        onChange={(e) => onChangeCourse(e.target.value)}
        className="course-select"
      >
        <option value="">강의명 콤보박스</option>
        <option value="웹 개발 기초 과정">웹 개발 기초 과정</option>
        <option value="모바일 앱 개발">모바일 앱 개발</option>
        <option value="UI/UX 디자인 심화">UI/UX 디자인 심화</option>
        <option value="프론트엔드 프레임워크">프론트엔드 프레임워크</option>
      </select>

      <input
        type="text"
        value={keyword}
        onChange={(e) => onChangeKeyword(e.target.value)}
        placeholder="학생 이름 또는 학번 검색"
        className="search-input"
      />

      <button onClick={onSearch} className="search-button">
        검색
      </button>

      <button className="add-button">+ 신규학생 추가</button>
    </div>
  )
}
