import { Mail } from 'lucide-react';
import { ButtonAnchor, ButtonLink } from '../components/Button';
import CtaSection from '../components/CtaSection';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { CodeFragment } from '../components/fragments/Fragments';
import { site } from '../config/site';

const values = [
  { title: 'Honesty', text: 'We say what we can and cannot do, give realistic estimates, and never overstate results.' },
  { title: 'Craft', text: 'Small details, such as loading speed, clear wording and accessible forms, are part of the job, not extras.' },
  { title: 'Ownership', text: 'We treat every project as if we had to maintain it for years, because often we will.' },
  { title: 'Clarity', text: 'Plain language in proposals, documentation and conversations, so nobody is left guessing.' },
  { title: 'Learning', text: 'Technology changes quickly. We keep learning so our customers do not have to chase every trend.' },
];

const principles = [
  {
    title: 'Start from the problem',
    text: 'Requirements are written in terms of what users need to do, then turned into software. Not the other way round.',
  },
  {
    title: 'Keep it simple',
    text: 'The simplest design that meets the need is usually the fastest, cheapest and most reliable one to run.',
  },
  {
    title: 'Test what matters',
    text: 'Automated tests guard the parts of a system where mistakes are expensive, such as payments, permissions and data.',
  },
  {
    title: 'Leave it maintainable',
    text: 'Readable code, sensible structure and written documentation, so the software can be extended by us or anyone else.',
  },
];

