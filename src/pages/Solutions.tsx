import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '../components/Button';
import CtaSection from '../components/CtaSection';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { services } from '../data/services';
import { solutions } from '../data/solutions';

const serviceTitle = (id: string) => services.find((s) => s.id === id)?.title ?? id;

export default function Solutions() {
  const [active, setActive] = useState(solutions[0].id);
  const current = solutions.find((s) => s.id === active)!;

  return (
    <>
      <PageHero
        lines={['Software that fits', 'where you are now.']}
        intro={
          <p>
            A startup, a small shop and a large organisation need very different things from technology. Choose the
            description closest to you to see how PYMLABS can help.
          </p>
        }
      />

      {/* Audience picker */}
      <section aria-labelledby="picker-heading" className="section bg-paper">
        <div className="frame">
          <Reveal as="h2" id="picker-heading" className="t-title max-w-[14ch]">
            Who are you building for?
          </Reveal>

          <div role="tablist" aria-label="Customer type" className="mt-12 flex flex-wrap gap-2">
            {solutions.map((s) => (
              <button
                key={s.id}
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={active === s.id}
                aria-controls="solution-panel"
                tabIndex={active === s.id ? 0 : -1}
                onClick={() => setActive(s.id)}
                onKeyDown={(e) => {
                  const idx = solutions.findIndex((x) => x.id === active);
                  let next = idx;
                  if (e.key === 'ArrowRight') next = (idx + 1) % solutions.length;
                  if (e.key === 'ArrowLeft') next = (idx - 1 + solutions.length) % solutions.length;
                  if (next !== idx) {
                    e.preventDefault();
                    setActive(solutions[next].id);
                    document.getElementById(`tab-${solutions[next].id}`)?.focus();
                  }
                }}
                className={`min-h-[48px] rounded-full px-6 text-[16px] font-medium transition-colors duration-200 ${
                  active === s.id ? 'bg-ink text-white' : 'bg-paper-100 text-ink hover:bg-paper-200'
                }`}
              >
                {s.audience}
              </button>
            ))}
          </div>

          <div
            id="solution-panel"
            role="tabpanel"
            aria-labelledby={`tab-${current.id}`}
            className="mt-10 grid gap-10 rounded-[28px] bg-paper-50 p-6 sm:p-10 lg:grid-cols-12 lg:p-14"
          >
            <div className="lg:col-span-6">
              <h3 className="text-[clamp(32px,3.6vw,54px)] leading-[1.02] tracking-[-0.04em]">{current.heading}</h3>
              <p className="mt-6 max-w-[48ch] text-[18px] leading-relaxed">{current.situation}</p>
              <p className="mt-6 text-[16px] text-grey-600">
                <span className="font-semibold text-ink">A typical first step: </span>
                {current.typicalStart}
              </p>
            </div>
            <div className="lg:col-span-6">
              <h4 className="font-sans text-[16px] font-semibold tracking-normal">How we can help</h4>
              <ul className="mt-4 space-y-3">
                {current.howWeHelp.map((h) => (
                  <li key={h} className="rounded-2xl bg-white px-5 py-4 text-[16px] leading-snug">
                    {h}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] text-grey-600">
                Related services:{' '}
                {current.services.map((id, k) => (
                  <span key={id}>
                    <Link to={`/services/#${id}`} className="font-medium text-electric-600 underline-offset-4 hover:underline">
                      {serviceTitle(id)}
                    </Link>
                    {k < current.services.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All audiences at a glance (also readable without JavaScript) */}
      <section aria-labelledby="glance-heading" className="section bg-ink text-white">
        <div className="frame">
          <Reveal as="h2" id="glance-heading" className="t-title max-w-[12ch]">
            Every customer, at a glance.
          </Reveal>
          <ul className="mt-16">
            {solutions.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 50} className="grid gap-4 py-8 md:grid-cols-12 md:gap-8">
                <h3 className="t-sub md:col-span-4">{s.audience}</h3>
                <p className="text-[17px] leading-relaxed text-white/75 md:col-span-5">{s.situation}</p>
                <div className="md:col-span-3 md:text-right">
                  <Link
                    to={`/contact/?service=${s.services[0]}`}
                    className="group inline-flex items-center gap-2 text-[16px] font-medium text-white"
                  >
                    <span className="link-underline">Talk about this</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-14">
            <p className="max-w-[60ch] text-[16px] text-white/65">
              Not sure which description fits? Most projects do not fit neatly into one box. Tell us about yours and we
              will suggest where to start.
            </p>
            <ButtonLink to="/contact/" variant="light" arrow className="mt-6">
              Start a Project
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
