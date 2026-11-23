import { ArrowDownRight, Check } from 'lucide-react';
import { ButtonLink } from '../components/Button';
import CtaSection from '../components/CtaSection';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { fragmentFor } from '../components/fragments/Fragments';
import { services } from '../data/services';

export default function Services() {
  return (
    <>
      <PageHero
        lines={['What we can', 'build for you.']}
        intro={
          <p>
            Six services, used alone or together. Each one starts with understanding what you need and ends with software
            you can rely on.
          </p>
        }
        aside={
          <nav aria-label="Services on this page" className="rounded-[20px] bg-white/[0.05] p-3">
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-[16px] text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white"
                  >
                    {s.title}
                    <ArrowDownRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-y-0.5 group-hover:text-white" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      {services.map((s, i) => {
        const Icon = s.icon;
        const Fragment = fragmentFor[s.id];
        const flip = i % 2 === 1;
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-heading`}
            className={`section ${flip ? 'bg-paper-50' : 'bg-paper'}`}
          >
            <div className="frame grid gap-14 lg:grid-cols-12 lg:gap-8">
              <div className={`lg:col-span-6 ${flip ? 'lg:order-2 lg:col-start-7' : ''}`}>
                <Reveal className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </Reveal>
                <Reveal as="h2" delay={60} id={`${s.id}-heading`} className="mt-8 text-[clamp(36px,4.4vw,68px)] leading-[1] tracking-[-0.04em]">
                  {s.title}
                </Reveal>
                <Reveal as="p" delay={120} className="mt-6 max-w-[52ch] text-[18px] leading-relaxed">
                  {s.summary}
                </Reveal>
                <Reveal delay={170} className="mt-10">
                  <h3 className="font-sans text-[16px] font-semibold tracking-normal">What we offer</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.offerings.map((o) => (
                      <li key={o} className={`rounded-full px-4 py-2 text-[15px] ${flip ? 'bg-white' : 'bg-paper-100'}`}>
                        {o}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={220} className="mt-10">
                  <ButtonLink to={`/contact/?service=${s.id}`} variant="dark" arrow>
                    Discuss {s.title.toLowerCase()}
                  </ButtonLink>
                </Reveal>
              </div>

              <div className={`lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8'}`}>
                <Reveal delay={120} className="max-w-[440px]">
                  <Fragment />
                </Reveal>
                <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <Reveal delay={160}>
                    <h3 className="font-sans text-[16px] font-semibold tracking-normal">Benefits</h3>
                    <ul className="mt-4 space-y-3">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex gap-3 text-[16px] leading-snug">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-electric" aria-hidden="true" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={210}>
                    <h3 className="font-sans text-[16px] font-semibold tracking-normal">Use cases</h3>
                    <ul className="mt-4 space-y-3">
                      {s.useCases.map((u) => (
                        <li key={u} className="flex gap-3 text-[16px] leading-snug text-grey-600">
                          <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet" />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <CtaSection />
    </>
  );
}
