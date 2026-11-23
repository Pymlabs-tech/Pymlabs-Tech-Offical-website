import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import CtaSection from '../components/CtaSection';
import Reveal from '../components/Reveal';
import StageSlider from '../components/StageSlider';
import {
  BuildStrip,
  CodeFragment,
  ConsultFragment,
  SiteFragment,
  WorkflowFragment,
} from '../components/fragments/Fragments';
import { services } from '../data/services';

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;

const capabilities = [
  {
    title: 'Web development',
    text: 'Responsive websites and web applications built with modern frameworks, tuned for speed and easy to maintain.',
    to: '/services/#website-development',
    Fragment: SiteFragment,
    width: 'md:w-[300px]',
  },
  {
    title: 'Software engineering',
    text: 'Custom software, APIs and databases designed around your workflow, with tests so changes stay safe.',
    to: '/services/#custom-software-development',
    Fragment: CodeFragment,
    width: 'md:w-[380px]',
  },
  {
    title: 'Automation and AI',
    text: 'Workflows that take repetitive work off your team, with AI applied where it is useful and people kept in control.',
    to: '/services/#ai-automation',
    Fragment: WorkflowFragment,
    width: 'md:w-[340px]',
  },
  {
    title: 'Technology consulting',
    text: 'Plain-language advice on what to build, which tools to use and how to plan it, before you spend.',
    to: '/services/#it-consulting',
    Fragment: ConsultFragment,
    width: 'md:w-[300px]',
  },
];

