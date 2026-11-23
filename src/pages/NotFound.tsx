import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24">
      <div className="text-center px-6" data-reveal>
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">Page not found</p>
        <h1 className="font-display text-7xl font-semibold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          This page does not exist. It may have moved, or the link may be wrong.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-block px-8 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
          >
            Return to Home
          </Link>
          <Link
            to="/services"
            className="inline-block px-8 py-3 min-h-[44px] border border-primary/40 text-primary rounded-full font-medium hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            Browse Services
          </Link>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 min-h-[44px] border border-primary/40 text-primary rounded-full font-medium hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
