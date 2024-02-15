import { useState } from 'react'
import { Button } from './components/ui/button'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import Home from './pages/home'
import LandingPage from './pages/landing-page'
import Navbar from './components/navbar'
import Footer from './components/footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme = "dark"
    storageKey = "react">
      <Navbar/>
      <LandingPage/>
    {/* <Home /> */}
    <Footer/>
    </ThemeProvider>
  )
}

export default App
