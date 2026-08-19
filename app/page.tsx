'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import NeoHeroArt from './components/NeoHeroArt'

const services = [
  {
    number: '01',
    title: 'Web Experiences',
    text: 'High-converting websites engineered for speed, SEO and memorable brand presence.',
    tags: ['Next.js', 'Shopify', 'Webflow'],
  },
  {
    number: '02',
    title: 'Apps & Systems',
    text: 'Custom products, portals and internal tools that remove friction from the way your business works.',
    tags: ['Web Apps', 'CRM', 'Dashboards'],
  },
  {
    number: '03',
    title: 'AI & Automation',
    text: 'Practical AI workflows that save time, connect your tools and turn repetitive work into systems.',
    tags: ['AI Agents', 'APIs', 'Workflows'],
  },
  {
    number: '04',
    title: 'Brand & Visuals',
    text: 'Cohesive visual systems and graphics that make your business look as credible as it is.',
    tags: ['Identity', 'UI/UX', 'Creative'],
  },
]

const faqs: ReadonlyArray<readonly [string, string]> = [
  ['Can you redesign our existing site?', 'Yes. We can keep what already works, remove the friction, and rebuild the experience around a stronger visual system, performance and conversion path.'],
  ['What platforms do you work with?', 'Our stack can flex around the project: Next.js and custom code for performance, or WordPress, Shopify, Webflow and other platforms when they are the right fit.'],
  ['Do you build custom business software?', 'Yes. We create customer portals, admin dashboards, CRM-style systems, booking flows, API integrations and other custom applications.'],
  ['How do you approach AI projects?', 'We start with the workflow, not the hype. We identify a measurable bottleneck, connect the right models and tools, then build a reliable automation around it.'],
]

