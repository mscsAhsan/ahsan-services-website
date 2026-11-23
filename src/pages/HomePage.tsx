import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Envelope, GithubLogo, LinkedinLogo, MapPin, Phone } from 'phosphor-react';
import ParticleField from '../components/ParticleField';
import StatCount from '../components/StatCount';
import { PageGlow, SectionDivider } from '../components/SiteFX';
import { PROCESS_STEPS, SERVICES, STATS } from '../data/services';

const ROLES = ['AI Researcher', 'Medical Imaging', 'Computer Vision', 'Web Engineer'];

const MARQUEE_ITEMS = [
  'Machine Learning',
  'Medical Imaging',
  'Computer Vision',
  'PyTorch',
  'React',
  'OpenCV',
  'Flask',
  'Deep Learning',
  'Data Analysis',
  'AI Chatbots',
];

const FEATURED_SLUGS = [
  'websites',
  'ai-ml-development',
  'ai-chatbots-assistants',
  'medical-imaging-ai',
  'web-apps-dashboards',
  'data-analysis-visualisation',
];

const WHY_FACTS = [
  { title: 'Research Assistant, ITU Lahore', text: 'AI-driven optical lens design since Mar 2026, plus the FIN glaucoma study and the anomaly-detection reproducibility study.' },
  { title: 'MS Computer Science, ITU Lahore', text: 'In progress since Aug 2026, and Teaching Assistant for Numerical Analysis at the same university.' },
  { title: 'BS AI, IUB 2026', text: 'Completed a Bachelor of Science in Artificial Intelligence at The Islamia University of Bahawalpur in 2026.' },
  { title: '1000+ students taught', text: 'As president of the IUB Skills and Career Development Society, ran Python, marketing, and analytics courses for 1000+ students.' },
  { title: 'Founder of Nexavo AI', text: 'A Pakistan-only AI tools store with Safepay checkout, built from a small working version upward.' },
  { title: 'Deep Embed Lab intern', text: 'Intern at the Deep Embed Lab, IUB, from Oct 2023 to Nov 2024.' },
];

