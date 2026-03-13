// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  // o donde lo hayas puesto

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Otras rutas: /profile, /wishlist, etc. */}
      </Routes>
    </Router>
  );
}

export default App;