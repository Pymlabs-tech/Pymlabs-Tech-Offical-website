import { AnimatePresence, motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { useId, useState } from 'react';

type Stage = {
  name: string;
  clause: string;
  text: string;
  render: () => JSX.Element;
};

const PROJECT = 'Example: online booking for a dental clinic';

const Panel = ({ title, children, badge }: { title: string; badge?: string; children: React.ReactNode }) => (
  <div data-ui="" className="w-full max-w-[440px] rounded-[16px] bg-white p-5 text-ink ring-1 ring-ink/[0.06]">
    <div className="flex items-center justify-between gap-3">
      <span className="text-[14px] font-semibold">{title}</span>
      {badge && <span className="rounded-full bg-paper-100 px-2.5 py-1 text-[11px] font-medium text-grey-600">{badge}</span>}
    </div>
    <p className="mt-1 text-[12px] text-grey-500">{PROJECT}</p>
    <div className="mt-4">{children}</div>
  </div>
);

const Row = ({ state, label, meta }: { state: 'done' | 'doing' | 'todo'; label: string; meta?: string }) => (
  <li className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 ${state === 'doing' ? 'bg-electric/[0.07]' : 'bg-paper-50'}`}>
    {state === 'done' && <Check className="h-4 w-4 shrink-0 text-emerald-600" />}
    {state === 'doing' && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-electric" />}
    {state === 'todo' && <Circle className="h-4 w-4 shrink-0 text-grey-300" />}
    <span className={`flex-1 text-[13px] ${state === 'todo' ? 'text-grey-500' : ''}`}>{label}</span>
    {meta && <span className="text-[12px] tabular-nums text-grey-500">{meta}</span>}
  </li>
);

const stages: Stage[] = [
  {
    name: 'Discover',
    clause: 'First, understand the problem.',
    text: 'We talk to the people who will use the software, list what must be true for it to succeed, and agree a written scope before any code is written.',
    render: () => (
      <Panel title="Project brief" badge="Scope agreed">
        <ul className="space-y-2">
          <Row state="done" label="Patients book a slot without calling" />
          <Row state="done" label="Reception sees the day at a glance" />
          <Row state="done" label="SMS or email reminder before visit" />
          <Row state="todo" label="Online payments" meta="Later" />
        </ul>
      </Panel>
    ),
  },
  {
    name: 'Design',
    clause: 'Then, shape it on screen.',
    text: 'Screens and flows are designed and reviewed with you, so everyone can see and change how the product will work while changes are still cheap.',
    render: () => (
      <Panel title="Screens" badge="Round 2 of review">
        <div className="grid grid-cols-3 gap-2">
          {['Choose a service', 'Pick a time', 'Confirm'].map((s, i) => (
            <div key={s} className={`rounded-[10px] p-2.5 ${i === 1 ? 'bg-ink text-white' : 'bg-paper-50'}`}>
              <div className={`h-1.5 w-8 rounded-full ${i === 1 ? 'bg-white/40' : 'bg-grey-300'}`} />
              <div className="mt-2 grid grid-cols-3 gap-1">
                {Array.from({ length: 6 }).map((_, k) => (
                  <div
                    key={k}
                    className={`h-4 rounded ${i === 1 ? (k === 4 ? 'bg-electric' : 'bg-white/15') : 'bg-paper-200'}`}
                  />
                ))}
              </div>
              <p className={`mt-2 text-[11px] leading-tight ${i === 1 ? 'text-white' : 'text-grey-600'}`}>{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-grey-600">Comment: &ldquo;Show the next free slot first.&rdquo;</p>
      </Panel>
    ),
  },
  {
    name: 'Build',
    clause: 'Next, build in small steps.',
    text: 'Work is delivered in short, visible iterations. You can try each one, and every change is reviewed and tested before it moves forward.',
    render: () => (
      <Panel title="Iteration 3" badge="9 of 12 tasks">
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-paper-100">
          <div className="h-full w-3/4 rounded-full bg-electric" />
        </div>
        <ul className="space-y-2">
          <Row state="done" label="Booking calendar" />
          <Row state="done" label="Reception dashboard" />
          <Row state="doing" label="Reminder messages" meta="In review" />
          <Row state="todo" label="Holiday closures" />
        </ul>
      </Panel>
    ),
  },
  {
    name: 'Launch',
    clause: 'Finally, launch and improve.',
    text: 'We deploy, check that everything works on real devices, hand over documentation, and stay available for fixes and improvements.',
    render: () => (
      <Panel title="Release 1.0" badge="Live">
        <ul className="space-y-2">
          <Row state="done" label="Tested on phones, tablets, desktops" />
          <Row state="done" label="Backups and monitoring set up" />
          <Row state="done" label="Staff guide handed over" />
          <Row state="doing" label="Collecting first feedback" />
        </ul>
      </Panel>
    ),
  },
];

export default function StageSlider() {
  const [i, setI] = useState(0);
  const id = useId();
  const stage = stages[i];
  return (
    <div className="overflow-hidden rounded-[28px] bg-ink text-white">
      <div className="grid lg:grid-cols-2">
        {/* Fragment field */}
        <div className="order-1 flex min-h-[420px] items-center justify-center bg-ink-800 p-6 sm:p-10 lg:order-2 lg:min-h-[560px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="flex w-full justify-center"
            >
              {stage.render()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Clause field */}
        <div className="order-2 flex flex-col p-6 sm:p-10 lg:order-1 lg:p-14">
          <div aria-live="polite" className="min-h-[220px] lg:min-h-[260px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                <h3 className="max-w-[12ch] text-[clamp(34px,4vw,60px)]">{stage.clause}</h3>
                <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-white/75">{stage.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-auto pt-10">
            <label htmlFor={id} className="sr-only">
              Project stage
            </label>
            <input
              id={id}
              type="range"
              min={0}
              max={stages.length - 1}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              aria-valuetext={`${stage.name}: ${stage.clause}`}
              className="stage-range w-full"
              style={{ '--p': `${(i / (stages.length - 1)) * 100}%` } as React.CSSProperties}
            />
            <ul className="mt-4 grid grid-cols-4 gap-2 text-[15px]">
              {stages.map((s, k) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    aria-pressed={k === i}
                    className={`w-full rounded-md py-1 text-left transition-colors ${k === i ? 'font-semibold text-white' : 'text-white/50 hover:text-white/80'} ${k === stages.length - 1 ? 'text-right' : k > 0 ? 'text-center' : ''}`}
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
