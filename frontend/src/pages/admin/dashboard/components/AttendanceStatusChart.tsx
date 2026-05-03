import S from '@/pages/admin/dashboard/styles/dashboard.module.css'

export default function AttendanceStatusChart() {
  const attendanceChartData = [
    {
      course: '웹 개발 기초 과정',
      total: 50,
      present: 42,
      late: 6,
      absent: 2,
    },
    {
      course: 'UI/UX 디자인 심화',
      total: 50,
      present: 42,
      late: 6,
      absent: 2,
    },
    {
      course: '데이터 분석 입문',
      total: 50,
      present: 42,
      late: 6,
      absent: 2,
    },
    {
      course: '프론트엔드 프레임워크',
      total: 50,
      present: 50,
      late: 0,
      absent: 0,
    },
    {
      course: '모바일 앱 개발',
      total: 50,
      present: 42,
      late: 6,
      absent: 2,
    },
  ]

  return (
    <section className={S.attendanceChartSection}>
      <h3 className={S.sectionTitle}>오늘의 전체 출결 현황</h3>

      <div className={S.chartList}>
        {attendanceChartData.map((item) => (
          <div key={item.course} className={S.chartItem}>
            <div className={S.chartHeader}>
              <strong className={S.courseName}>{item.course}</strong>
              <span className={S.totalCount}>{item.total}명</span>
            </div>

            <div className={S.barTrack}>
              <div
                className={S.presentBar}
                style={{ inlineSize: `${(item.present / item.total) * 100}%` }}
              />
              <div
                className={S.lateBar}
                style={{ inlineSize: `${(item.late / item.total) * 100}%` }}
              />
              <div
                className={S.absentBar}
                style={{ inlineSize: `${(item.absent / item.total) * 100}%` }}
              />
            </div>

            <div className={S.legend}>
              <span className={S.presentDot}>출석완료 {item.present}명</span>
              <span className={S.lateDot}>지각인원 {item.late}명</span>
              <span className={S.absentDot}>결석인원 {item.absent}명</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