export default function About() {
  return (
    <>
      <PageHero
        lines={['Technology,', 'built to be practical.']}
        intro={
          <p>
            PYMLABS TECHNOLOGY designs and builds websites, web applications, custom software and AI automation for
            individuals, startups and businesses. This is who we are and how we work.
          </p>
        }
      />

      {/* Company introduction */}
      <section aria-labelledby="who-heading" className="section bg-paper">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <Reveal as="h2" id="who-heading" className="t-title lg:col-span-5">
            Who we are.
          </Reveal>
          <div className="space-y-6 text-[18px] leading-relaxed lg:col-span-7">
            <Reveal as="p" className="t-statement font-display font-medium">
              PYMLABS is a software and technology services company. The name carries the idea behind it: a lab, where
              ideas are tested, refined and turned into something that works.
            </Reveal>
            <Reveal as="p" delay={80}>
              We take on project-based development, custom business solutions and professional technology services. Our
              work covers the full path of a project: understanding the need, designing the experience, engineering the
              software, launching it and supporting it afterwards.
            </Reveal>
            <Reveal as="p" delay={140}>
              Alongside client work, we intend to develop our own software products and SaaS offerings over time, built on
              the same principles we bring to every project.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section aria-labelledby="mission-heading" className="section bg-paper-50">
        <div className="frame">
          <h2 id="mission-heading" className="sr-only">
            Mission and vision
          </h2>
          <div className="grid gap-16 md:grid-cols-2 md:gap-10">
            <Reveal>
              <h3 className="t-sub text-electric-600">Mission</h3>
              <p className="mt-6 max-w-[30ch] font-display text-[clamp(22px,2.4vw,34px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                To turn real business problems into software that is simple to use and dependable to run.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h3 className="t-sub text-violet">Vision</h3>
              <p className="mt-6 max-w-[30ch] font-display text-[clamp(22px,2.4vw,34px)] font-semibold leading-[1.15] tracking-[-0.03em]">
                To become a trusted technology partner known for intelligent products and honest engineering.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-heading" className="section bg-paper">
        <div className="frame grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal as="h2" id="values-heading" className="t-title lg:sticky lg:top-28">
              Core values.
            </Reveal>
          </div>
          <dl className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <dt className="font-display text-[clamp(26px,2.6vw,36px)] font-semibold tracking-[-0.03em]">{v.title}</dt>
                <dd className="mt-3 max-w-[38ch] text-[17px] leading-relaxed text-grey-600">{v.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-heading" className="section bg-ink text-white">
        <div className="frame grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal as="h2" id="founder-heading" className="t-title">
              Founder.
            </Reveal>
            <Reveal as="p" delay={80} className="mt-6 max-w-[32ch] text-[17px] leading-relaxed text-white/70">
              PYMLABS TECHNOLOGY is founded and led by {site.founder.name}.
            </Reveal>
            <Reveal delay={140} className="mt-10 max-w-[460px] overflow-hidden rounded-[28px] bg-ink-800">
              <img
                src="/images/founder-sharvesh-raja-v2.webp"
                width={720}
                height={720}
                alt={`${site.founder.name}, ${site.founder.role} of PYMLABS TECHNOLOGY`}
                loading="lazy"
                decoding="async"
                className="aspect-square h-auto w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
              />
            </Reveal>
          </div>

          <Reveal delay={120} className="rounded-[28px] bg-ink-800 p-6 sm:p-10 lg:col-span-7">
            <div>
              <h3 className="text-[clamp(28px,3vw,44px)] tracking-[-0.035em]">{site.founder.name}</h3>
              <p className="mt-2 text-[17px] text-white/65">{site.founder.role}, PYMLABS TECHNOLOGY</p>
            </div>

            <p className="mt-8 max-w-[58ch] text-[18px] leading-relaxed text-white/80">
              As founder, {site.founder.name.split(' ')[0]} sets the company&rsquo;s direction and is responsible for how
              PYMLABS builds software and works with its customers.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { title: 'Direction', text: 'Where PYMLABS is heading and what it builds.' },
                { title: 'Engineering', text: 'How software is designed, built and tested.' },
                { title: 'Customers', text: 'Clear scope and honest communication.' },
              ].map((item) => (
                <li key={item.title} className="rounded-2xl bg-white/[0.05] p-5">
                  <p className="font-display text-[19px] font-semibold tracking-[-0.02em]">{item.title}</p>
                  <p className="mt-1.5 text-[15px] leading-snug text-white/65">{item.text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <ButtonAnchor href={`mailto:${site.email}`} variant="light">
                <Mail className="h-4 w-4" aria-hidden="true" /> Get in touch
              </ButtonAnchor>
              <span className="break-all text-[15px] text-white/60">{site.email}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Engineering philosophy */}
      <section aria-labelledby="philosophy-heading" className="section bg-paper">
        <div className="frame grid gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <Reveal as="h2" id="philosophy-heading" className="t-title max-w-[12ch]">
              Engineering philosophy.
            </Reveal>
            <ul className="mt-14 space-y-10">
              {principles.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 60}>
                  <h3 className="text-[clamp(22px,2vw,28px)] tracking-[-0.025em]">{p.title}</h3>
                  <p className="mt-3 max-w-[46ch] text-[17px] leading-relaxed text-grey-600">{p.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={160} className="lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8">
            <CodeFragment />
            <p className="mt-4 text-[14px] text-grey-500">Small, readable functions with tests around them.</p>
          </Reveal>
        </div>
      </section>

      {/* Direction */}
      <section aria-labelledby="direction-heading" className="bg-paper pb-[var(--section)]">
        <div className="frame">
          <div className="grid gap-10 lg:grid-cols-12">
            <Reveal as="h2" id="direction-heading" className="t-title lg:col-span-6">
              Close to home, built for everywhere.
            </Reveal>
            <div className="space-y-6 text-[18px] leading-relaxed lg:col-span-6">
              <Reveal as="p" delay={80}>
                Our first market is Puducherry and Tamil Nadu. Because our work is planned and delivered remotely, customers
                across India and in other countries can work with us just as easily.
              </Reveal>
              <Reveal as="p" delay={140}>
                Over the long term, PYMLABS aims to grow from a services company into a technology company with its own
                products, combining what we learn on client projects with intelligent, practical software of our own.
              </Reveal>
              <Reveal delay={200}>
                <ButtonLink to="/contact/" arrow>
                  Work with us
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
