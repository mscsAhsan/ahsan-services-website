import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { List, X } from 'phosphor-react';

const NAV_ITEMS = [
  { name: 'Home', to: '/' },
  { name: 'Services', to: '/services' },
  { name: 'Process', to: '/process' },
  { name: 'Contact', to: '/contact' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      gsap.to(mobileMenuRef.current, {
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        x: '100%',
        duration: 0.5,
        ease: 'power3.out',
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-300 font-medium ${
      isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
    }`;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/60 animate-fade-in">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="font-display text-2xl font-semibold text-primary">
                Syed Ahsan
              </Link>
            </div>

            <div className="hidden xl:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
                  {item.name}
                </NavLink>
              ))}

              <button
                onClick={() => navigate('/contact')}
                data-magnetic
                className="px-6 py-2 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
              >
                Start a Project
              </button>
            </div>

            <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden text-foreground p-3 min-h-[44px] min-w-[44px]" aria-label="Open menu">
              <List size={24} />
            </button>
          </div>
        </div>

        <div
          className="h-1 bg-gradient-primary transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </nav>

      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 w-full h-full bg-background/95 backdrop-blur-lg z-50 transform translate-x-full xl:hidden overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-border/60">
          <h2 className="font-display text-2xl font-semibold text-primary">Syed Ahsan</h2>
          <button onClick={() => setIsOpen(false)} className="text-foreground p-3 min-h-[44px] min-w-[44px]" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-5 p-6 mt-6">
          {NAV_ITEMS.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setIsOpen(false)}
              style={isOpen ? { animationDelay: `${0.1 + i * 0.06}s` } : undefined}
              className={({ isActive }) =>
                `menu-item text-left text-xl transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                } ${isOpen ? 'anim-fade-in-delayed' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/contact');
            }}
            style={isOpen ? { animationDelay: '0.6s' } : undefined}
            className={`menu-item px-6 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full hover:shadow-glow-primary transition-all duration-300 text-center mt-8 ${isOpen ? 'anim-fade-in-delayed' : ''}`}
          >
            Start a Project
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