const reasons = [
  {
    title: 'Practical engineering',
    text: 'We build what solves the problem in front of you, keep the design simple, and avoid complexity that does not earn its place.',
  },
  {
    title: 'Customer-focused development',
    text: 'Your users and your business goals set the priorities. We ask questions early so the software fits the way you work.',
  },
  {
    title: 'Modern technology',
    text: 'Current, well-supported tools such as React, TypeScript and established cloud services, chosen for reliability rather than novelty.',
  },
  {
    title: 'Scalable architecture',
    text: 'Clean structure and sensible data design, so the first version can grow with more users, features and integrations.',
  },
  {
    title: 'Transparent communication',
    text: 'Clear scope, regular updates and honest answers about cost, timing and trade-offs from the first conversation.',
  },
];

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-white">
        <div aria-hidden="true" className="hero-light pointer-events-none absolute inset-0" />
        <div className="frame relative pb-24 pt-32 text-center md:pt-36">
          <h1 className="mx-auto text-[10.2vw] md:text-[clamp(56px,7.6vw,124px)] font-semibold leading-[1.02] tracking-[-0.05em]">
            <span className="mask-line">
              <span className="mask-inner" style={d(100)}>
                Building Technology.{" "}
              </span>
            </span>
            <span className="mask-line">
              <span className="mask-inner" style={d(210)}>
                Creating Possibilities.
              </span>
            </span>
          </h1>
          <div className="fade-up mt-8 flex justify-center text-[96px] md:mt-10 md:text-[132px]" style={d(420)}>
            <BuildStrip />
          </div>
          <p
            className="fade-up mx-auto mt-8 max-w-[52ch] text-[17px] leading-relaxed text-white/75 md:mt-12 md:text-[19px]"
            style={d(480)}
          >
            PYMLABS transforms ideas into powerful digital experiences through software engineering, intelligent
            automation and modern technology solutions.
          </p>
          <div className="fade-up mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row" style={d(560)}>
            <ButtonLink to="/contact/" arrow className="w-full max-w-[320px] sm:w-auto">
              Start a Project
            </ButtonLink>
            <ButtonLink to="/services/" variant="ghost-light" className="w-full max-w-[320px] sm:w-auto">
              Explore Our Services
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Introduction */}
      <section aria-labelledby="intro-heading" className="section bg-paper">
        <div className="frame">
          <Reveal as="h2" id="intro-heading" className="t-title max-w-[14ch]">
            Ideas in. Working software out.
          </Reveal>
          <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal as="p" delay={80} className="t-statement font-display font-medium lg:col-span-8">
              PYMLABS designs websites, builds web applications and automates the
              repetitive work that slows a business down.
            </Reveal>
            <Reveal delay={160} className="space-y-5 text-[17px] leading-relaxed lg:col-span-4 lg:pt-2">
              <p>
                We work with individuals, startups and businesses in Puducherry, across Tamil Nadu, throughout India and
                internationally.
              </p>
              <p>
                Every engagement starts with the problem rather than the technology, and ends with software that people
                can actually use, maintain and grow.
              </p>
              <Link to="/about/" className="group inline-flex items-center gap-2 font-medium text-electric-600">
                <span className="link-underline">More about PYMLABS</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ What we do */}
      <section aria-labelledby="services-heading" className="bg-paper pb-[var(--section)]">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal as="h2" id="services-heading" className="t-title max-w-[9ch]">
                What we do.
              </Reveal>
              <Reveal as="p" delay={80} className="mt-6 max-w-[34ch] text-[17px] leading-relaxed">
                Six services that cover a project from the first idea to long after launch.
              </Reveal>
              <Reveal delay={140} className="mt-8">
                <ButtonLink to="/services/" variant="dark" arrow>
                  All services
                </ButtonLink>
              </Reveal>
            </div>
          </div>
          <ul className="lg:col-span-8">
            {services.map((s, i) => {
              return (
                <Reveal as="li" key={s.id} delay={i * 60}>
                  <Link
                    to={`/services/#${s.id}`}
                    className="group -mx-3 grid grid-cols-[1fr_auto] items-center gap-5 rounded-2xl px-3 py-6 transition-colors duration-300 hover:bg-paper-50 md:-mx-6 md:gap-8 md:px-6 md:py-8"
                  >
                    <span>
                      <span className="block font-display text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                        {s.title}
                      </span>
                      <span className="mt-2 block text-[16px] text-grey-600">{s.short}</span>
                    </span>
                    <ArrowUpRight
                      className="h-6 w-6 text-grey-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ----------------------------------------------------- Featured capabilities */}
      <section aria-labelledby="cap-heading" className="section bg-paper-50">
        <div className="frame">
          <div className="lg:pl-[33%]">
            <Reveal as="h2" id="cap-heading" className="t-title max-w-[12ch]">
              Featured capabilities.
            </Reveal>
            <Reveal as="p" delay={80} className="mt-6 max-w-[48ch] text-[17px] leading-relaxed">
              The interfaces below are examples of the kind of software we build, drawn for this page.
            </Reveal>
          </div>
          <div className="mt-20 space-y-24 md:space-y-28">
            {capabilities.map(({ title, text, to, Fragment, width }, i) => (
              <div key={title} className="grid items-start gap-8 md:grid-cols-12 lg:gap-8 [&>*]:min-w-0">
                <div className="md:col-span-6 lg:col-span-5 lg:col-start-5">
                  <Reveal as="h3" className="t-sub">
                    {title}
                  </Reveal>
                  <Reveal as="p" delay={70} className="mt-4 max-w-[38ch] text-[17px] leading-relaxed">
                    {text}
                  </Reveal>
                  <Reveal delay={120} className="mt-5">
                    <Link to={to} className="group inline-flex items-center gap-2 text-[16px] font-medium text-electric-600">
                      <span className="link-underline">Learn more</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </Reveal>
                </div>
                <Reveal
                  delay={160}
                  className={`w-full md:col-span-6 md:justify-self-end lg:col-span-3 lg:col-start-10 ${width} ${
                    i % 2 ? 'max-w-[90%] justify-self-end' : ''
                  }`}
                >
                  <Fragment />
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Our approach */}
      <section aria-labelledby="approach-heading" className="section bg-paper">
        <div className="frame">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Reveal as="h2" id="approach-heading" className="t-title max-w-[13ch] lg:col-span-7">
              How an idea becomes software.
            </Reveal>
            <Reveal as="p" delay={80} className="max-w-[44ch] text-[17px] leading-relaxed lg:col-span-5">
              Our approach turns a business problem into working software in four stages. Drag the slider, or use the
              arrow keys, to walk through an example project.
            </Reveal>
          </div>
          <Reveal delay={140} className="mt-14">
            <StageSlider />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Why PYMLABS */}
      <section aria-labelledby="why-heading" className="section bg-ink text-white">
        <div className="frame grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Reveal as="h2" id="why-heading" className="t-title max-w-[10ch]">
                Why PYMLABS.
              </Reveal>
              <Reveal as="p" delay={80} className="mt-6 max-w-[36ch] text-[17px] leading-relaxed text-white/75">
                Five commitments that shape how every project is planned, built and supported.
              </Reveal>
            </div>
          </div>
          <ul className="space-y-14 lg:col-span-7 lg:space-y-20">
            {reasons.map((r, i) => (
              <li key={r.title} className="grid gap-4 sm:grid-cols-[1fr_1.1fr] sm:gap-10">
                <Reveal as="h3" delay={i * 40} className="t-sub">
                  {r.title}
                </Reveal>
                <Reveal as="p" delay={i * 40 + 80} className="text-[17px] leading-relaxed text-white/75">
                  {r.text}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
