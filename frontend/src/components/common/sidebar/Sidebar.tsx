import { NavLink } from 'react-router-dom'
import { sidebarMenuByRole, type UserRole } from './sidebarMenu'
import './sidebar.css'

interface SidebarProps {
  role: UserRole
}

function Sidebar({ role }: SidebarProps) {
  const menuItem = sidebarMenuByRole[role]

  return (
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
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
