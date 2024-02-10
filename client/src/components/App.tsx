import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainContent from "../pages/UniversePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
      </Routes>
    </Router>
  );
};

export default App;
