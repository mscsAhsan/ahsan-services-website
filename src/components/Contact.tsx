import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PaperPlaneTilt, GithubLogo, LinkedinLogo, Envelope, Phone, MapPin, CheckCircle } from 'phosphor-react';
import { SERVICES } from '../data/services';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';
  const preselected = SERVICES.some((s) => s.slug === serviceParam) ? serviceParam : '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: preselected,
    message: '',
  });
  const [saved, setSaved] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselected) {
      setFormData((prev) => ({ ...prev, service: preselected }));
    }
  }, [preselected]);

  const openMailto = () => {
    const serviceLabel = SERVICES.find((s) => s.slug === formData.service)?.title || 'General enquiry';
    const subject = encodeURIComponent(`Services enquiry (${serviceLabel}) from ${formData.name}`);
    const body = encodeURIComponent(`Service: ${serviceLabel}\n\n${formData.message}\n\n- ${formData.name} (${formData.email})`);
    window.location.href = `mailto:asmatullahshah0343@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSaved(false);
    setSent(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSaved(true);
        setFormData({ name: '', email: '', service: preselected, message: '' });
        return;
      }
      if (res.status === 503 && data.error === 'DB_NOT_CONFIGURED') {
        openMailto();
        setSent(true);
        return;
      }
      setError(data.error || 'Something went wrong. Please try again.');
    } catch {
      setError('Could not reach the server. Please try again or send an email directly.');
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3"><span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Contact</p>
          <h2 data-reveal data-delay="0.05" className="font-display text-4xl md:text-5xl font-semibold mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <div data-reveal data-delay="0.1" className="w-20 h-1 bg-gradient-primary rounded-full mx-auto mb-6" />
          <p data-reveal data-delay="0.15" className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind, a research idea, or just want to say hello? Drop me a message and let&apos;s
            create something amazing together.
          </p>
          <p data-reveal data-delay="0.2" className="text-sm text-muted-foreground/80 italic mt-3">
            Replies are powered by a human, not a bot. The bot just takes the messages.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div data-reveal>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 min-h-[44px] bg-input glass border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div data-reveal data-delay="0.08">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 min-h-[44px] bg-input glass border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div data-reveal data-delay="0.12">
                <label htmlFor="service" className="block mb-2 font-medium">
                  Service
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 min-h-[44px] bg-input glass border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="">General enquiry</option>
                  {SERVICES.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div data-reveal data-delay="0.16">
                <label htmlFor="message" className="block mb-2 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-input glass border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div data-reveal data-delay="0.24">
                <button
                  type="submit"
                  data-magnetic
                  disabled={sending}
                  className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[44px] bg-gradient-primary text-primary-foreground rounded-full font-medium hover:shadow-glow-primary transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                >
                {sending ? 'Sending...' : 'Send Message'}
                <PaperPlaneTilt size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
              </div>

              {saved && (
                <p className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                  <CheckCircle size={18} />
                  Message saved. I will get back to you soon.
                </p>
              )}

              {sent && (
                <p className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                  <CheckCircle size={18} />
                  Your email app should now be open with the message ready to send.
                </p>
              )}

              {error && (
                <p className="text-center text-sm font-medium text-destructive">
                  {error}{' '}
                  <a href="mailto:asmatullahshah0343@gmail.com" className="underline">
                    Send an email instead
                  </a>
                </p>
              )}
            </form>
          </div>

          <div className="space-y-8">
            <div data-reveal>
              <h3 className="font-display text-2xl font-semibold mb-6">Let&apos;s Connect</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I&apos;m always excited to work on new projects and collaborate with amazing people. Whether you have
                a specific project in mind or just want to explore possibilities, I&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  Research collaborations
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  AI + web projects
                </span>
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">
                  Medical imaging AI
                </span>
              </div>
            </div>

            <div data-reveal data-delay="0.1" className="space-y-4">
              <a href="mailto:asmatullahshah0343@gmail.com" className="flex items-center gap-4 p-4 glass rounded-lg hover:shadow-glow-primary transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Envelope size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">asmatullahshah0343@gmail.com</p>
                  <p className="text-muted-foreground text-sm">mscs26017@itu.edu.pk</p>
                </div>
              </a>

              <a href="tel:+923416985286" className="flex items-center gap-4 p-4 glass rounded-lg hover:shadow-glow-primary transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                  <Phone size={20} className="text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Phone / WhatsApp</p>
                  <p className="text-muted-foreground">+92 341 6985286</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 glass rounded-lg hover:shadow-glow-primary transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <MapPin size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">Lahore, Pakistan</p>
                </div>
              </div>
            </div>

            <div data-reveal data-delay="0.2">
              <h4 className="text-lg font-medium mb-4">Follow Me</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/mscsAhsan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center hover:shadow-glow-primary transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <GithubLogo size={20} className="text-primary-foreground" />
                </a>
                <a
                  href="https://www.linkedin.com/in/syedahsanai-engr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center hover:shadow-glow-secondary transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <LinkedinLogo size={20} className="text-secondary-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" data-parallax data-speed="8" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" data-parallax data-speed="10" />
    </section>
  );
};

export default Contact;
