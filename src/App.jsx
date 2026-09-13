import { useState, useEffect } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import ProjectShowcase from './components/ProjectShowcase'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [loading, setLoading] = useState(true)
  
  // Initialize Lenis smooth scroll only after preloading
  useSmoothScroll(!loading)

  return (
    <div className={`app-container ${loading ? 'no-scroll' : ''}`}>
      {!loading && <ScrollProgress />}
      <CustomCursor />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <main className="relative z-10 w-full bg-background overflow-hidden">
        <Navigation />
        <Hero />
        <About />
        <Skills />
        <ProjectShowcase />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
