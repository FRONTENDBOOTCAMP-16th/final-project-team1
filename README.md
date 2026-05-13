# ♟️ Checkmate

- react 기반으로 구현한 출결 관리 시스템

---

## 📌 프로젝트 소개

- 프로젝트명: 체크메이트 (Checkmate)
- 구성: 학생용 / 관리자용
- 개발 기간: 2026.04.16 ~ 2026.05.19
- 소개:
  React를 기반으로 학생과 관리자가 각각의 역할에 맞게
  출결 확인, 휴가 신청, 공지사항 관리, 학생 및 강의 관리 기능을 사용할 수 있도록 설계된 출결 관리 시스템입니다.

## 🛠 기술 스택

| 구분        | 기술                           |
| ----------- | ------------------------------ |
| Frontend    | React, TypeScript, Vite, CSS   |
| 상태관리    | Zustand                        |
| 데이터 통신 | Axios                          |
| 폼/검증     | React Hook Form, Zod           |
| 에디터      | React Quill                    |
| 보안        | DOMPurify                      |
| 코드 품질   | ESLint, Prettier               |
| 협업 도구   | GitHub, Notion, Figma, Discord |

---

## 👥 팀원 소개

| 이름   | GitHub                            |
| ------ | --------------------------------- |
| 김한결 | https://github.com/developer-kyul |
| 백희연 | https://github.com/HeeYeonBaek    |
| 이주연 | https://github.com/jyeonleee      |
| 정인우 | https://github.com/baakainu       |
| 윤유영 | https://github.com/yuyeongE       |

---

## 📂 폴더 구조

```text
/
final-project-team1
 ┣ frontend
 ┃ ┗ src
 ┃   ┣ assets          # 이미지, 아이콘, 폰트 등 정적 파일
 ┃   ┣ components      # 전역에서 공통으로 쓰는 UI 컴포넌트 (버튼, 인풋, 모달 등)
 ┃   ┃ ┣ common
 ┃   ┃ ┗ ui            # (예: Table, Pagination, DatePicker)
 ┃   ┣ hooks           # 도메인에 종속되지 않은 전역 커스텀 훅 (useCurrentTime 등)
 ┃   ┣ layouts         # 페이지 레이아웃 (Header, Sidebar, StudentLayout, AdminLayout 등)
 ┃   ┣ pages           # 실제 라우팅 되는 페이지 + 도메인별 구조
 ┃   ┃ ┣ auth          # 로그인 관련
 ┃   ┃ ┃ ┣ LoginPage.tsx
 ┃   ┃ ┃ ┣ api         # login 관련 API 호출 함수
 ┃   ┃ ┃ ┣ hooks       # login 전용 커스텀 훅
 ┃   ┃ ┃ ┗ styles      # login 관련 스타일
 ┃   ┃ ┣ student       # 학생 페이지
 ┃   ┃ ┃ ┣ dashboard   # 대시보드
 ┃   ┃ ┃ ┣ leave       # 휴가 신청 및 조회
 ┃   ┃ ┃ ┣ notice      # 공지사항 조회
 ┃   ┃ ┃ ┗ settings    # 설정
 ┃   ┃ ┗ admin         # 관리자 페이지
 ┃   ┃   ┣ dashboard   # 관리자 대시보드
 ┃   ┃   ┣ lecture     # 강의 관리
 ┃   ┃   ┣ student     # 학생 관리
 ┃   ┃   ┣ attendance  # 출결 관리
 ┃   ┃   ┣ leave       # 휴가 승인/반려
 ┃   ┃   ┣ notice      # 공지사항 관리
 ┃   ┃   ┗ settings    # 관리자 설정
 ┃   ┣ routes          # React Router 설정 파일 (권한별 라우팅 분기)
 ┃   ┣ store           # Zustand 전역 상태 저장소 (useAuthStore 등)
 ┃   ┣ styles          # global.css , reset.css 등 공통 스타일
 ┃   ┣ types           # 전역 TypeScript 타입 정의 (User, Attendance 등)
 ┃   ┗ utils           # 유틸리티 함수 (날짜 포맷팅, 데이터 파싱 등)
 ┣ backend
 ┗ README.md

- 각 도메인(auth, attendance, notice, leave, user) 내부에 페이지별 CSS를 함께 관리
```
