import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProcessPage from './pages/ProcessPage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CustomCursor from './components/CustomCursor';
import { ScrollFX } from './components/Motion';
import { GrainOverlay, AmbientOrbs, AuroraBackground, MouseGlow } from './components/SiteFX';

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const userScrolledRef = useRef(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    const markUserScroll = () => {
      userScrolledRef.current = true;
    };
    window.addEventListener('wheel', markUserScroll, { passive: true });
    window.addEventListener('touchmove', markUserScroll, { passive: true });
    window.addEventListener('keydown', markUserScroll);
    return () => {
      window.removeEventListener('wheel', markUserScroll);
      window.removeEventListener('touchmove', markUserScroll);
      window.removeEventListener('keydown', markUserScroll);
    };
  }, []);

  useLayoutEffect(() => {
    userScrolledRef.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    const safety = window.setTimeout(() => {
      if (!userScrolledRef.current) {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 100);
    return () => window.clearTimeout(safety);
  }, [pathname]);

  return null;
};

const RouteSweep = () => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} aria-hidden="true" className="route-sweep">
      <div className="route-sweep-bar" />
    </div>
  );
};

const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  useLayoutEffect(() => {
    if (isLoading) return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const page = document.getElementById('page-content');
    if (page) {
      gsap.fromTo(
        page,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: coarse ? 0.35 : 0.45, ease: 'power2.out' }
      );
    }
  }, [location.pathname, isLoading]);

  return (
    <div className="relative">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <AmbientOrbs />
      <AuroraBackground />
      <MouseGlow />
      <GrainOverlay />
      <RouteSweep />

      <div className={`relative z-10 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Navigation />
        <ScrollFX />
        <main id="page-content">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CustomCursor />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
