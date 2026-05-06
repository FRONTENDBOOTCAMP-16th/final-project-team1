// StatusSummary.tsx

import S from './statusSummary.module.css'
import type { SummaryCard } from './statusSummary.type'

type Props = {
  cards: SummaryCard[]
}

export default function StatusSummary({ cards }: Props) {
  return (
    <div className={S.summary}>
      {cards.map((card) => (
        <div className={`${S.card} ${S[card.color]}`} key={card.label}>
          <div>
            <p className={S.label}>{card.label}</p>
            <strong className={S.count}>{card.count}</strong>
          </div>

          {card.icon && <span className={S.icon}>{card.icon}</span>}
        </div>
      ))}
    </div>
  )
}
