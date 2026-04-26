import type { ReactNode } from 'react'
import S from './CountCard.module.css'

interface CountCardProps {
  label: string
  value: number | string
  unit?: string
  icon: ReactNode
  variant?: 'gray' | 'green' | 'yellow' | 'red' | 'orange'
}

export default function CountCard({ label, value, unit, icon, variant = 'gray' }: CountCardProps) {
  return (
    <div className={`${S.card} ${S[variant]}`}>
      <div className={S['icon_box']}>{icon}</div>

      <p className={S.label}>{label}</p>

      <strong className={S.value}>
        {value}
        {unit && <span className={S.unit}> {unit}</span>}
      </strong>
    </div>
  )
}
