import { useState } from 'react'
import AdminLayout from '@/pages/sample/AdminLayout'
import Button from '@/components/common/button/ui/button'
import './styles/settings.css'

function AdminSettingPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: 관리자 비밀번호 변경 API 연동
    console.log('관리자 비밀번호 변경 시도:', { currentPassword, newPassword, confirmPassword })
  }
  // TODO: API 연동 후 더미 데이터 제거
  return (
    <AdminLayout>
      <div className="settingContainer">
        <section className="profileSection">
          <h3 className="sectionTitle">
            <div className="icon personIcon" />내 정보 확인
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
              <div className="valueBox">출결 관리팀</div>
            </div>

            <div className="inputGroup">
              <span className="label">이메일</span>
              <div className="valueBox">admin@likelion.net</div>
              <span className="noticeText">이메일은 시스템 관리자만 수정 가능합니다.</span>
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
    </AdminLayout>
  )
}

export default AdminSettingPage
