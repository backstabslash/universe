import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainContent from '../pages/UniversePage'
import UserProfile from './UserProfile'
import MainPage from '../pages/MainPage'
import Companyname from '../pages/reg-pages/CompanyName'
import CoWorkers from '../pages/reg-pages/CoWorkers'
import Channels from '../pages/reg-pages/Channels'

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/reg/companyname" element={<Companyname />} />
        <Route path="/reg/coworkers" element={<CoWorkers />} />
        <Route path="/reg/channels" element={<Channels />} />
      </Routes>
    </Router>
  )
}

export default App
