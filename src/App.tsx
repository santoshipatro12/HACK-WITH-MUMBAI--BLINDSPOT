import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Analyze } from './pages/Analyze';
import { Results } from './pages/Results';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}
