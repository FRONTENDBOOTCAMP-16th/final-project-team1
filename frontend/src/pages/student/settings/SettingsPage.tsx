import { useState } from 'react'
import StudentLayout from '@/pages/sample/StudentLayout'
import Button from '@/components/common/button/ui/button'
import './styles/settings.css'

function SettingPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 비밀번호 변경 API 연동
    console.log('비밀번호 변경 시도:', { currentPassword, newPassword, confirmPassword })
  }

  // TODO: API 연동 후 더미 데이터 제거
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
              <div className="valueBox">김민수</div>
            </div>

            <div className="inputGroup">
              <span className="label">전화번호</span>
              <div className="valueBox">010-1000-0001</div>
            </div>

            <div className="inputGroup">
              <span className="label">학번</span>
              <div className="valueBox">20240001</div>
            </div>

            <div className="inputGroup">
              <span className="label">수강 과정</span>
              <div className="valueBox">웹 개발 트랙</div>
            </div>

            <div className="inputGroup">
              <span className="label">이메일</span>
              <div className="valueBox">student@likelion.net</div>
              <span className="noticeText">이메일 변경 시 관리자에게 문의해주세요</span>
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
