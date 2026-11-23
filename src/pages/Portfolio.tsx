import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ButtonAnchor, ButtonLink } from '../components/Button';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { site } from '../config/site';
import { projects, type Project } from '../data/projects';

function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (project && !el.open) el.showModal();
    if (!project && el.open) el.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="project-title"
      className="m-auto w-[min(880px,calc(100vw-32px))] rounded-[24px] bg-white p-0 text-ink backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
    >
      {project && (
        <article className="max-h-[85vh] overflow-y-auto p-6 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[15px] text-grey-600">
                {project.category} · {project.year}
                {project.client ? ` · ${project.client}` : ''}
              </p>
              <h2 id="project-title" className="mt-2 text-[clamp(30px,4vw,48px)] tracking-[-0.04em]">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-100 hover:bg-paper-200"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          {project.image && (
            <img
              src={project.image}
              alt={project.imageAlt ?? ''}
              className="mt-8 w-full rounded-2xl bg-paper-100"
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="mt-8 space-y-4 text-[17px] leading-relaxed">
            {project.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <h3 className="mt-8 font-sans text-[16px] font-semibold tracking-normal">Technologies</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <li key={t} className="rounded-full bg-paper-100 px-3 py-1.5 text-[14px]">
                {t}
              </li>
            ))}
          </ul>
          {project.url && (
            <ButtonAnchor href={project.url} variant="dark" className="mt-8">
              Visit project <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </ButtonAnchor>
          )}
        </article>
      )}
    </dialog>
  );
}

function EmptyState() {
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <Reveal as="h2" className="t-title max-w-[12ch]">
          Case studies are being prepared.
        </Reveal>
        <Reveal as="p" delay={80} className="mt-6 max-w-[48ch] text-[18px] leading-relaxed">
          We only publish work we have permission to share, with accurate details. Case studies will appear here as
          projects are completed and approved for publication.
        </Reveal>
        <Reveal delay={140} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/contact/" arrow>
            Start a Project
          </ButtonLink>
          <ButtonAnchor href={`mailto:${site.email}?subject=${encodeURIComponent('Portfolio enquiry')}`} variant="ghost-dark">
            Ask about our work
          </ButtonAnchor>
        </Reveal>
      </div>
      <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
        <div className="rounded-[24px] bg-paper-50 p-8">
          <h3 className="text-[24px] tracking-[-0.025em]">Each case study will include</h3>
          <ul className="mt-6 space-y-4 text-[17px]">
            {[
              'The problem the project set out to solve',
              'What was built and how it works',
              'The technologies used',
              'A link to the live project where possible',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-electric" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<string>('All');
  const [open, setOpen] = useState<Project | null>(null);

  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], []);
  const visible = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        lines={['Work, shown honestly.']}
        intro={<p>Projects by PYMLABS TECHNOLOGY, with the problem, the solution and the technology behind each one.</p>}
      />

      <section aria-label="Projects" className="section bg-paper">
        <div className="frame">
          {projects.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={filter === c}
                    onClick={() => setFilter(c)}
                    className={`min-h-[44px] rounded-full px-5 text-[15px] font-medium transition-colors ${
                      filter === c ? 'bg-ink text-white' : 'bg-paper-100 hover:bg-paper-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                {visible.length} projects shown
              </p>
              <motion.ul layout className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence initial={false}>
                  {visible.map((p) => (
                    <motion.li
                      key={p.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpen(p)}
                        className="group block h-full w-full overflow-hidden rounded-[24px] bg-paper-50 text-left transition-colors hover:bg-paper-100"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-ink-800">
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.imageAlt ?? ''}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                          )}
                        </div>
                        <div className="p-6">
                          <p className="text-[14px] text-grey-600">
                            {p.category} · {p.year}
                          </p>
                          <h2 className="mt-2 text-[26px] tracking-[-0.03em]">{p.title}</h2>
                          <p className="mt-3 text-[16px] leading-relaxed text-grey-600">{p.summary}</p>
                          <ul className="mt-5 flex flex-wrap gap-2">
                            {p.technologies.slice(0, 4).map((t) => (
                              <li key={t} className="rounded-full bg-white px-3 py-1 text-[13px]">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </>
          )}
        </div>
      </section>

      <ProjectDialog project={open} onClose={() => setOpen(null)} />
    </>
  );
}
