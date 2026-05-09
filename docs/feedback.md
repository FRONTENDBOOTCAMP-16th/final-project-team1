# 프론트엔드 피드백 정리

- 작업 완료 시 ✅ 체크
- 작업해야할 담당자 확인 후 피드백 적용하기

---

## 1. 로그인 / 라우터 ✅ - 작업자 : 김한결

### 문제

- 학생 로그인 후 관리자 페이지 접근 가능
- 권한 체크 라우터 없음
- 로그인 사용자 ID 직접 저장해서 사용 중

### 개선

- ProtectedRoute 구현
- JWT 기반 권한 체크
- role 기준으로 접근 제한

## 2. 대시보드 / 세션 처리 ✅ - 작업자 : 김한결

```tsx
// 1. JWT 토큰으로 백엔드 호출해서 JWT 토큰 기반으로 인증 처리(/me) 로그인한 사용자의 정보를 받아와옴.
// 1.1 그 받아온 값에 포함된 ID 값으로 사용하여샤 됨.

// 2. JWT 토큰 값만 넘김
// -> 백엔드에서 JWT 토큰을 해석해서 사용자 정보(학생 ID)를 받아옴 -> 학생 ID로 대시보드 정보 조회

// 3. localStorage, SessionStorage 아닌 곳에다가 저장.
// 3.1 Zustand, Redux Toolkit, Recoil 등 상태관리 라이브러리 사용해서 저장.
```

## 3. 사용한 커스텀 훅 - 작업자 : 정인우

-axiso의 admim ID 추가하기

## 4. error 타입이 불명확 ✅ - 작업자 : 김한결

### 문제

```tsx
catch(error)
```

### 개선

```tsx
catch (error: unknown) {

  const message =
    error instanceof Error
      ? error.message
      : '강의 정보를 불러오는 중 오류가 발생했습니다.'

  setModalMessage(message)
  setIsSuccess(false)
  setOpen(true)
}
```

- 사용자에게 에러 메시지 표시
- 타입 안전성 확보

## 5. any 사용하지 않기 ✅ - 작업자 : 김한결

### any 사용 시 문제점

- 타입 검사 무효
- 자동완성 깨짐
- 런타임 오류 증가
- TypeScript 사용하는 의미 감소

## 5. 스켈레톤 화면 구현하기 ⭐- 작업자 : 모두

### 추천 사이트

https://aiskeleton.vercel.app/

- tailwind 사용 시 자동 변환되는 사이트

### 프로젝트 적용 라이브러리

- sketleton Generator  
  https://www.npmjs.com/package/react-loading-skeleton?activeTab=readme

## 6. 패키지 매니저

- React, 라이브러리, 모듈 등을 설치하고 관리하는 도구

| 도구 | 특징         | 처리 방식   | 장점               | 요즘 사용       |
| ---- | ------------ | ----------- | ------------------ | --------------- |
| npm  | Node.js 기본 | 직렬        | 안정성 높음        | 가장 기본       |
| yarn | npm 개선형   | 병렬        | npm보다 빠름       | 기존 프로젝트   |
| bun  | 최신 초고속  | 병렬 최적화 | 매우 빠름          | React/Vite 증가 |
| pnpm | 용량 최적화  | 병렬        | 속도 + 디스크 절약 | 실무 증가       |

### 직렬 처리 vs 병렬 처리

| 방식      | 설명                  | 특징              |
| --------- | --------------------- | ----------------- |
| 직렬 처리 | 하나씩 순서대로 작업  | 속도 느림, 안정적 |
| 병렬 처리 | 여러 작업 동시에 처리 | 속도 빠름         |

## 7. 추천 AI 개발도구

| 도구        | 설명                            | 특징                  |
| ----------- | ------------------------------- | --------------------- |
| Codex       | OpenAI 초기 코드 AI             | 코드 생성 기반        |
| Copilot     | GitHub AI 코드 자동완성         | VSCode 실무 많이 사용 |
| Claude Code | Anthropic CLI 기반 AI 코딩 도구 | 긴 코드 분석 강함     |

## 8. React에서 많이 사용하는 라이브러리

| 라이브러리      | 역할             | 쉽게 설명        |
| --------------- | ---------------- | ---------------- |
| React           | 화면(UI) 개발    | 웹 화면 만들기   |
| Zustand         | 상태관리         | 공용 상태 보관함 |
| React Query     | 서버 데이터 관리 | API 데이터 관리  |
| React Hook Form | 폼 관리          | 입력창 관리      |
| Zod             | 유효성 검사      | 입력값 검사      |
| Axios           | API 통신         | 백엔드 요청      |
