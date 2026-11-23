import { Clock, Globe2, Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { site, whatsappUrl } from '../config/site';
import WhatsAppIcon from '../components/WhatsAppIcon';

const next = [
  { title: 'We read your enquiry', text: 'and reply by email, usually with a few questions about goals, users and timing.' },
  { title: 'We talk it through', text: 'on a call or by email, whichever suits you, until the scope is clear.' },
  { title: 'You receive a proposal', text: 'with the scope, approach, timeline and cost written down before any work begins.' },
];

export default function Contact() {
  return (
    <>
      <PageHero
        lines={['Start a project.']}
        intro={
          <p>
            Tell us what you want to build. The more you share about the problem, the people it is for and any deadlines,
            the more useful our first reply will be.
          </p>
        }
      />

      <section aria-label="Enquiry" className="section bg-paper-50">
        <div className="frame grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="space-y-12 lg:col-span-4 lg:col-start-9" aria-label="Other ways to reach us">
            <Reveal>
              <h2 className="text-[28px] tracking-[-0.03em]">Email</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-flex items-center gap-3 break-all text-[19px] font-medium text-electric-600 hover:underline"
              >
                <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                {site.email}
              </a>
              <p className="mt-3 text-[16px] leading-relaxed text-grey-600">
                For projects, partnerships and general questions.
              </p>
            </Reveal>
            <Reveal delay={40}>
              <h2 className="text-[28px] tracking-[-0.03em]">WhatsApp</h2>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 text-[19px] font-medium text-electric-600 hover:underline"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0 text-[#1fa855]" />
                {site.whatsapp.display}
              </a>
              <p className="mt-3 text-[16px] leading-relaxed text-grey-600">
                Message us for quick questions. Opens a chat on WhatsApp.
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="text-[28px] tracking-[-0.03em]">Where we work</h2>
              <p className="mt-4 flex gap-3 text-[17px] leading-relaxed">
                <Globe2 className="mt-1 h-5 w-5 shrink-0 text-grey-500" aria-hidden="true" />
                Puducherry, Tamil Nadu, across India and internationally. Projects are delivered remotely.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <h2 className="flex items-center gap-3 text-[28px] tracking-[-0.03em]">
                <Clock className="h-6 w-6 text-grey-500" aria-hidden="true" />
                What happens next
              </h2>
              <ol className="mt-6 space-y-5">
                {next.map((n) => (
                  <li key={n.title} className="text-[17px] leading-relaxed">
                    <span className="font-semibold">{n.title}</span> {n.text}
                  </li>
                ))}
              </ol>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
