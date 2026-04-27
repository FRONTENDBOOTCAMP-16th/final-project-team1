import { Routes, Route } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import StudentListPage from './pages/admin/student/StudentListPage'
import Samplepage from './pages/sample/Samplepage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/student" element={<StudentListPage />} />
      <Route path="/sample/Samplepage" element={<Samplepage />} />
    </Routes>
  )
}

export default App
