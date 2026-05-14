import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

interface AttendanceItem {
  classId: number
  className: string
  totalCount: number
  presentCount: number
  lateCount: number
  absentCount: number
}

interface Props {
  data: AttendanceItem[]
}

export default function AttendanceStatusChart({ data }: Props) {
  return (
    <section className={S.attendanceChartSection}>
      <div className={S.header}>
        <h3 className={S.sectionTitle}>오늘의 전체 출결 현황</h3>

        <p className={S.description}>현재 진행중인 강의만 표시됩니다.</p>
      </div>

      <div className={S.chartList}>
        {data.map((item) => {
          const total = item.totalCount

          const presentPercent = total ? (item.presentCount / total) * 100 : 0
          const latePercent = total ? (item.lateCount / total) * 100 : 0
          const absentPercent = total ? (item.absentCount / total) * 100 : 0

          return (
            <div key={item.classId} className={S.chartItem}>
              <div className={S.chartHeader}>
                <strong className={S.courseName}>{item.className}</strong>
                <span className={S.totalCount}>{total}명</span>
              </div>

              <div className={S.barTrack}>
                <div className={S.presentBar} style={{ inlineSize: `${presentPercent}%` }} />
                <div className={S.lateBar} style={{ inlineSize: `${latePercent}%` }} />
                <div className={S.absentBar} style={{ inlineSize: `${absentPercent}%` }} />
              </div>

              <div className={S.legend}>
                <span className={S.presentDot}>출석완료 {item.presentCount}명</span>
                <span className={S.lateDot}>지각인원 {item.lateCount}명</span>
                <span className={S.absentDot}>결석인원 {item.absentCount}명</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
