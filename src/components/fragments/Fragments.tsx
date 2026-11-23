import { Check, ChevronRight, Circle, Loader2, Mail, Sparkles, Database, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

/*
 * Interface fragments drawn in HTML. They illustrate the kind of software
 * PYMLABS builds; none of them depicts a specific client's system.
 */

const panel = 'rounded-[14px] bg-white text-ink ring-1 ring-ink/[0.06]';

/* ------------------------------------------------------------------ */
/* Hero: a build that keeps moving from idea to live, inline in the h1 */
/* ------------------------------------------------------------------ */
const STAGES = ['Idea', 'Design', 'Build', 'Live'] as const;

export function BuildStrip() {
  const [i, setI] = useState(2);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % STAGES.length), 1800);
    return () => window.clearInterval(t);
  }, []);
  const live = STAGES[i] === 'Live';
  return (
    <span
      data-ui=""
      aria-hidden="true"
      className="relative mx-[0.06em] inline-flex h-[0.74em] w-[2.3em] flex-col justify-between overflow-hidden rounded-[0.16em] bg-ink-700 p-[0.09em] align-top font-sans tracking-normal"
      style={{ marginTop: '0.16em' }}
    >
      {/* Labels are drawn with CSS (data-t) so they never become part of the heading's text. */}
      <span className="flex items-center justify-between text-[max(11px,0.11em)] font-medium leading-none text-white/80">
        <span className="flex items-center gap-[0.4em]">
          <span className={`pulse-dot inline-block h-[0.6em] w-[0.6em] rounded-full ${live ? 'bg-emerald-400' : 'bg-electric-400'}`} />
          <span key={STAGES[i]} className="ui-t fade-up" data-t={live ? 'Deployed' : `${STAGES[i]} in progress`} />
        </span>
        <span className="ui-t text-white/50" data-t="v1.0" />
      </span>
      <span className="flex gap-[0.05em]">
        {STAGES.map((s, k) => (
          <span key={s} className="relative h-[0.07em] min-h-[4px] flex-1 overflow-hidden rounded-full bg-white/10">
            {k < i && <span className="absolute inset-0 bg-white/70" />}
            {k === i && (
              <span
                key={`p${i}`}
                className="absolute inset-0 origin-left rounded-full"
                style={{ background: 'var(--brand)', animation: 'strip-progress 1.7s linear both' }}
              />
            )}
          </span>
        ))}
      </span>
      <span className="flex justify-between text-[max(10px,0.09em)] leading-none text-white/45">
        {STAGES.map((s, k) => (
          <span key={s} className={`ui-t ${k === i ? 'text-white' : ''}`} data-t={s} />
        ))}
      </span>
    </span>
  );
}

/* ---------------------------- Website ---------------------------- */
export function SiteFragment() {
  return (
    <div data-ui="" className={`${panel} overflow-hidden`} aria-hidden="true">
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="text-[13px] font-bold tracking-tight">Your Business</span>
        <span className="flex gap-3 text-[11px] text-grey-500">
          <span>Work</span>
          <span>Studio</span>
          <span className="text-ink">Contact</span>
        </span>
      </div>
      <div className="grid grid-cols-5 gap-3 bg-paper-50 p-5">
        <div className="col-span-3">
          <p className="font-display text-[22px] font-semibold leading-[1.02] tracking-[-0.03em]">Your offer, clearly explained.</p>
          <p className="mt-2 text-[11px] leading-snug text-grey-500">One line on what you do and for whom.</p>
          <span className="mt-3 inline-flex rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium text-white">Get in touch</span>
        </div>
        <div className="col-span-2 rounded-lg bg-[#d9cbb8]" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        <div className="h-12 rounded-md bg-[#c9d3df]" />
        <div className="h-12 rounded-md bg-[#e3ddd3]" />
        <div className="h-12 rounded-md bg-[#cfd8cb]" />
      </div>
    </div>
  );
}

/* ---------------------------- Admin table ---------------------------- */
const orders = [
  { id: 'ORD-1042', name: 'R. Kumar', items: 3, total: 2450, status: 'Packed' },
  { id: 'ORD-1043', name: 'S. Priya', items: 1, total: 899, status: 'New' },
  { id: 'ORD-1044', name: 'M. Arun', items: 5, total: 4120, status: 'Shipped' },
  { id: 'ORD-1045', name: 'K. Divya', items: 2, total: 1530, status: 'New' },
];
const statusTone: Record<string, string> = {
  New: 'bg-electric/10 text-electric-600',
  Packed: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-emerald-100 text-emerald-800',
};

