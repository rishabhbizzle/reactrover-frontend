import { ThemeProvider } from "./components/theme-provider";
import LandingPage from "./pages/landing-page";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="react-rover">
      <Toaster />
      <Navbar />
      <LandingPage />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
