import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tracker from './Tracker';
import Jobs from './Jobs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tracker />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </Router>
  );
}
export default App;