const processSteps: ReadonlyArray<readonly [string, string, string]> = [
  ['01', 'Discover', 'Align on goals, audience, offer and the problem that matters.'],
  ['02', 'Shape', 'Turn the direction into a focused information architecture and visual system.'],
  ['03', 'Build', 'Design and engineering happen together for faster iteration and cleaner results.'],
  ['04', 'Launch', 'Polish, test, ship and hand over a system your team can keep moving with.'],
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form: { name: string; email: string; message: string }) {
  const errors: Partial<Record<keyof typeof form, string>> = {}
  if (!form.name.trim()) errors.name = 'Required'
  if (!form.email.trim()) errors.email = 'Required'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid work email'
  if (!form.message.trim()) errors.message = 'Required'
  else if (form.message.trim().length < 10) errors.message = 'A bit more detail please'
  return errors
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<ReturnType<typeof validate>>({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  useEffect(() => {
    let frame = 0
    const updateVisibility = () => {
      const scrollY = window.scrollY
      const nextBackToTop = scrollY > 300
      const nextScrolled = scrollY > 20
      setShowBackToTop((current) => (current === nextBackToTop ? current : nextBackToTop))
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled))
      frame = 0
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateVisibility)
    }
    updateVisibility()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const backToTopFrameRef = useRef<number>(0)

  const handleBackToTop = useCallback(() => {
    const startPosition = window.scrollY
    if (startPosition === 0) return

    const startTime = performance.now()
    const duration = Math.min(1000, Math.max(700, startPosition * 0.35))
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      window.scrollTo(0, startPosition * (1 - easedProgress))
      if (progress < 1) backToTopFrameRef.current = window.requestAnimationFrame(animateScroll)
    }

    backToTopFrameRef.current = window.requestAnimationFrame(animateScroll)
  }, [])

  useEffect(
    () => () => {
      if (backToTopFrameRef.current) window.cancelAnimationFrame(backToTopFrameRef.current)
    },
    [],
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nextErrors = validate(formData)
    setFormErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setFormSubmitted(true)
  }

  return (
    <main>
      <header className="nav-wrap">
        <nav className={`nav container ${isScrolled ? 'is-scrolled' : ''}`}>
          <Link className="brand" href="#top" aria-label="NeoDev Studio home">
            <Image
              className="brand-logo"
              src="/neodevweb/brand/neodev-logo-mark.png"
              alt="NeoDev Studio"
              width={32}
              height={32}
              priority
            />
            <span className="brand-name-wrapper">
              <span className="brand-name">NeoDev<span className="muted-brand">Studio</span></span>
            </span>
          </Link>
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link href="#services" onClick={closeMobileMenu}>Services</Link>
            <Link href="#process" onClick={closeMobileMenu}>Process</Link>
            <Link href="#faq" onClick={closeMobileMenu}>FAQ</Link>
          </div>
          <div className="nav-actions">
            <Link className="nav-cta" href="#contact" onClick={closeMobileMenu}>
              Book a call <span>↗</span>
            </Link>
            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </nav>
      </header>

      <section id="top" className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse"></span> Digital studio for ambitious businesses</div>
          <h1>We build digital experiences <em>worth remembering.</em></h1>
          <p className="hero-lead">Websites, applications, brand systems and AI automation—designed together so your business looks sharper, works faster and scales smarter.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="#contact">Start a project <span>↗</span></Link>
            <Link className="text-link" href="#services">Explore capabilities <span>↓</span></Link>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack"><span>A</span><span>N</span><span>+</span></div>
            <div><strong>Built with care.</strong><small>From first sketch to final launch.</small></div>
          </div>
        </div>

        <NeoHeroArt tint="brand" />
      </section>

      <section className="ticker" aria-label="Capabilities ticker">
        <div className="ticker-track">
          {[0, 1, 2, 3].map((copy) => (
            <div className="ticker-loop" key={copy} aria-hidden={copy > 0}>
              <span>WEB DEVELOPMENT</span><b>✦</b>
              <span>AI AUTOMATION</span><b>✦</b>
              <span>PRODUCT DESIGN</span><b>✦</b>
              <span>APP DEVELOPMENT</span><b>✦</b>
              <span>BRAND SYSTEMS</span><b>✦</b>
              <span>CUSTOM SOFTWARE</span><b>✦</b>
              <span>WORKFLOW AUTOMATION</span><b>✦</b>
            </div>
          ))}
        </div>
      </section>

      <section className="intro container section-pad">
        <div className="section-kicker">Why NeoDev</div>
        <div className="intro-grid">
          <h2>Good design gets attention.<br /><span>Good systems earn growth.</span></h2>
          <div>
            <p>We combine design thinking, engineering discipline and automation strategy under one roof. That means fewer handoffs, faster decisions and a final product that feels intentionally made.</p>
            <div className="metrics">
              <div><b>01</b><span>Single creative + technical partner</span></div>
              <div><b>02</b><span>Built around business outcomes</span></div>
              <div><b>03</b><span>Launch-ready, not just pretty</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services container section-pad">
        <div className="section-head">
          <div>
            <div className="section-kicker">Capabilities</div>
            <h2>What we can build<br /><span>with you.</span></h2>
          </div>
          <p>From a focused landing page to an entire digital operating layer, we choose the stack and scope that fit the job.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div className="service-icon">↗</div>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <div className="tags">
                {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="container section-pad">
          <div className="section-head process-head">
            <div>
              <div className="section-kicker">How we work</div>
              <h2>A simpler path from <span>idea to impact.</span></h2>
            </div>
            <p>No bloated process. We keep strategy, design and build close together, so progress stays visible from week one.</p>
          </div>
          <div className="process-grid">
            {processSteps.map(([num, title, text]) => (
              <div className="process-step" key={num}>
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section container section-pad">
        <div className="quote-mark">“</div>
        <blockquote>We don’t just make something look better. We make the whole digital experience <span>make more sense.</span></blockquote>
        <div className="quote-caption">NeoDev Studio / Design × Engineering × Automation</div>
      </section>

      <section id="faq" className="faq container section-pad">
        <div className="section-kicker">FAQ</div>
        <div className="faq-grid">
          <h2>Questions before<br /><span>we start?</span></h2>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index
              const faqId = `faq-answer-${index}`
              return (
                <div key={question} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-header"
                    aria-expanded={isOpen}
                    aria-controls={faqId}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span className="faq-question">{question}</span>
                    <span className="faq-symbol" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                  <div id={faqId} className="faq-answer" role="region" aria-hidden={!isOpen}>
                    <p>{answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container contact-inner">
          <div>
            <div className="section-kicker">Start a conversation</div>
            <h2>Have an idea worth<br /><span>building?</span></h2>
            <p>Tell us what you’re trying to improve, launch or automate. We’ll bring the right mix of design and engineering to the table.</p>
            <div className="contact-details">
              <a href="mailto:hello@neodevstudio.com">hello@neodevstudio.com</a>
              <div>
                <a href="https://x.com/neodev_studio" target="_blank" rel="noopener noreferrer">X</a>
                <a href="https://www.linkedin.com/neodev_studio" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://www.instagram.com/neodev_studio/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </div>
            </div>
          </div>

          <div
            className="contact-card-wrap"
            aria-live="polite"
            aria-atomic="true"
          >
            {formSubmitted ? (
              <div className="contact-card contact-success" role="status">
                <div className="success-icon" aria-hidden="true">✓</div>
                <h3>Inquiry received.</h3>
                <p>Thanks — we'll get back to you within 24 hours.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setFormSubmitted(false)
                    setFormData({ name: '', email: '', message: '' })
                    setFormErrors({})
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                className="contact-card"
                name="contact"
                method="POST"
                action="/"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                noValidate={false}
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }} aria-hidden="true">
                  <label>
                    Don't fill this out if you're human:
                    <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                </p>

                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  maxLength={200}
                  placeholder="Your name"
                  value={formData.name}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? 'contact-name-err' : undefined}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                {formErrors.name && (
                  <small id="contact-name-err" className="field-error">{formErrors.name}</small>
                )}

                <label htmlFor="contact-email">Work email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={320}
                  placeholder="you@company.com"
                  value={formData.email}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? 'contact-email-err' : undefined}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {formErrors.email && (
                  <small id="contact-email-err" className="field-error">{formErrors.email}</small>
                )}

                <label htmlFor="contact-msg">What are you building?</label>
                <textarea
                  id="contact-msg"
                  name="message"
                  required
                  maxLength={5000}
                  placeholder="A website, app, automation, redesign…"
                  rows={4}
                  value={formData.message}
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={formErrors.message ? 'contact-msg-err' : undefined}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                {formErrors.message && (
                  <small id="contact-msg-err" className="field-error">{formErrors.message}</small>
                )}

                <button className="button button-primary" type="submit">
                  Send inquiry <span>↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="footer container">
        <div className="brand footer-brand">
          <Image
            className="brand-logo"
            src="/neodevweb/brand/neodev-logo-mark.png"
            alt="NeoDev Studio"
            width={32}
            height={32}
          />
          <span>NeoDev<span className="muted-brand">Studio</span></span>
        </div>
        <div className="footer-right">
          <span>© 2026 NeoDev Studio</span>
        </div>
      </footer>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        Back to top <span className="arrow-icon" aria-hidden="true">↑</span>
      </button>
    </main>
  )
}
