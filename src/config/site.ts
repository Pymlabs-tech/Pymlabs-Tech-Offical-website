/**
 * Central site configuration.
 * Values that change between environments come from Vite env variables (see .env.example).
 * Only add facts here that have been verified by PYMLABS.
 */
const rawUrl = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://pymlabs.unaux.com';

export const site = {
  name: 'PYMLABS TECHNOLOGY',
  brand: 'PYMLABS',
  url: rawUrl.replace(/\/+$/, ''),
  email: 'info.pymlabs@gmail.com',
  /** WhatsApp Business number (digits only, with country code) and the message a chat opens with. */
  whatsapp: {
    number: '919344224489',
    display: '+91 93442 24489',
    message: 'Hi PYMLABS, I would like to talk about a project.',
  },
  founder: { name: 'Sharvesh Raja', role: 'Founder & CEO' },
  tagline: 'Building Technology. Creating Possibilities.',
  description:
    'PYMLABS TECHNOLOGY builds websites, web applications, custom software and AI automation for individuals, startups and businesses in Puducherry, Tamil Nadu, across India and internationally.',
  themeColor: '#060913',
  /** Optional POST endpoint for the contact form. Empty = email-app (mailto) flow. */
  formEndpoint: ((import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || '').trim(),
  /**
   * EmailJS (https://www.emailjs.com) sends contact-form enquiries to the PYMLABS inbox.
   * These three IDs are public by design (they ship in the browser code); EmailJS protects the
   * account with its own rate limits and the allowed-domain setting in its dashboard.
   * The form uses EmailJS only when all three are set; otherwise it falls back to the mailto flow.
   */
  emailjs: {
    serviceId: ((import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) || 'service_7txywke').trim(),
    templateId: ((import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined) || 'template_go4o4a4').trim(),
    publicKey: ((import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined) || 'qhBCc-L3zbntEpAwm').trim(),
  },
  /**
   * Social profiles. Add real URLs only, e.g. { label: 'LinkedIn', href: 'https://www.linkedin.com/company/...' }.
   * Empty list = no social links are shown anywhere (footer, structured data).
   */
  social: [] as { label: string; href: string }[],
  regions: ['Puducherry', 'Tamil Nadu', 'India', 'International'],
} as const;

export const whatsappUrl = (message: string = site.whatsapp.message) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;

export const absoluteUrl = (path: string) => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;
