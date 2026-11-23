import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, CheckCircle, CaretDown } from 'phosphor-react';
import { PageGlow, SectionDivider } from '../components/SiteFX';
import { getService, SERVICES } from '../data/services';

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getService(slug) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const related = SERVICES.filter((s) => s.group === service.group && s.slug !== service.slug);
  const others = SERVICES.filter((s) => s.group !== service.group).slice(0, 2);
  const relatedList = [...related, ...others].slice(0, 3);

  return (
    <div className="pt-16">
      <section className="relative py-20 px-6 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="aurora-blob aurora-blob--a -top-20 left-[8%]" />
          <div className="aurora-blob aurora-blob--b top-10 right-[5%]" />
        </div>
        <PageGlow tone="red" />
        <div className="container mx-auto max-w-6xl relative">
          <Link
            to="/services"
            data-reveal
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-medium mb-8 min-h-[44px]"
          >
            <ArrowLeft size={16} />
            All services
          </Link>
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />
            {service.groupLabel}
          </p>
          <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-6xl font-semibold mb-5 leading-[1.05] max-w-3xl">
            {service.title}
          </h1>
          <p data-reveal data-delay="0.1" className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6">
            {service.short}
          </p>
          <div data-reveal data-delay="0.15" className="flex flex-wrap gap-2 mb-10">
            {service.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
          <div data-reveal data-delay="0.2" className="flex flex-wrap gap-4">
            <Link
              to={`/contact?service=${service.slug}`}
              data-magnetic
              className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
            >
              Start this project
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 px-8 py-3 min-h-[44px] border border-primary/40 text-primary rounded-full font-semibold hover:bg-primary/10 transition-all duration-300 hover:scale-105"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="light-section relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
                <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Overview
              </p>
              <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-6">
                About this service
              </h2>
              {service.overview.map((para, i) => (
                <p key={i} data-reveal data-delay={(i * 0.05).toFixed(2)} className="text-lg text-muted-foreground leading-relaxed mb-5">
                  {para}
                </p>
              ))}
            </div>
            <aside data-reveal data-delay="0.1" className="glass rounded-2xl p-7 h-fit">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5">
                <service.icon size={28} className="text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Ready to start?</h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                Tell me about your project. A short message is enough to start, and I reply personally, usually within a day.
              </p>
              <Link
                to={`/contact?service=${service.slug}`}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
              >
                Start this project
                <ArrowRight size={18} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden tint-red">
        <PageGlow tone="red" />
        <div className="container mx-auto max-w-6xl relative">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />What Is Included
          </p>
          <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-10">
            What you get
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {service.deliverables.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-delay={((i % 2) * 0.08).toFixed(2)}
                className="glass rounded-2xl p-5 flex items-start gap-4 hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <CheckCircle size={24} className="text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="light-section relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />How It Works
          </p>
          <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-4">
            How this service works
          </h2>
          <p data-reveal data-delay="0.1" className="text-lg text-muted-foreground max-w-2xl mb-12">
            The same four steps as every project, shaped around this service.
          </p>
          <div className="relative">
            <div aria-hidden="true" className="process-line hidden lg:block" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {service.process.map((step, i) => (
                <div
                  key={step.title}
                  data-reveal
                  data-delay={(i * 0.08).toFixed(2)}
                  className="glass rounded-2xl p-6 hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <span className="absolute top-5 right-6 font-display text-4xl font-semibold text-primary/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden tint-rose">
        <PageGlow tone="rose" />
        <div className="container mx-auto max-w-6xl relative">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Tools and Technologies
          </p>
          <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-10">
            Tools I use for this service
          </h2>
          <div data-reveal data-delay="0.1" className="flex flex-wrap gap-3">
            {service.tools.map((tool) => (
              <span key={tool} className="px-5 py-2.5 min-h-[44px] inline-flex items-center bg-card text-foreground font-medium rounded-full border border-border shadow-sm hover:border-primary/50 hover:text-primary transition-colors duration-300">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="light-section relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-4xl relative">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3 text-center">
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Questions
          </p>
          <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} data-reveal data-delay={(i * 0.05).toFixed(2)} className="glass rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 min-h-[44px]"
                  >
                    <span className="font-display text-lg font-semibold">{faq.q}</span>
                    <CaretDown size={20} className={`text-primary shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {open && (
                    <p className="px-6 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <h2 data-reveal className="font-display text-3xl md:text-4xl font-semibold">
              Related services
            </h2>
            <Link to="/services" data-reveal className="inline-flex items-center gap-2 text-primary font-medium hover:underline shrink-0">
              See all services
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedList.map((item, i) => (
              <Link
                key={item.slug}
                to={`/services/${item.slug}`}
                data-reveal
                data-delay={(i * 0.08).toFixed(2)}
                className="group glass visual-card rounded-2xl p-7 hover:shadow-glow-primary hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5">
                  <item.icon size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5 flex-1">{item.short}</p>
                <span className="inline-flex items-center gap-2 text-primary font-medium">
                  View service details
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
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
                Start a {service.title} project
              </h2>
              <p className="text-secondary-foreground/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Tell me about your project - a short message is enough to start. I reply personally, usually within a day.
              </p>
              <Link
                to={`/contact?service=${service.slug}`}
                data-magnetic
                className="inline-flex items-center gap-3 px-10 py-4 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
              >
                Start this project
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
