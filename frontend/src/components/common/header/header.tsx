import { useLocation } from 'react-router-dom'
import S from './header.module.css'

// 타이틀 리스트
const Title_label : Record<string, Record<string, string>> ={
  student: {
    dashboard: '대시보드',
    leave: '휴가신청',
    notice: '공지사항',
    settings: '환경설정', // 수정 2: setting -> settings
  },
  admin:{
    dashboard: '대시보드',
    notice: '공지사항',
    leave: '휴가 승인',
    lecture: '강의 관리',
    student: '학생 관리',
    attendance: '출결 관리',
    settings: '설정',
  },
};

function Header() {
  const location = useLocation()
  const pathSegment = location.pathname.split('/');
  
  const menuRole = pathSegment[1] || 'student';
  const category = pathSegment[2] || 'dashboard';

  // 수정 1: [menuRole] 뒤에 물음표(?) 추가하여 에러 방지
  const pageTitle = Title_label[menuRole]?.[category] || '대시보드';
  
  const subTitle = menuRole === 'admin'
  ? '관리자님 환영합니다.'
  : '오늘도 멋사와 함께 열공하세요!';

  const loginUser = {
    name: '백희연',
    accountEng: 'heeyeon_baek',
  }

  const userInitials = menuRole === 'admin' ? '관' 
  : (loginUser.name ? loginUser.name[0] : '학');
  
  return (
    <header className={S.header}>
      <div className={S.title}>
        <h1 className={S.menu_name}>{pageTitle}</h1>
        <p className={S.sub_title}>{subTitle}</p>
      </div>
      <div className={S.user_profile}>
        <div className={S.user_icons}>
          <span className={S.user_first_name}>
            {userInitials}
          </span>
          <div className={S.user_status}>
            {/* 수정 3: 관리자일 때 이름/계정도 '관리자'에 맞게 노출 */}
            <p className={S.account_name}>
              {menuRole === 'admin' ? '관리자' : loginUser.name}
            </p>
            <p className={S.account_eng}>
              {menuRole === 'admin' ? 'LikeLion_admin' : loginUser.accountEng}
            </p>
          </div>
        </div>
        <button className={S.logout_button}>로그아웃</button>
      </div>
    </header>
  )
}

export default Header