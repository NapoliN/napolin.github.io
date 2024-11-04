import './App.css'
import Artworks from './pages/Artworks';
import Top from "./pages/Top"
import { HashRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
