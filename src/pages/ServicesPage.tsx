import { Link } from 'react-router-dom';
import { ArrowRight, ListChecks, Wrench, Package, ChatCircle } from 'phosphor-react';
import { PageGlow, SectionDivider } from '../components/SiteFX';
import StatCount from '../components/StatCount';
import { SERVICE_GROUPS, SERVICES, PROCESS_STEPS, STATS } from '../data/services';

const STEP_ICONS = [ChatCircle, ListChecks, Wrench, Package];

const ServicesPage = () => {
  return (
    <div className="pt-16">
      <section className="relative py-24 px-6 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob aurora-blob--a -top-20 left-[8%]" />
          <div className="aurora-blob aurora-blob--b top-10 right-[5%]" />
          <div className="aurora-blob aurora-blob--c bottom-0 left-1/3 hidden md:block" />
        </div>
        <PageGlow tone="red" />
        <div className="container mx-auto max-w-6xl relative text-center">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Services
          </p>
          <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold mb-4 leading-[1.05]">
            What I Can <span className="bg-gradient-primary bg-clip-text text-transparent">Do For You</span>
          </h1>
          <div data-reveal data-delay="0.1" className="w-20 h-1 bg-gradient-primary rounded-full mx-auto mb-6" />
          <p data-reveal data-delay="0.15" className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            12 services in 4 groups. AI, web and research work - offered plainly, with the real skills and real
            projects behind each one. No inflated claims, no invented results.
          </p>
          <div data-reveal data-delay="0.2" className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {['AI & ML', 'Web Development', 'Medical Imaging', 'Research'].map((focus) => (
              <span key={focus} className="px-4 py-1.5 bg-card text-foreground text-sm font-medium rounded-full border border-border shadow-sm">
                {focus}
              </span>
            ))}
          </div>
        </div>
      </section>

      {SERVICE_GROUPS.map((group, gi) => {
        const services = SERVICES.filter((s) => s.group === group.id);
        return (
          <div key={group.id}>
            {gi > 0 && <SectionDivider />}
            <section className={`relative py-20 px-6 overflow-hidden ${gi % 2 === 1 ? 'light-section' : 'tint-red'}`}>
              <PageGlow tone={gi % 2 === 1 ? 'rose' : 'red'} />
              <div className="container mx-auto max-w-7xl relative">
                <div className="mb-12">
                  <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
                    <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />{group.label}
                  </p>
                  <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold mb-3">
                    {group.title}
                  </h2>
                  <div data-reveal data-delay="0.1" className="w-20 h-1 bg-gradient-primary rounded-full mb-4" />
                  <p data-reveal data-delay="0.15" className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    {group.intro}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, i) => {
                    const featured = i === 0;
                    return (
                      <Link
                        key={service.slug}
                        to={`/services/${service.slug}`}
                        data-tilt
                        data-reveal
                        data-delay={((i % 3) * 0.08).toFixed(2)}
                        className={
                          featured
                            ? 'spotlight-card visual-card glass rounded-2xl p-8 md:col-span-2 hover:shadow-glow-primary hover:-translate-y-1.5 transition-all duration-300 will-change-transform flex flex-col relative overflow-hidden'
                            : 'glass visual-card rounded-2xl p-7 hover:shadow-glow-primary hover:-translate-y-1.5 transition-all duration-300 will-change-transform flex flex-col'
                        }
                      >
                        {featured && (
                          <service.icon
                            size={190}
                            aria-hidden="true"
                            className="absolute -bottom-10 -right-8 text-primary/[0.07] pointer-events-none"
                          />
                        )}
                        <div className="relative">
                          <div className={`${featured ? 'w-16 h-16 rounded-2xl' : 'w-12 h-12 rounded-xl'} bg-gradient-primary flex items-center justify-center mb-5`}>
                            <service.icon size={featured ? 32 : 24} className="text-primary-foreground" />
                          </div>
                          <h3 className={`font-display font-semibold mb-2 ${featured ? 'text-3xl' : 'text-2xl'}`}>
                            {service.title}
                          </h3>
                          <p className={`text-muted-foreground leading-relaxed mb-5 ${featured ? 'text-lg' : ''} flex-1`}>
                            {service.short}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {service.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex items-center gap-2 text-primary font-medium">
                            View service details
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        );
      })}

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden tint-rose">
        <PageGlow tone="rose" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-14">
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />How It Works
            </p>
            <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <div data-reveal data-delay="0.1" className="w-20 h-1 bg-gradient-primary rounded-full mx-auto mb-6" />
            <p data-reveal data-delay="0.15" className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps, from first message to finished work.
            </p>
          </div>

          <div className="relative">
            <div aria-hidden="true" className="process-line hidden lg:block" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
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
                      <Icon size={24} className="text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div data-reveal className="text-center mt-10">
            <Link
              to="/process"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              See the full process
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-16 px-6 overflow-hidden tint-red">
        <PageGlow tone="red" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                data-reveal
                data-delay={(i * 0.08).toFixed(2)}
                className="glass rounded-2xl px-4 py-6 text-center hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <p className="font-display text-3xl md:text-4xl font-semibold text-primary">
                  <StatCount target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
            <div
              data-reveal
              data-delay="0.24"
              className="glass rounded-2xl px-4 py-6 text-center hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300"
            >
              <p className="font-display text-3xl md:text-4xl font-semibold text-primary">MS CS</p>
              <p className="text-sm text-muted-foreground mt-1">ITU Lahore - in progress</p>
            </div>
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
              <Link
                to="/contact"
                data-magnetic
                className="inline-flex items-center gap-3 px-10 py-4 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
              >
                Get in Touch
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
