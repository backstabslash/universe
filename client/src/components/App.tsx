import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainContent from '../pages/UniversePage'
import UserProfile from './UserProfile'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/user" element={<UserProfile />} />
      </Routes>
    </Router>
  )
}

export default App
