import S from './header.module.css'

function Header() {
  return (
    <header className={S.header}>
      <div className={S.title}>
        <h1 className={S.menu_name}>대시보드</h1>
        <p className={S.sub_title}>환영합니다.</p>
      </div>
      <div className={S.user_profile}>
        <div className={S.user_icons}>
          <span className={S.user_first_name}>관</span>
          <div className={S.user_status}>
            <p className={S.account_name}>관리자</p>
            <p className={S.account_eng}>LikeLion_admin</p>
          </div>
        </div>
        <button className={S.logout_button}>로그아웃</button>
      </div>
    </header>
  )
}

export default Header
