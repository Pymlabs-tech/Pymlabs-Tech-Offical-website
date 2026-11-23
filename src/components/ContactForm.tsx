import { AlertCircle, CheckCircle2, Copy, Loader2, Mail } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { site } from '../config/site';
import { services } from '../data/services';
import { Button } from './Button';

type Values = {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  description: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'mail-opened';

const budgets = [
  'Under ₹25,000',
  '₹25,000 – ₹1,00,000',
  '₹1,00,000 – ₹5,00,000',
  'Above ₹5,00,000',
  'Not sure yet',
];
const MAX_DESC = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const empty: Values = { name: '', email: '', company: '', service: '', budget: '', description: '' };

function validate(v: Values): Errors {
  const e: Errors = {};
  const name = v.name.trim();
  if (name.length < 2) e.name = 'Please enter your full name.';
  else if (name.length > 80) e.name = 'Please keep your name under 80 characters.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address, for example name@company.com.';
  if (v.company.length > 120) e.company = 'Please keep the company name under 120 characters.';
  if (!v.service) e.service = 'Please choose the service you need, or “Not sure yet”.';
  const desc = v.description.trim();
  if (desc.length < 20) e.description = 'Please describe your project in at least 20 characters.';
  else if (desc.length > MAX_DESC) e.description = `Please keep the description under ${MAX_DESC} characters.`;
  return e;
}

const serviceLabel = (id: string) => (id === 'not-sure' ? 'Not sure yet' : services.find((s) => s.id === id)?.title ?? id);

/** Strip control characters that could break an email header or body. */
const clean = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();

function enquiryText(v: Values) {
  return [
    `Name: ${clean(v.name)}`,
    `Email: ${clean(v.email)}`,
    v.company ? `Company: ${clean(v.company)}` : '',
    `Service: ${serviceLabel(v.service)}`,
    v.budget ? `Budget: ${v.budget}` : '',
    '',
    'Project description:',
    clean(v.description),
  ]
    .filter((l, i) => l !== '' || i === 5)
    .join('\n');
}

export default function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const [trap, setTrap] = useState('');
  const startedAt = useRef<number>(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const emailjsReady = Boolean(site.emailjs.serviceId && site.emailjs.templateId && site.emailjs.publicKey);
  const hasEndpoint = emailjsReady || site.formEndpoint.length > 0;

  useEffect(() => {
    startedAt.current = Date.now();
    // Pre-select a service from ?service=… links on other pages.
    const q = new URLSearchParams(window.location.search).get('service');
    if (q && services.some((s) => s.id === q)) setValues((v) => ({ ...v, service: q }));
  }, []);

  useEffect(() => {
    if (status !== 'idle' && status !== 'sending') statusRef.current?.focus();
  }, [status]);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
    if (status === 'error' || status === 'mail-opened') setStatus('idle');
  };
  const blur = (k: keyof Values) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, company: true, service: true, budget: true, description: true });
    const firstError = (Object.keys(errs) as (keyof Values)[])[0];
    if (firstError) {
      document.getElementById(`${uid}-${firstError}`)?.focus();
      return;
    }
    // Spam checks: hidden field filled, or submitted faster than a person could type.
    if (trap || Date.now() - startedAt.current < 2500) {
      setStatus('error');
      return;
    }

    if (!hasEndpoint) {
      const subject = `Project enquiry: ${serviceLabel(values.service)} — ${clean(values.name)}`;
      const href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText(values))}`;
      window.location.href = href;
      setStatus('mail-opened');
      return;
    }

    setStatus('sending');
    const fields = {
      name: clean(values.name),
      email: clean(values.email),
      company: clean(values.company) || 'Not given',
      service: serviceLabel(values.service),
      budget: values.budget || 'Not given',
      message: clean(values.description),
    };
    try {
      const res = emailjsReady
        ? // EmailJS REST API: https://www.emailjs.com/docs/rest-api/send/
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: site.emailjs.serviceId,
              template_id: site.emailjs.templateId,
              user_id: site.emailjs.publicKey,
              template_params: {
                from_name: fields.name,
                from_email: fields.email,
                reply_to: fields.email,
                company: fields.company,
                service: fields.service,
                budget: fields.budget,
                message: fields.message,
                title: `Project enquiry: ${fields.service} — ${fields.name}`,
                // Aliases used by EmailJS's default "Contact Us" template
                name: fields.name,
                email: fields.email,
                time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              },
            }),
          })
        : await fetch(site.formEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ...fields, _subject: `Project enquiry: ${fields.service}` }),
          });
      // Success is shown only when the service confirms delivery (HTTP 2xx).
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
      setValues(empty);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\n\n${enquiryText(values)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const field = (k: keyof Values) => ({
    id: `${uid}-${k}`,
    name: k,
    value: values[k],
    onChange: set(k),
    onBlur: blur(k),
    'aria-invalid': touched[k] && errors[k] ? true : undefined,
    'aria-describedby': touched[k] && errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const inputCls = (k: keyof Values) =>
    `mt-2 block w-full rounded-xl bg-paper-50 px-4 py-3.5 text-[17px] text-ink ring-1 transition-shadow placeholder:text-grey-400 focus:bg-white focus:outline-none focus:ring-2 ${
      touched[k] && errors[k] ? 'ring-red-500 focus:ring-red-500' : 'ring-ink/10 focus:ring-electric'
    }`;

  const Err = ({ k }: { k: keyof Values }) =>
    touched[k] && errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-2 flex items-start gap-1.5 text-[14px] text-red-600">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[k]}
      </p>
    ) : null;

  if (status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-[24px] bg-paper-50 p-8 outline-none sm:p-10">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h2 className="mt-6 text-[32px] tracking-[-0.035em]">Thank you. Your enquiry has been sent.</h2>
        <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed">
          We have received your message and will reply to the email address you gave. If it is urgent, you can also write
          to <a className="font-medium text-electric-600 underline" href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <Button variant="ghost-dark" className="mt-8" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${uid}-how`} className="rounded-[24px] bg-white p-6 ring-1 ring-ink/[0.06] sm:p-10">
      <h2 className="text-[clamp(28px,3vw,40px)] tracking-[-0.035em]">Tell us about your project</h2>
      <p id={`${uid}-how`} className="mt-3 text-[16px] leading-relaxed text-grey-600">
        {hasEndpoint
          ? 'Fields marked * are required. Your enquiry is sent securely to the PYMLABS team.'
          : `Fields marked * are required. Pressing the button opens your email app with this enquiry written out, addressed to ${site.email}. It is sent when you press Send there; nothing is stored on this website.`}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className="text-[15px] font-medium">
            Full name *
          </label>
          <input {...field('name')} type="text" autoComplete="name" required maxLength={80} className={inputCls('name')} />
          <Err k="name" />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="text-[15px] font-medium">
            Email address *
          </label>
          <input
            {...field('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={120}
            className={inputCls('email')}
          />
          <Err k="email" />
        </div>
        <div>
          <label htmlFor={`${uid}-company`} className="text-[15px] font-medium">
            Company name <span className="font-normal text-grey-500">(optional)</span>
          </label>
          <input {...field('company')} type="text" autoComplete="organization" maxLength={120} className={inputCls('company')} />
          <Err k="company" />
        </div>
        <div>
          <label htmlFor={`${uid}-service`} className="text-[15px] font-medium">
            Service required *
          </label>
          <select {...field('service')} required className={inputCls("service")}>
            <option value="" disabled>
              Choose a service
            </option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
            <option value="not-sure">Not sure yet</option>
          </select>
          <Err k="service" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-budget`} className="text-[15px] font-medium">
            Budget range <span className="font-normal text-grey-500">(optional)</span>
          </label>
          <select {...field('budget')} className={inputCls("budget")}>
            <option value="">Prefer not to say</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${uid}-description`} className="text-[15px] font-medium">
            Project description *
          </label>
          <textarea
            {...field('description')}
            rows={6}
            required
            maxLength={MAX_DESC}
            placeholder="What do you want to build, who is it for, and is there a deadline?"
            className={`${inputCls('description')} resize-y`}
          />
          <div className="flex items-start justify-between gap-4">
            <Err k="description" />
            <p className="ml-auto mt-2 text-[13px] tabular-nums text-grey-500">
              {values.description.length}/{MAX_DESC}
            </p>
          </div>
        </div>
      </div>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input
          id={`${uid}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === 'sending'} className="sm:min-w-[240px]">
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : hasEndpoint ? (
            'Send enquiry'
          ) : (
            <>
              <Mail className="h-4 w-4" aria-hidden="true" /> Write the email
            </>
          )}
        </Button>
        <p className="text-[14px] text-grey-600">
          Or email{' '}
          <a href={`mailto:${site.email}`} className="font-medium text-electric-600 underline-offset-4 hover:underline">
            {site.email}
          </a>
        </p>
      </div>

      <div aria-live="polite">
        {status === 'mail-opened' && (
          <div ref={statusRef} tabIndex={-1} className="mt-8 rounded-2xl bg-electric/[0.07] p-5 text-[16px] leading-relaxed outline-none">
            <p className="font-semibold">Your email app should now be open with the enquiry filled in.</p>
            <p className="mt-2">
              It has <strong>not been sent yet</strong>: press Send in your email app to deliver it. If no email app opened,
              copy the enquiry and send it to {site.email} from any email account.
            </p>
            <Button type="button" variant="ghost-dark" className="mt-4" onClick={copy}>
              <Copy className="h-4 w-4" aria-hidden="true" /> {copied ? 'Copied' : 'Copy enquiry'}
            </Button>
          </div>
        )}
        {status === 'error' && (
          <div ref={statusRef} tabIndex={-1} role="alert" className="mt-8 rounded-2xl bg-red-50 p-5 text-[16px] leading-relaxed text-red-800 outline-none">
            <p className="font-semibold">Your enquiry could not be sent.</p>
            <p className="mt-2">
              Please try again in a moment, or email us directly at{' '}
              <a
                className="font-medium underline"
                href={`mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}&body=${encodeURIComponent(enquiryText(values))}`}
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </form>
  );
}
