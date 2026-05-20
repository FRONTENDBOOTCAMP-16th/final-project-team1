import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button'
import { useSettings } from './hooks/useSettings'
import { useState } from 'react'
import { verifyCurrentPassword } from './api/settingsApi'
import Modal from '@/components/common/modal/Modal'
import './styles/settings.css'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

function SettingPage() {
  const { profile, isLoading, error, changePassword } = useSettings()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalConfig, setModalConfig] = useState<{
    title: string
    content: string
    onConfirm?: () => void
  }>({ title: '', content: '' })

  const showAlert = (title: string, content: string, onConfirm?: () => void) => {
    setModalConfig({ title, content, onConfirm })
    setIsModalOpen(true)
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentPassword) {
      showAlert('입력 오류', '현재 비밀번호를 입력해 주세요.')
      return
    }

    if (!newPassword || !confirmPassword) {
      showAlert('입력 오류', '새 비밀번호를 모두 입력해 주세요.')
      return
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      showAlert('비밀번호 오류', '새 비밀번호는 8자 이상, 영문과 숫자를 혼합해야 합니다.')
      return
    }

    if (newPassword !== confirmPassword) {
      showAlert('비밀번호 불일치', '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await verifyCurrentPassword(currentPassword)

      const success = await changePassword(currentPassword, newPassword)

      if (success) {
        showAlert('변경 완료', '비밀번호가 성공적으로 변경되었습니다.', () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        })
      }
    } catch (error) {
      console.error('비밀번호 변경 실패:', error)

      if (error instanceof Error) {
        showAlert('변경 실패', error.message)
      } else {
        showAlert('변경 실패', '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    }
  }
  if (error)
    return (
      <StudentLayout>
        <div className="settingContainer">에러: {error}</div>
      </StudentLayout>
    )

  return (
    <StudentLayout>
      <div className="settingContainer">
        <section className="profileSection">
          <h3 className="sectionTitle">
            <div className="icon personIcon" />
            프로필 보기
          </h3>

          <div className="infoGrid">
            {[
              { label: '이름', value: profile?.name, width: '60%' },
              { label: '전화번호', value: profile?.phoneNumber, width: '80%' },
              { label: '학번', value: profile?.studentId, width: '70%' },
              { label: '소속', value: profile?.className, width: '50%' },
              { label: '이메일', value: profile?.email, width: '90%' },
            ].map((item, idx) => (
              <div className="inputGroup" key={idx}>
                <span className="label">{item.label}</span>
                <div className="valueBox">
                  {isLoading ? (
                    <Skeleton width={item.width} height={20} borderRadius={4} />
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="passwordSection">
          <h3 className="sectionTitle">비밀번호 변경</h3>
          <form onSubmit={handlePasswordChange} className="passwordForm">
            <div className="inputGroup">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              {isLoading ? (
                <Skeleton height={50} borderRadius={8} containerClassName="skeletonFix" />
              ) : (
                <div className="passwordInputWrapper">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="현재 비밀번호를 입력하세요"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value.replace(/\s/g, ''))}
                    className="inputField"
                  />
                  <button
                    type="button"
                    className="viewIconBtn"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? '비밀번호 숨기기' : '비밀번호 표시'}
                    aria-pressed={showCurrent}
                    title={showCurrent ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    <img src={showCurrent ? eyeIcon : eyeOffIcon} alt="" aria-hidden="true" width="20" height="20" />
                  </button>
                </div>
              )}
            </div>

            <div className="inputGroup">
              <label htmlFor="newPassword">새 비밀번호</label>
              {isLoading ? (
                <Skeleton height={50} borderRadius={8} containerClassName="skeletonFix" />
              ) : (
                <div className="passwordInputWrapper">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    placeholder="새 비밀번호를 입력하세요"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value.replace(/\s/g, ''))}
                    className="inputField"
                  />
                  <button
                    type="button"
                    className="viewIconBtn"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? '비밀번호 숨기기' : '비밀번호 표시'}
                    aria-pressed={showNew}
                    title={showNew ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    <img src={showNew ? eyeIcon : eyeOffIcon} alt="" aria-hidden="true" width="20" height="20" />
                  </button>
                </div>
              )}
            </div>

            <div className="inputGroup">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              {isLoading ? (
                <Skeleton height={50} borderRadius={8} containerClassName="skeletonFix" />
              ) : (
                <div className="passwordInputWrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ''))}
                    className="inputField"
                  />
                  <button
                    type="button"
                    className="viewIconBtn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? '비밀번호 숨기기' : '비밀번호 표시'}
                    aria-pressed={showConfirm}
                    title={showConfirm ? '비밀번호 숨기기' : '비밀번호 표시'}
                  >
                    <img src={showConfirm ? eyeIcon : eyeOffIcon} alt="" aria-hidden="true" width="20" height="20" />
                  </button>
                </div>
              )}
            </div>

            <div className="buttonWrapper">
              <Button variant="primary" type="submit" disabled={isLoading}>
                비밀번호 변경
              </Button>
            </div>
          </form>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={modalConfig.title}
        onClose={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) modalConfig.onConfirm()
        }}
        onConfirm={() => {
          setIsModalOpen(false)
          if (modalConfig.onConfirm) modalConfig.onConfirm()
        }}
        buttonType="one"
      >
        <p>{modalConfig.content}</p>
      </Modal>
    </StudentLayout>
  )
}

export default SettingPage
