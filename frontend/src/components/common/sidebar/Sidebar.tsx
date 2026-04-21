// import { NavLink } from "react-router-dom"
import { sidebarMenuByRole, type UserRole } from './sidebarMenu'
// import styles from './sidebar.css'

interface SidebarProps {
  role: UserRole
}

function Sidebar({ role }: SidebarProps) {
  const menuItem = sidebarMenuByRole[role]

  return (
    <aside>
      <nav>
        <ul>
          {menuItem.map((item) => (
            <li key={item.path}>
              <button type="button">{item.label}</button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
