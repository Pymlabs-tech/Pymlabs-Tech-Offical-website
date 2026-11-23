import { site, whatsappUrl } from '../config/site';
import WhatsAppIcon from './WhatsAppIcon';
import { trackWhatsApp } from '../lib/track';

/** Floating "chat on WhatsApp" button, bottom-right on every page. */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      onClick={() => trackWhatsApp('floating')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${site.brand} on WhatsApp (opens in a new tab)`}
      className="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-40 inline-flex h-14 items-center gap-2.5 rounded-full bg-[#25D366] pl-4 pr-4 text-[#0b2e17] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] active:translate-y-0 print:hidden md:right-8 md:bottom-8 md:pr-5"
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="hidden text-[15px] font-semibold md:inline">Chat on WhatsApp</span>
    </a>
  );
}
