import { Link } from 'react-router-dom';
import { ArrowRight, ChatCircle, ListChecks, Wrench, Package } from 'phosphor-react';
import { PageGlow, SectionDivider } from '../components/SiteFX';
import { PROCESS_STEPS } from '../data/services';

const STEP_ICONS = [ChatCircle, ListChecks, Wrench, Package];

const ProcessPage = () => {
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
            <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />How It Works
          </p>
          <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold mb-4 leading-[1.05]">
            How every project <span className="bg-gradient-primary bg-clip-text text-transparent">works</span>
          </h1>
          <div data-reveal data-delay="0.1" className="w-20 h-1 bg-gradient-primary rounded-full mx-auto mb-6" />
          <p data-reveal data-delay="0.15" className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Four steps, from first message to finished work. The same process for a website, a machine learning
            model, a campaign, or a research collaboration.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-4xl relative">
          <div className="relative">
            <div aria-hidden="true" className="absolute left-[27px] md:left-[31px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-40" />
            <div className="space-y-10 relative">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <article
                    key={step.title}
                    data-reveal
                    data-delay={(i * 0.08).toFixed(2)}
                    className="relative pl-20 md:pl-24"
                  >
                    <div className="absolute left-0 top-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                      <Icon size={28} className="text-primary-foreground" />
                    </div>
                    <span className="absolute top-16 md:top-[4.5rem] left-0 w-14 md:w-16 text-center font-display text-sm font-semibold text-primary/60">
                      Step {i + 1}
                    </span>
                    <div className="glass visual-card rounded-2xl p-7 md:p-8 hover:shadow-glow-primary transition-all duration-300">
                      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">{step.title}</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{step.detail}</p>
                      <h3 className="font-display text-lg font-semibold mb-3">What happens at this stage</h3>
                      <ul className="space-y-2">
                        {step.happens.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                            <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gradient-primary" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="light-section relative py-20 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12">
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />What To Expect
            </p>
            <h2 data-reveal data-delay="0.05" className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Working with me
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Early working versions', text: 'You see a working version early, not a finished surprise at the end. Corrections are cheap while the work is still small.' },
              { title: 'Honest results', text: 'For ML and research work, results are tested on held-out data and reported honestly, including weak results and limits.' },
              { title: 'You own the work', text: 'The finished work, the code, and the setup notes are yours. The goal is work you can run and use without depending on me.' },
            ].map((card, i) => (
              <div
                key={card.title}
                data-reveal
                data-delay={(i * 0.08).toFixed(2)}
                className="glass rounded-2xl p-7 hover:shadow-glow-primary hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="font-display text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6">
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
                Ready to start with step one?
              </h2>
              <p className="text-secondary-foreground/80 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Send a short message about your idea. That is all step one needs.
              </p>
              <Link
                to="/contact"
                data-magnetic
                className="inline-flex items-center gap-3 px-10 py-4 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-glow-primary transition-all duration-300 hover:scale-105"
              >
                Start a Project
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProcessPage;
