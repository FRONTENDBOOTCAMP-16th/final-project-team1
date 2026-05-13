import S from '@/pages/student/dashboard/styles/DashboardSkeleton.module.css'

//1. 공지사항
export function NoticeSkeleton() {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>불러오는 중...</h3>

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className={S.skeletonItem}>
          <div className={S.skeletonTitle}></div>
          <div className={S.skeletonDate}></div>
        </div>
      ))}
    </section>
  )
}

//2. 휴가 신청 현황
export function LeaveSkeleton() {
  return (
    <section className={S.sideCard}>
      <h3 className={S.sectionTitle}>불러오는 중...</h3>

      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={S.skeletonItem}>
          <div className={S.skeletonTitle}></div>
          <div className={S.skeletonDate}></div>
        </div>
      ))}
    </section>
  )
}
