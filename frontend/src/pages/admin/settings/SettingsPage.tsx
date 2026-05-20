import { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import AdminLayout from '@/pages/sample/AdminLayout'
import Button from '@/components/common/button/ui/button'
import { useAdminSettings } from './hooks/useSettings'
import { verifyAdminPassword } from './api/settingsApi'
import Modal from '@/components/common/modal/Modal'
import './styles/settings.css'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

function AdminSettingPage() {
  const { changePassword } = useAdminSettings()

  const isLoading = false

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

  const handlePasswordChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('입력 오류', '모든 필드를 입력해 주세요.')
      return
    }

    if (currentPassword === newPassword) {
      showAlert('비밀번호 동일', '새 비밀번호가 현재 비밀번호와 동일합니다.')
      return
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      showAlert('비밀번호 정책 오류', '비밀번호는 영문, 숫자를 포함하여 8~16자로 입력해 주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      showAlert('비밀번호 불일치', '새 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      await verifyAdminPassword(currentPassword)

      const result = await changePassword(currentPassword, newPassword)

      if (result.success) {
        showAlert('변경 완료', '관리자 비밀번호가 변경되었습니다. 다시 로그인해 주세요.', () => {
          localStorage.clear()
          window.location.href = '/'
        })
      } else {
        showAlert('변경 실패', result.message || '비밀번호 변경에 실패했습니다.')
      }
    } catch (error) {
      console.error('관리자 비밀번호 변경 실패:', error)
      if (error instanceof Error) {
        showAlert('변경 실패', error.message)
      } else {
        showAlert('변경 실패', '알 수 없는 오류가 발생했습니다.')
      }
    }
  }

  return (
    <AdminLayout>
      <div className="settingContainer">
        <section className="profileSection">
          <h3 className="sectionTitle">
            <div className="icon personIcon" />
            프로필 보기
          </h3>

          <div className="infoGrid">
            {[
              { label: '관리자 이름', value: '김관리', width: '40%' },
              { label: '관리자 아이디', value: 'admin', width: '30%' },
              { label: '소속', value: '출결 관리 시스템 운영팀', width: '60%' },
            ].map((item, idx) => (
              <div className="inputGroup" key={idx}>
                <span className="label">{item.label}</span>
                <div className="valueBox">
                  {isLoading ? <Skeleton width={item.width} height={20} borderRadius={4} /> : item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="passwordSection">
          <h3 className="sectionTitle">
            <div className="icon lockIcon" />
            관리자 비밀번호 변경
          </h3>

          <form onSubmit={handlePasswordChange}>
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
                  placeholder="8~16자, 영문+숫자"
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
              <Button variant="primary" type="submit">
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
    </AdminLayout>
  )
}

export default AdminSettingPage
