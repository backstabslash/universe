import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainContent from '../pages/UniversePage'
import UserProfile from './UserProfile'
import MainPage from '../pages/MainPage'

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  )
}

export default App
