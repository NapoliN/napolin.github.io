import './App.css'
import Artworks from './pages/Artworks';
import Top from "./pages/Top"
import Photos from "./pages/Photos"
import Note from "./pages/Note"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from './ScrollTop';
import MarkdownViewer from './pages/Markdown';
import React, { useEffect, useState } from 'react';
import NoteList from "./assets/notes.json"

function App() {
  const pages = NoteList
  console.log(NoteList)

  const [mds, setMds] = useState<React.FC[]>([]);
  useEffect(() => {
    const loadMarkdowns = async () => {
      const importedMds = await Promise.all(
        pages.map(async (page) => {
          const md = await import(`./notes/${page}.md`).then((module) => module.ReactComponent);
          return md;
        })
      );
      setMds(importedMds);
    };

    loadMarkdowns();
  },[])
  return (
    <Router>
      <ScrollTop/>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/notes" element={<Note />}/>
        {
          mds.map((md, index) => {
            return <Route key={index} path={`/notes/${index + 1}`} element={<MarkdownViewer Markdown={md} />} />
          })
        }
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
