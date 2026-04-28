import type { ReactNode } from 'react'
import S from './modal.module.css'

interface ModalProps {
  isOpen: boolean
  title?: string
  children?: ReactNode
  onClose: () => void
  onConfirm?: () => void
}

export default function Modal({ isOpen, title, children, onClose, onConfirm }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={S.overlay}>
      <div className={S.modal}>
        {title && <h2 className={S.title}>{title}</h2>}

        <div className={S.content}>{children}</div>

        <div className={S.buttonArea}>
          <button className={S.cancel} onClick={onClose}>
            닫기
          </button>

          {onConfirm && (
            <button className={S.confirm} onClick={onConfirm}>
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
