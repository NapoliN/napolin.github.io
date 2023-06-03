
import './App.css'
import About from './pages/About';

import ArtWorks from './pages/ArtWorks';
import Articles from './pages/Articles';
import Works from './pages/Works';


const App = () => {

  return (
    <div className='app'>
      <About />
      <ArtWorks/>
      <Works />
      <Articles />
    </div>
  )
}

export default App
