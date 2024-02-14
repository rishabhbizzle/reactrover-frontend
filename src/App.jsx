import { useState } from 'react'
import { Button } from './components/ui/button'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import Home from './pages/home'
import LandingPage from './pages/landing-page'

function App() {
  const [count, setCount] = useState(0)

  return (
    <ThemeProvider defaultTheme = "dark"
    storageKey = "react">
      <LandingPage/>
    {/* <Home /> */}
    </ThemeProvider>
  )
}

export default App
