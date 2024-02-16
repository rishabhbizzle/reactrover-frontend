import { useState } from "react";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Home from "./components/deploy";
import LandingPage from "./pages/landing-page";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="react">
      <Toaster />
      <Navbar />
      <LandingPage />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
