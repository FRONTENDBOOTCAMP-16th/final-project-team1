import { useEffect } from 'react'
import type { ReactNode } from 'react'
import S from './modal.module.css'

interface ModalProps {
  isOpen: boolean
  title?: string
  children?: ReactNode
  onClose: () => void
  onConfirm?: () => void
  buttonType?: 'none' | 'one' | 'two'
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  buttonType = 'two',
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={S.overlay} onClick={onClose}>
      <div className={S.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={S.title}>{title}</h2>}

        <div className={S.content}>{children}</div>

        {buttonType !== 'none' && (
          <div className={S.buttonArea}>
            {(buttonType === 'one' || buttonType === 'two') && (
              <button className={S.cancel} onClick={onClose}>
                닫기
              </button>
            )}

            {buttonType === 'two' && onConfirm && (
              <button className={S.confirm} onClick={onConfirm}>
                확인
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
