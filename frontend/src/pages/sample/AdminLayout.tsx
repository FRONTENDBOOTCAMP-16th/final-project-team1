import Header from '@/components/common/header/header'
import Sidebar from '@/components/common/sidebar/Sidebar'
import styles from './AdminLayout.module.css'

interface Props {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className={styles.layout}>
      <Sidebar role="admin" />

      <div className={styles.main}>
        <Header />

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
