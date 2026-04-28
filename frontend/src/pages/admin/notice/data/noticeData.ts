export type Notice = {
  no: string
  title: string
  createdAt: string
  isPublic: boolean
}

export const noticeData: Notice[] = [
  {
    no: '01',
    title: '[공지] 서비스 이용약관 개정 안내',
    createdAt: '2026.04.10',
    isPublic: true,
  },
  {
    no: '02',
    title: '4월 정기 시스템 점검 작업 완료 보고',
    createdAt: '2026.04.12',
    isPublic: true,
  },
  {
    no: '03',
    title: '개인정보 처리방침 변경 건 (사전 공지)',
    createdAt: '2026.04.15',
    isPublic: false,
  },
  {
    no: '04',
    title: '신규 업데이트 버전 v2.4.0 배포 안내',
    createdAt: '2026.04.18',
    isPublic: true,
  },
  {
    no: '05',
    title: '봄맞이 포인트 더블 적립 이벤트 상세',
    createdAt: '2026.04.20',
    isPublic: true,
  },
  {
    no: '06',
    title: '고객센터 운영 시간 변경 안내 (5월부터)',
    createdAt: '2026.04.21',
    isPublic: true,
  },
  {
    no: '07',
    title: '결제 모듈 서버 긴급 점검 (공지 예정)',
    createdAt: '2026.04.22',
    isPublic: false,
  },
  {
    no: '08',
    title: '[당첨자 발표] 3월 우수 리뷰어 선정',
    createdAt: '2026.04.23',
    isPublic: true,
  },
  {
    no: '09',
    title: '보안 강화 설정 가이드 (2단계 인증)',
    createdAt: '2026.04.24',
    isPublic: true,
  },
  {
    no: '10',
    title: '안정적인 서비스 제공을 위한 서버 증설 안내',
    createdAt: '2026.04.25',
    isPublic: true,
  },
  {
    no: '11',
    title: '미사용 포인트 소멸 안내 (사전 통지)',
    createdAt: '2026.04.26',
    isPublic: true,
  },
  {
    no: '12',
    title: '[내부용] 5월 마케팅 캠페인 공지 초안',
    createdAt: '2026.04.27',
    isPublic: false,
  },
  {
    no: '13',
    title: 'iOS 앱 최적화 및 버그 수정 패치 노트',
    createdAt: '2026.04.28',
    isPublic: true,
  },
  {
    no: '14',
    title: '제휴 카드 결제 일시 중단 안내',
    createdAt: '2026.04.29',
    isPublic: true,
  },
  {
    no: '15',
    title: '커뮤니티 가이드라인 준수 캠페인 안내',
    createdAt: '2026.04.29',
    isPublic: true,
  },
]
