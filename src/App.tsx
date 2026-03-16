// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  // o donde lo hayas puesto
import Navbar from './components/molecules/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Otras rutas: /profile, /wishlist, etc. */}
      </Routes>
    </Router>
  );
}

export default App;