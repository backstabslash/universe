import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from '../pages/UniversePage';
import MainPage from '../pages/MainPage';
import CompanyName from '../pages/reg-pages/CompanyName';
import Coworkers from '../pages/reg-pages/CoWorkers';
import Channels from '../pages/reg-pages/Channels';
import PersistLogin from './PersistLogin';
import RegUser from '../pages/reg-pages/RegUser';

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/reg/companyname" element={<CompanyName />} />
        <Route path="/reg/coworkers" element={<Coworkers />} />
        <Route path="/reg/channels" element={<Channels />} />
        <Route path="/reg/reguser" element={<RegUser />} />
        <Route element={<PersistLogin />}>
          <Route path="/client" element={<MainContent />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
