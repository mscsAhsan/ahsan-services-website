import { useState, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Cursor from "./components/Cursor";
import Aurora from "./components/Aurora";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import PageWrap from "./components/PageWrap";

import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);
  const done = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Cursor />
      <Aurora />
      <ScrollProgress />

      <AnimatePresence>{!loaded && <Preloader onDone={done} />}</AnimatePresence>

      {loaded && (
        <>
          <Navbar />
          <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/services" element={<PageWrap><Services /></PageWrap>} />
              <Route path="/about" element={<PageWrap><About /></PageWrap>} />
              <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
              <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
            </Routes>
          </AnimatePresence>
          <Footer />
          <Chatbot />
        </>
      )}
    </>
  );
}
