import './App.css'
import Artworks from './pages/Artworks';
import Top from "./pages/Top"
import Photos from "./pages/Photos"
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ScrollTop from './ScrollTop';
import MarkdownViewer from './pages/Markdown';
import { Note } from "./pages/Note"
import { useEffect } from 'react';

import NoteList from "./assets/notes.json"

function App() {
// mdファイルのメタ情報を再帰的に取得する
interface NoteProps {
    title: string,
    tags?: string[],
    date: string,
    content: string,
}
interface NoteFile {
    type: 'file' | 'directory'; //ファイルの型
    name: string; //ディレクトリ名またはファイル名
    children?: NoteFile[]; //ディレクトリのとき、その中身
}

const loadPagesMeta = async (dirname: string, filesOrDirs: NoteFile[]) : Promise<NoteProps[]> => {
return new Promise(async (resolve) => {
    const metas: NoteProps[] = [];
    for (const fileOrDir of filesOrDirs) {
    if (fileOrDir.type === 'file') {
        
        const md: NoteProps = await import(`./notes/${dirname}${fileOrDir.name}`).then((module) => {
        return {
            title: module.attributes.title,
            tags: module.attributes.tags,
            date: module.attributes.date,
            content: module.html
        }
        });
        
        metas.push(md);
    } else if (fileOrDir.type === 'directory' && fileOrDir.children) {
        const dirnameNew = `${dirname}${fileOrDir.name}/`;
        const childMetas = await loadPagesMeta(dirnameNew,fileOrDir.children);
        metas.push(...childMetas);
    }
    }
    resolve(metas);
});
}

  return (
    <Router>
      <ScrollTop />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/notes" element={<Note />} />
        <Route path="/articles" element={<MarkdownViewer />} />
        {
          //mds.map((md, index) => {
          //  return <Route key={index} path={`/notes/${md.title}`} element={<MarkdownViewer Markdown={md.content} />} />
          //})
        }
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
