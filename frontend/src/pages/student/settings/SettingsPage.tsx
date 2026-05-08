import { useState } from 'react'
import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button'
import { useSettings } from './hooks/useSettings'
import './styles/settings.css'

function SettingPage() {
  const { profile, isLoading, error } = useSettings()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 비밀번호 변경 API 연동
    console.log('비밀번호 변경 시도:', { currentPassword, newPassword, confirmPassword })
  }

  if (isLoading)
    return (
      <StudentLayout>
        <div className="settingContainer">정보를 불러오는 중입니다...</div>
      </StudentLayout>
    )
  if (error)
    return (
      <StudentLayout>
        <div className="settingContainer">에러: {error}</div>
      </StudentLayout>
    )
  if (!profile) return null

  return (
    <StudentLayout>
      <div className="settingContainer">
        <section className="profileSection">
          <h3 className="sectionTitle">
            <div className="icon personIcon" />
            프로필 보기
          </h3>

          <div className="infoGrid">
            <div className="inputGroup">
              <span className="label">이름</span>
              <div className="valueBox">{profile.name}</div>
            </div>

            <div className="inputGroup">
              <span className="label">전화번호</span>
              <div className="valueBox">{profile.phoneNumber}</div>
            </div>

            <div className="inputGroup">
              <span className="label">학번</span>
              <div className="valueBox">{profile.studentId}</div>
            </div>

            <div className="inputGroup">
              <span className="label">소속</span>
              <div className="valueBox">{profile.className}</div>
            </div>

            <div className="inputGroup">
              <span className="label">이메일</span>
              <div className="valueBox">{profile.email}</div>
            </div>
          </div>
        </section>

        <section className="passwordSection">
          <h3 className="sectionTitle">
            <div className="icon lockIcon" />
            비밀번호 변경
          </h3>

          <form className="passwordForm" onSubmit={handlePasswordChange}>
            <div className="inputGroup">
              <label htmlFor="currentPassword">현재 비밀번호</label>
              <input
                id="currentPassword"
                type="password"
                placeholder="현재 비밀번호를 입력하세요"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="inputField"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="newPassword">새 비밀번호</label>
              <input
                id="newPassword"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="inputField"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="새 비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="inputField"
              />
            </div>

            <div className="buttonWrapper">
              <Button variant="primary" type="submit">
                비밀번호 변경
              </Button>
            </div>
          </form>
        </section>
      </div>
    </StudentLayout>
  )
}

export default SettingPage
