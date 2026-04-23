import { NavLink } from 'react-router-dom'
import { sidebarMenuByRole, type UserRole } from './sidebarMenu'
<<<<<<< HEAD
import S from './sidebar.module.css'
=======
import './sidebar.css'
>>>>>>> 83b336f (feat: 공통 컴포넌트 사이드 바 구현)

interface SidebarProps {
  role: UserRole
}

function Sidebar({ role }: SidebarProps) {
  const menuItem = sidebarMenuByRole[role]

  return (
<<<<<<< HEAD
    <aside className={S.sidebar}>
      <div className={S['sidebar_brand']}>
        <h1 className={S['sidebar_title']}>멋쟁이사자처럼</h1>
        <p className={S['sidebar_subtitle']}>출결관리 시스템</p>
      </div>

      <nav className={S['sidebar_nav']}>
        <ul className={S['sidebar_list']}>
          {menuItem.map((item) => (
            <li key={item.path} className={S['sidebar_item']}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${S['sidebar_link']} ${S.active}` : S['sidebar_link']
                }
              >
                <img src={item.icon} alt="" className={S['sidebar_icon']} />
                <span className={S['sidebar_label']}>{item.label}</span>
=======
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="sidebar-title">멋쟁이사자처럼</h1>
        <p className="sidebar-subtitle">출결관리 시스템</p>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-list">
          {menuItem.map((item) => (
            <li key={item.path} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
              >
                <img src={item.icon} alt="" className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
>>>>>>> 83b336f (feat: 공통 컴포넌트 사이드 바 구현)
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