const HomePage = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const current = ROLES[roleIndex];
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        char += 1;
        setTyped(current.slice(0, char));
        if (char === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800);
          return;
        }
        timer = setTimeout(tick, 70);
      } else {
        char -= 1;
        setTyped(current.slice(0, char));
        if (char === 0) {
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          return;
        }
        timer = setTimeout(tick, 35);
      }
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [roleIndex]);

  const featured = FEATURED_SLUGS.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  return (
    <div className="pt-16">
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-16 px-6" data-mouse-zone>
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob aurora-blob--a -top-24 -left-24" />
          <div className="aurora-blob aurora-blob--b top-1/3 -right-28" />
          <div className="aurora-blob aurora-blob--c bottom-0 left-1/3" />
        </div>
        <ParticleField />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-4">
                <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />
                AI, Web and Research Services
              </p>
              <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] mb-4">
                I build AI, web, and research work{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">that actually works.</span>
              </h1>
              <p data-reveal data-delay="0.1" className="font-display text-2xl md:text-3xl font-medium text-primary mb-5 min-h-[2.5rem]">
                {typed}
                <span className="typewriter-caret" aria-hidden="true" />
              </p>
              <p data-reveal data-delay="0.15" className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                I am Syed Ahsan, an MS Computer Science student and Research Assistant at ITU Lahore. I build websites
                and web apps, develop machine learning, and support research, with the real projects behind each service.
              </p>
              <div data-reveal data-delay="0.2" className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/services"
                  data-magnetic
                  className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
                >
                  Browse Services
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/contact"
                  data-magnetic
                  className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] border border-primary/40 text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                >
                  Start a Project
                </Link>
              </div>
              <div data-reveal data-delay="0.25" className="grid grid-cols-3 gap-4 max-w-lg">
                {STATS.map((stat) => (
                  <div key={stat.label} className="glass rounded-2xl px-3 py-4 text-center">
                    <p className="font-display text-2xl md:text-3xl font-semibold text-primary">
                      <StatCount target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal data-delay="0.15" className="relative mx-auto w-full max-w-md" data-mouse-zone>
              <div aria-hidden="true" className="photo-conic-ring absolute -inset-3 rounded-[2rem] blur-md" />
              <div className="relative rounded-[2rem] overflow-hidden border border-border shadow-glow-primary" data-tilt>
                <img
                  src="/Images/ahsan-profile.jpg"
                  alt="Syed Ahsan"
                  className="w-full aspect-[4/5] object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12">
                  <p className="font-display text-xl font-semibold text-white">Syed Ahsan</p>
                  <p className="text-sm text-white/80">MS CS, ITU Lahore - Research Assistant since Mar 2026</p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -top-4 -right-2 sm:-right-6 glass rounded-full px-4 py-2 text-sm font-medium text-primary shadow-glass animate-float">
                12 services
              </div>
              <div aria-hidden="true" className="absolute -bottom-4 -left-2 sm:-left-6 glass rounded-full px-4 py-2 text-sm font-medium text-primary shadow-glass animate-float" style={{ animationDelay: '1.2s' }}>
                AI - Web - Research
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative py-4 border-y border-primary/20 bg-secondary overflow-hidden" aria-hidden="true">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="mx-6 font-display text-lg font-medium text-primary/80 flex items-center gap-6">
              {item}
              <span className="text-accent">+</span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative py-20 px-6 overflow-hidden">
        <PageGlow tone="red" />
        <div className="container mx-auto max-w-7xl relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
                <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Featured Services
              </p>
              <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold">
                What I can do for you
              </h2>
            </div>
            <Link
              to="/services"
              data-reveal
              data-delay="0.1"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline shrink-0"
            >
              See all 12 services
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((service, i) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                data-tilt
                data-reveal
                data-delay={(i * 0.08).toFixed(2)}
                className="group glass visual-card rounded-2xl p-7 hover:shadow-glow-primary hover:-translate-y-1.5 transition-all duration-300 will-change-transform flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5">
                  <service.icon size={24} className="text-primary-foreground" />
                </div>
                <p className="font-mono text-xs tracking-[0.2em] uppercase text-primary mb-2">{service.groupLabel}</p>
                <h3 className="font-display text-2xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5 flex-1">{service.short}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {service.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-primary font-medium">
                  View service details
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="light-section relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-14">
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />How It Works
            </p>
            <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Four simple steps, <span className="text-primary">from idea to delivery</span>
            </h2>
            <p data-reveal data-delay="0.1" className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four steps, from first message to finished work. No surprises along the way.
            </p>
          </div>
          <div className="relative">
            <div aria-hidden="true" className="process-line hidden lg:block" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {PROCESS_STEPS.map((step, i) => (
                <div
                  key={step.title}
                  data-reveal
                  data-delay={(i * 0.08).toFixed(2)}
                  className="glass rounded-2xl p-6 hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <span className="absolute top-5 right-6 font-display text-4xl font-semibold text-primary/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 relative">
                    <step.icon size={24} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal className="text-center mt-10">
            <Link
              to="/process"
              className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
            >
              See the full process
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden tint-red">
        <PageGlow tone="rose" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Why Work With Me
            </p>
            <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Researcher first, <span className="text-primary">engineer always</span>
            </h2>
            <p data-reveal data-delay="0.1" className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The background behind the services, stated plainly.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_FACTS.map((fact, i) => (
              <div
                key={fact.title}
                data-reveal
                data-delay={(i * 0.08).toFixed(2)}
                className="glass visual-card rounded-2xl p-6 hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <CheckCircle size={24} className="text-primary mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">{fact.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div
            data-reveal
            className="relative overflow-hidden rounded-3xl bg-gradient-secondary text-secondary-foreground p-8 md:p-12 text-center"
          >
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
              <div className="aurora-blob aurora-blob--a -top-24 -left-16 opacity-70" />
              <div className="aurora-blob aurora-blob--b -bottom-28 -right-10 opacity-70" />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
                Have a project in mind?
              </h2>
              <p className="text-secondary-foreground/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Tell me about it - a short message is enough to start. I reply personally, usually within a day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link
                  to="/contact"
                  data-magnetic
                  className="inline-flex items-center gap-3 px-10 py-4 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
                >
                  Get in Touch
                  <ArrowRight size={20} />
                </Link>
                <a
                  href="mailto:asmatullahshah0343@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 min-h-[44px] border border-white/30 text-secondary-foreground rounded-full font-medium hover:bg-white/10 transition-all duration-300"
                >
                  <Envelope size={18} />
                  asmatullahshah0343@gmail.com
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-secondary-foreground/70">
                <span className="inline-flex items-center gap-2"><Phone size={16} className="text-primary" /> +92 341 6985286</span>
                <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-primary" /> Lahore, Pakistan</span>
                <a href="https://github.com/mscsAhsan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent"><GithubLogo size={16} className="text-primary" /> github.com/mscsAhsan</a>
                <a href="https://www.linkedin.com/in/syedahsanai-engr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent"><LinkedinLogo size={16} className="text-primary" /> linkedin.com/in/syedahsanai-engr</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
