
import { useEffect, useState } from 'react';
import './App.css'

import Top from "./pages/Top"
import About from './pages/About';
import ArtWorks from './pages/ArtWorks';
import Articles from './pages/Articles';
import Works from './pages/Works';


const App = () => {
  const getScroll = () => {
    return window.scrollY
  }
  const [scroll, setScroll] = useState(0)

  useEffect(() => {
    addEventListener("scroll", (_) => {setScroll(getScroll())})
  },[])

  return (
    <div className='app mx-auto justify-content-md-center' id="top">
      <Top />
      <div className='not-top'>
        <About />
        <ArtWorks/>
        <Works />
        <Articles />
        { scroll > 200 && 
          <div className='btn-to-about m-3'>
          <a href="#top">
            <b>Return to Top</b>
          </a>
          </div>
        }
      </div>
    </div>
  )
}

export default App