export function AdminFragment() {
  const total = orders.reduce((s, o) => s + o.total, 0);
  return (
    <div data-ui="" className={`${panel} overflow-hidden`} aria-hidden="true">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[13px] font-semibold">Orders today</span>
        <span className="text-[12px] tabular-nums text-grey-500">₹{total.toLocaleString('en-IN')} · {orders.length} orders</span>
      </div>
      <table className="w-full text-left text-[12px]">
        <thead className="bg-paper-50 text-grey-500">
          <tr>
            <th className="px-4 py-2 font-medium">Order</th>
            <th className="px-2 py-2 font-medium">Customer</th>
            <th className="px-2 py-2 text-right font-medium">Total</th>
            <th className="px-4 py-2 text-right font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} className={i === 1 ? 'bg-electric/[0.05]' : ''}>
              <td className="px-4 py-2.5 font-medium tabular-nums">{o.id}</td>
              <td className="px-2 py-2.5 text-grey-600">{o.name}</td>
              <td className="px-2 py-2.5 text-right tabular-nums">₹{o.total.toLocaleString('en-IN')}</td>
              <td className="px-4 py-2.5 text-right">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone[o.status]}`}>{o.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------------------- Automation ---------------------------- */
const steps = [
  { icon: Mail, title: 'New enquiry received', meta: 'Email · 09:14' },
  { icon: Sparkles, title: 'Summarise and tag', meta: 'AI model · “Web app, urgent”' },
  { icon: Database, title: 'Create lead record', meta: 'CRM · Lead #318' },
  { icon: Bell, title: 'Notify sales team', meta: 'Waiting for review' },
];

export function WorkflowFragment() {
  return (
    <div data-ui="" className={`${panel} p-4`} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">Enquiry triage</span>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">Active</span>
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = i < 3;
          return (
            <li key={s.title} className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 ${i === 3 ? 'bg-electric/[0.06]' : 'bg-paper-50'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${done ? 'bg-ink text-white' : 'bg-electric text-white'}`}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium">{s.title}</span>
                <span className="block truncate text-[11px] text-grey-500">{s.meta}</span>
              </span>
              {done ? <Check className="h-4 w-4 text-emerald-600" /> : <Loader2 className="h-4 w-4 animate-spin text-electric" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ---------------------------- Code ---------------------------- */
export function CodeFragment() {
  return (
    <div data-ui="" className="overflow-hidden rounded-[14px] bg-ink-800 text-[12.5px] leading-[1.7] text-white/85" aria-hidden="true">
      <div className="flex items-center gap-2 bg-ink-700/60 px-4 py-2.5 text-[12px] text-white/60">
        <span className="text-white">invoices.ts</span>
        <span>· api/routes</span>
      </div>
      <pre className="overflow-hidden px-4 py-3.5">
        <code>
          <span className="text-violet-400">export async function</span> <span className="text-electric-400">createInvoice</span>(order: Order) {'{\n'}
          {'  '}<span className="text-violet-400">const</span> lines = order.items.map(toLine);{'\n'}
          {'  '}<span className="text-violet-400">const</span> total = sum(lines, (l) =&gt; l.amount);{'\n'}
          {'  '}<span className="text-violet-400">await</span> db.invoice.insert({'{'} orderId: order.id, total {'}'});{'\n'}
          {'  '}<span className="text-violet-400">return</span> {'{'} total, lines {'}'};{'\n'}
          {'}'}
        </code>
      </pre>
      <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 text-[12px] text-emerald-300">
        <Check className="h-3.5 w-3.5" /> 12 tests passed
      </div>
    </div>
  );
}

/* ---------------------------- Consulting ---------------------------- */
const options = [
  { name: 'Website', fit: 'Explain and get enquiries', cost: 'Lowest', pick: false },
  { name: 'Web app', fit: 'Staff and customers log in', cost: 'Medium', pick: true },
  { name: 'Mobile app', fit: 'Daily use, offline, device features', cost: 'Highest', pick: false },
];
export function ConsultFragment() {
  return (
    <div data-ui="" className={`${panel} p-4`} aria-hidden="true">
      <span className="text-[13px] font-semibold">Which should we build first?</span>
      <ul className="mt-3 space-y-2">
        {options.map((o) => (
          <li
            key={o.name}
            className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 ${o.pick ? 'bg-ink text-white' : 'bg-paper-50'}`}
          >
            {o.pick ? <Check className="h-4 w-4 text-electric-400" /> : <Circle className="h-4 w-4 text-grey-300" />}
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-medium">{o.name}</span>
              <span className={`block text-[11px] ${o.pick ? 'text-white/60' : 'text-grey-500'}`}>{o.fit}</span>
            </span>
            <span className={`text-[11px] ${o.pick ? 'text-white/70' : 'text-grey-500'}`}>{o.cost}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------- Maintenance ---------------------------- */
const changes = [
  { v: '1.4.2', note: 'Fix: booking form timezone', done: true },
  { v: '1.4.1', note: 'Security: framework update', done: true },
  { v: '1.4.0', note: 'Faster image loading', done: true },
];
export function ChangelogFragment() {
  return (
    <div data-ui="" className={`${panel} p-4`} aria-hidden="true">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold">Release history</span>
        <span className="flex items-center gap-1 text-[11px] text-grey-500">
          All releases <ChevronRight className="h-3 w-3" />
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {changes.map((c) => (
          <li key={c.v} className="flex items-center gap-3 rounded-[10px] bg-paper-50 px-3 py-2.5">
            <span className="w-11 text-[12px] font-semibold tabular-nums">{c.v}</span>
            <span className="flex-1 text-[12px] text-grey-600">{c.note}</span>
            <Check className="h-4 w-4 text-emerald-600" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const fragmentFor: Record<string, () => JSX.Element> = {
  'website-development': SiteFragment,
  'web-application-development': AdminFragment,
  'custom-software-development': CodeFragment,
  'ai-automation': WorkflowFragment,
  'it-consulting': ConsultFragment,
  'maintenance-support': ChangelogFragment,
};
