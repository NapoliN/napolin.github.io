import './App.css'
import Artworks from './pages/Artworks';
import Top from "./pages/Top"
import Photos from "./pages/Photos"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from './ScrollTop';
import MarkdownViewer from './pages/Markdown';

function App() {
  return (
    <Router>
      <ScrollTop/>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/markdown" element={<MarkdownViewer />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
