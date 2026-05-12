import { useState } from 'react'
import AdminLayout from '@/pages/sample/AdminLayout'
import Button from '@/components/common/button/ui/button'
import { useAdminSettings } from './hooks/useSettings'
import './styles/settings.css'
import eyeIcon from '@/assets/eye.svg'
import eyeOffIcon from '@/assets/eye-off.svg'

function AdminSettingPage() {
  const { changePassword } = useAdminSettings()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // 보이기/숨기기 상태
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // 관리자 비밀번호 규칙: 영어+숫자 혼합 8자 이상
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/

  const handlePasswordChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('모든 필드를 입력해 주세요.')
      return
    }

    if (!currentPassword) {
      alert('현재 비밀번호를 입력해 주세요.')
      return
    }

    if (currentPassword === newPassword) {
      alert('새 비밀번호가 현재 비밀번호와 동일합니다. 다른 비밀번호를 입력해 주세요.')
      return
    }

    if (!passwordRegex.test(newPassword)) {
      alert('비밀번호는 영문, 숫자를 포함하여 8~16자로 입력해 주세요.')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    const result = await changePassword(currentPassword, newPassword)

    if (result.success) {
      alert('관리자 비밀번호가 변경되었습니다. 다시 로그인해 주세요.')
      localStorage.clear()
      window.location.href = '/'
    } else {
      alert(result.message)
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
            <div className="inputGroup">
              <span className="label">관리자 이름</span>
              <div className="valueBox">김관리</div>
            </div>

            <div className="inputGroup">
              <span className="label">관리자 아이디</span>
              <div className="valueBox">admin</div>
            </div>

            <div className="inputGroup">
              <span className="label">소속</span>
              <div className="valueBox">출결 관리 시스템 운영팀</div>
            </div>
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
                  tabIndex={-1}
                >
                  <img
                    src={showCurrent ? eyeIcon : eyeOffIcon}
                    alt="Toggle View"
                    width="20"
                    height="20"
                  />
                </button>
              </div>
            </div>

            <div className="inputGroup">
              <label htmlFor="newPassword">새 비밀번호</label>
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
                  tabIndex={-1}
                >
                  <img
                    src={showNew ? eyeIcon : eyeOffIcon}
                    alt="Toggle View"
                    width="20"
                    height="20"
                  />
                </button>
              </div>
            </div>

            <div className="inputGroup">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
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
                  tabIndex={-1}
                >
                  <img
                    src={showConfirm ? eyeIcon : eyeOffIcon}
                    alt="Toggle View"
                    width="20"
                    height="20"
                  />
                </button>
              </div>
            </div>

            <div className="buttonWrapper">
              <Button variant="primary" type="submit">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  )
}

export default AdminSettingPage
