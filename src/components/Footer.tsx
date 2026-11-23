import { ArrowUpRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { site, whatsappUrl } from '../config/site';
import WhatsAppIcon from './WhatsAppIcon';
import { legalNav, mainNav } from '../data/nav';
import { services } from '../data/services';
import { ButtonLink } from './Button';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="frame pt-24 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="full" />
            <p className="mt-6 max-w-[38ch] text-[17px] leading-relaxed text-white/75">
              PYMLABS TECHNOLOGY designs and builds websites, web applications, custom software and AI automation for
              individuals, startups and businesses.
            </p>
            <p className="mt-8 max-w-[16ch] font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] md:text-[44px]">
              Tell us what you&rsquo;re building.
            </p>
            <ButtonLink to="/contact/" variant="light" arrow className="mt-8">
              Start a Project
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="font-sans text-[15px] font-semibold tracking-normal text-white">Company</h2>
              <ul className="mt-5 space-y-3">
                {mainNav.map((n) => (
                  <li key={n.to}>
                    <Link to={n.to} className="link-underline text-[16px] text-white/70 hover:text-white">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-[15px] font-semibold tracking-normal text-white">Services</h2>
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link to={`/services/#${s.id}`} className="link-underline text-[16px] text-white/70 hover:text-white">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className="font-sans text-[15px] font-semibold tracking-normal text-white">Contact</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-5 inline-flex items-center gap-2 break-all text-[16px] text-white/70 hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {site.email}
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${site.whatsapp.display} (opens in a new tab)`}
                className="mt-3 flex items-center gap-2 whitespace-nowrap text-[16px] text-white/70 hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                {site.whatsapp.display}
              </a>
              {site.social.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {site.social.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[16px] text-white/70 hover:text-white"
                      >
                        {s.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mb-20 mt-24 flex flex-col gap-4 text-[14px] text-white/55 md:mb-16 md:flex-row md:items-end md:justify-between">
          <p suppressHydrationWarning>&copy; {year} PYMLABS TECHNOLOGY. All rights reserved.</p>
          <ul className="flex gap-6">
            {legalNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="h-12 md:h-16" />
    </footer>
  );
}
