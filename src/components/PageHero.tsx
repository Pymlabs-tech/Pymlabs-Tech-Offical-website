import type { ReactNode } from 'react';

type Props = {
  /** Two short lines; each string is one line on desktop */
  lines: [string, string] | [string];
  intro: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
};

/** Dark opening band used by every inner page. */
export default function PageHero({ lines, intro, children, aside }: Props) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div aria-hidden="true" className="hero-light pointer-events-none absolute inset-0" />
      <div className="frame relative grid gap-12 pb-20 pt-36 md:pb-28 md:pt-44 lg:grid-cols-12 lg:items-end">
        <div className={aside ? 'lg:col-span-7' : 'lg:col-span-10'}>
          <h1 className={`text-[9vw] leading-[0.98] tracking-[-0.045em] ${aside ? "md:text-[clamp(44px,5.4vw,84px)]" : "md:text-[clamp(48px,6.6vw,104px)]"}`}>
            {lines.map((l, i) => (
              <span key={l} className="mask-line">
                <span className="mask-inner" style={{ '--d': `${80 + i * 110}ms` } as React.CSSProperties}>
                  {l}
                </span>{" "}
              </span>
            ))}
          </h1>
          <div
            className="fade-up mt-8 max-w-[56ch] text-[18px] leading-relaxed text-white/75 md:text-[19px]"
            style={{ '--d': '380ms' } as React.CSSProperties}
          >
            {intro}
          </div>
          {children && (
            <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ '--d': '460ms' } as React.CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-up lg:col-span-5" style={{ '--d': '520ms' } as React.CSSProperties}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
