import { LogIn, LogOut, TrendingUp, Award } from 'lucide-react'
import { useState } from 'react'
import Modal from '@/components/common/modal/Modal'

import S from '@/pages/student/dashboard/styles/dashboard.module.css'

interface AttendanceActionCardProps {
  type: 'checkIn' | 'checkOut'
  onClick: () => void
}

function AttendanceActionCard({ type, onClick }: AttendanceActionCardProps) {
  const isCheckIn = type === 'checkIn'
  const [isCheckModalOpen, setIsCheckModalOpen] = useState(false)

  return (
    <div className={S.actionCardWrapper}>
      <button
        type="button"
        className={`${S.actionCard} ${isCheckIn ? S.checkIn : S.checkOut}`}
        onClick={() => setIsCheckModalOpen(true)}
      >
        <div className={S.actionIconBox}>
          {isCheckIn ? <LogIn size={32} /> : <LogOut size={32} />}
        </div>

        <div className={S.actionText}>
          <strong className={S.actionTitle}>{isCheckIn ? '입실하기' : '퇴실하기'}</strong>
          <p className={S.actionDescription}>
            {isCheckIn ? '오늘의 출석을 시작합니다' : '오늘의 활동을 마무리합니다'}
          </p>
        </div>

        <div className={S.actionRightIcon}>
          {isCheckIn ? <TrendingUp size={40} /> : <Award size={40} />}
        </div>
      </button>

      <Modal
        isOpen={isCheckModalOpen}
        title={isCheckIn ? '입실 확인' : '퇴실 확인'}
        onClose={() => setIsCheckModalOpen(false)}
        onConfirm={() => {
          onClick()
          setIsCheckModalOpen(false)
        }}
      >
        {isCheckIn ? '입실 처리하시겠습니까?' : '퇴실 처리하시겠습니까?'}
      </Modal>
    </div>
  )
}

export default AttendanceActionCard
