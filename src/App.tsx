//import { useEffect, useState } from 'react';
import './App.css'

import Top from "./pages/Top"
import AboutMe from './pages/AboutMe';
import Artwork from './pages/Artwork';
import Project from './pages/Project';


const App = () => {
  /*
    const getScroll = () => {
    return window.scrollY
  }
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    addEventListener("scroll", (_) => {setScroll(getScroll())})
  },[])

  */

  return (
    <div className='app' id="top">
      <Top />
      <AboutMe />
      <Artwork />
      <Project />
    </div>
  )
}

export default App
