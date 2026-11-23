import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { BRAND } from "../config";
import { services } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container foot-grid">
        <div>
          <Link to="/" className="logo">
            <span className="logo-mark">{BRAND.short}</span>
            <span className="logo-name">{BRAND.name}</span>
          </Link>
          <p className="foot-about">{BRAND.tagline}. AI, engineering, design and growth under one roof.</p>
          <div className="socials">
            <a href={BRAND.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href={BRAND.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          {services.map((s) => <Link key={s.id} to="/services">{s.title}</Link>)}
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${BRAND.email}`}><Mail size={14} /> {BRAND.email}</a>
          <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer"><Phone size={14} /> {BRAND.whatsappDisplay}</a>
          <span><MapPin size={14} /> {BRAND.location}</span>
        </div>
      </div>
      <div className="container foot-bottom">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        <span>{BRAND.site}</span>
      </div>
    </footer>
  );
}
