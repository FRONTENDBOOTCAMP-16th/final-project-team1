import { useLocation, useNavigate } from 'react-router-dom'
import S from './header.module.css'

const Title_label: Record<string, Record<string, string>> = {
    student: {
        dashboard: '대시보드',
        leave: '휴가신청',
        notice: '공지사항',
        settings: '환경설정',
    },
    admin: {
        dashboard: '대시보드',
        notice: '공지사항',
        leave: '휴가 승인',
        lecture: '강의 관리',
        student: '학생 관리',
        attendance: '출결 관리',
        settings: '설정',
    },
}

function Header() {
    const location = useLocation()
    const navigate = useNavigate()

    const pathSegment = location.pathname.split('/')
    const menuRole = pathSegment[1] || 'student'
    const category = pathSegment[2] || 'dashboard'

    const pageTitle = Title_label[menuRole]?.[category] || '대시보드'

    const subTitle = menuRole === 'admin'
        ? '관리자님 환영합니다.'
        : '오늘도 멋사와 함께 열공하세요!'

    // localStorage에서 유저 정보 읽기
    const userName = localStorage.getItem('userName') || '이름 없음'
    
    const userInitials = menuRole === 'admin' ? '관'
        : (userName ? userName[0] : '학')

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userName')
        localStorage.removeItem('studentId')
        localStorage.removeItem('role')
        navigate('/login')
    }

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
                        <p className={S.account_name}>
                            {menuRole === 'admin' ? '관리자' : userName}
                        </p>
                        <p className={S.account_eng}>
                             {menuRole === 'admin' ? 'LikeLion_admin' : 'likelion-student'}
                        </p>
                    </div>
                </div>
                <button
                    className={S.logout_button}
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>
        </header>
    )
}

export default Header