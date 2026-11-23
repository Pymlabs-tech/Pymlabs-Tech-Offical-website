import { site } from '../config/site';
import { ButtonAnchor, ButtonLink } from './Button';
import Reveal from './Reveal';

const line = 'block font-display text-[clamp(52px,10vw,160px)] font-semibold leading-[0.95] tracking-[-0.05em]';

/** Closing question set at both edges, with the two answers between. */
export default function CtaSection() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-ink-850 text-white">
      <div aria-hidden="true" className="cta-light pointer-events-none absolute inset-0" />
      <h2 id="cta-heading" className="sr-only">
        Have an idea? Let&rsquo;s build it.
      </h2>
      <div className="frame relative flex min-h-[560px] flex-col justify-between py-16 text-center md:min-h-[72svh] md:py-20">
        <Reveal as="p" className={line}>
          <span aria-hidden="true">Have an idea?</span>
        </Reveal>
        <div className="my-16 flex flex-col items-center md:my-10">
          <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-8">
            <ButtonLink to="/contact/" variant="primary" arrow className="w-[min(320px,80vw)] sm:w-auto sm:min-w-[210px]">
              Start a Project
            </ButtonLink>
            <span className="text-[16px] text-white/55">or</span>
            <ButtonAnchor href={`mailto:${site.email}`} variant="ghost-light" className="w-[min(320px,80vw)] sm:w-auto sm:min-w-[210px]">
              Email us directly
            </ButtonAnchor>
          </div>
          <p className="mt-6 max-w-[46ch] text-[16px] text-white/70">
            Tell us a little about what you want to build. We reply by email with questions or a suggested next step.
          </p>
        </div>
        <Reveal as="p" delay={90} className={line}>
          <span aria-hidden="true">Let&rsquo;s build it.</span>
        </Reveal>
      </div>
    </section>
  );
}
