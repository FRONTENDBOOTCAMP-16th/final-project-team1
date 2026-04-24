// import { RouterProvider } from 'react-router-dom'
// import { router } from './routes'

import { Header, Button } from "./components"
import { Plus, Save, Search, SquarePen, Trash } from 'lucide-react';

function App() {
  // return <RouterProvider router={router} />

  // Header 컴포넌트 작업 중
  return (
    <div>
      <Header />
      <Button variant="primary">
        <Plus size={16} />신규 강의등록
      </Button>
      <Button variant="primary">
        <SquarePen size={16} />글쓰기
      </Button>
      <Button variant="blank">
        <Trash size={16} />공지사항 삭제
      </Button>
      <Button variant="dark">
        <Search size={16} />검색
      </Button>
      <Button variant="success">
        출석
      </Button>
      <Button variant="warning">
        지각
      </Button>
      <Button variant="error">
        결석
      </Button>
      <Button variant="blank">
        전체
      </Button>
      <Button variant="primary" size="lg">
        <Save size={16}/>
        저장하기
      </Button>
    </div>
  )
}

export default App
