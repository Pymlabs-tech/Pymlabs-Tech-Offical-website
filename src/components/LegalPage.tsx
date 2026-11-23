import type { ReactNode } from 'react';
import PageHero from './PageHero';

export default function LegalPage({
  title,
  summary,
  updated,
  children,
}: {
  title: string;
  summary: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero lines={[title]} intro={
          <>
            <p>{summary}</p>
            <p className="mt-3 text-[16px] text-white/60">Last updated: {updated}</p>
          </>
        } />
      <section className="section bg-paper">
        <div className="frame">
          <div className="prose-legal mx-auto max-w-[64ch] lg:ml-[16.66%]">{children}</div>
        </div>
      </section>
    </>
  );
}
