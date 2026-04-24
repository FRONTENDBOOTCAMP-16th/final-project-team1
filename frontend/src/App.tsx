// import { RouterProvider } from 'react-router-dom'
// import { router } from './routes'

import { Routes, Route } from 'react-router-dom'
import Samplepage from './pages/sample/Samplepage'

function App() {

  return (
    <div>
      <Routes>
        <Route path="/sample/Samplepage" element={<Samplepage />} />
      </Routes>
    </div>
  )
}

export default App