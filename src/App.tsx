
import { useEffect, useState } from 'react';
import './App.css'

import Top from "./pages/Top"
import About from './pages/About';
import ArtWorks from './pages/ArtWorks';
import Articles from './pages/Articles';
import Works from './pages/Works';
import AboutMe from './pages/AboutMe';
import Artwork from './pages/Artwork';


const App = () => {
  const getScroll = () => {
    return window.scrollY
  }
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    addEventListener("scroll", (_) => {setScroll(getScroll())})
  },[])

  return (
    <div className='app' id="top">
      <Top />
      <AboutMe />
      <Artwork />
    </div>
  )
}

export default App
