import './App.css'
import Artworks from './pages/Artworks';
import Top from "./pages/Top"
import Photos from "./pages/Photos"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from './ScrollTop';
import MarkdownViewer from './pages/Markdown';
import { useEffect, useState } from 'react';
import NoteList from "./assets/notes.json"
import { Note, NoteProps } from "./pages/Note"

function App() {
  const pages = NoteList
  

  const [mds, setMds] = useState<NoteProps[]>([]);

  useEffect(() => {
    const loadMarkdowns = async () => {
      const importedMds: NoteProps[] = await Promise.all(
        pages.map(async (page) => {
          const md: NoteProps = await import(`./notes/${page}.md`).then((module) => {
            return {
              title: module.attributes.title,
              tags: module.attributes.tags,
              date: module.attributes.date,
              content: module.html
            }
        });
          return md;
        })
      );
      setMds(importedMds.filter((md) => md.title));
    };

    loadMarkdowns();
  }, [])
  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/notes" element={<Note notes={mds} />} />
        {
          mds.map((md, index) => {
            return <Route key={index} path={`/notes/${md.title}`} element={<MarkdownViewer Markdown={md.content} />} />
          })
        }
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
