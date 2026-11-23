import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { GithubLogo, LinkedinLogo } from 'phosphor-react';
import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../data/services';

const Footer = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const particles = particlesRef.current?.children;
    if (particles) {
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: -30,
          x: Math.random() * 40 - 20,
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: index * 0.5,
        });
      });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { name: 'Home', to: '/' },
    { name: 'All Services', to: '/services' },
    { name: 'How It Works', to: '/process' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <footer className="relative py-16 px-6 overflow-hidden bg-secondary text-secondary-foreground">
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full blur-sm" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full blur-sm" />
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent rounded-full blur-sm" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full blur-sm" />
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-accent rounded-full blur-sm" />
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-primary rounded-full blur-sm" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div data-reveal>
            <h3 className="font-display text-2xl font-semibold mb-4">Syed Ahsan</h3>
            <p className="text-secondary-foreground/70 leading-relaxed mb-6">
              AI, web and research services - built on real skills, real projects, and honest results.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/mscsAhsan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-primary rounded-lg flex items-center justify-center hover:shadow-glow-primary transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <GithubLogo size={18} className="text-primary-foreground" />
              </a>
              <a
                href="https://www.linkedin.com/in/syedahsanai-engr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 bg-accent rounded-lg flex items-center justify-center hover:shadow-glow-primary transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedinLogo size={18} className="text-accent-foreground" />
              </a>
            </div>
          </div>

          <div data-reveal data-delay="0.1">
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <nav className="space-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-secondary-foreground/70 hover:text-accent transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <h4 className="text-lg font-medium mb-3 mt-8">Popular Services</h4>
            <nav className="space-y-3">
              {SERVICES.slice(0, 4).map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="block text-secondary-foreground/70 hover:text-accent transition-colors duration-300"
                >
                  {service.title}
                </Link>
              ))}
            </nav>
          </div>

          <div data-reveal data-delay="0.2">
            <h4 className="text-lg font-medium mb-4">Get In Touch</h4>
            <div className="space-y-3">
              <p className="text-secondary-foreground/70">
                <span className="text-accent">Email:</span>
                <br />
                <a href="mailto:asmatullahshah0343@gmail.com" className="hover:text-accent transition-colors">
                  asmatullahshah0343@gmail.com
                </a>
                <br />
                <a href="mailto:mscs26017@itu.edu.pk" className="hover:text-accent transition-colors">
                  mscs26017@itu.edu.pk
                </a>
              </p>
              <p className="text-secondary-foreground/70">
                <span className="text-accent">Phone / WhatsApp:</span>
                <br />
                <a href="tel:+923416985286" className="hover:text-accent transition-colors">
                  +92 341 6985286
                </a>
              </p>
              <p className="text-secondary-foreground/70">
                <span className="text-accent">Location:</span>
                <br />
                Lahore, Pakistan
              </p>
              <p className="text-secondary-foreground/70">
                <span className="text-accent">Website:</span>
                <br />
                <a href="https://syedahsan-ai-engr.tech" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  syedahsan-ai-engr.tech
                </a>
              </p>
            </div>
          </div>
        </div>

        <div data-reveal className="border-t border-white/15 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/70 text-center md:text-left">
            &copy; 2026 Syed Ahsan Shah. All rights reserved.
          </p>

          <Link
            to="/admin"
            className="text-secondary-foreground/50 hover:text-accent text-sm transition-colors duration-300"
          >
            Admin
          </Link>

          <button
            onClick={scrollToTop}
            className="px-4 py-2 min-h-[44px] gap-2 flex items-center bg-gradient-primary text-primary-foreground rounded-full hover:shadow-glow-primary transition-all duration-300 hover:scale-105 text-sm"
          >
            Back to Top <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
