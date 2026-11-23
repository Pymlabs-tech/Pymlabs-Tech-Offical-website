import type { LucideIcon } from 'lucide-react';
import { AppWindow, Bot, Compass, Globe, LifeBuoy, Workflow } from 'lucide-react';

export type Service = {
  id: string;
  title: string;
  short: string;
  icon: LucideIcon;
  summary: string;
  offerings: string[];
  benefits: string[];
  useCases: string[];
};

export const services: Service[] = [
  {
    id: 'website-development',
    title: 'Website Development',
    short: 'Fast, responsive websites that explain your business clearly.',
    icon: Globe,
    summary:
      'A website is often the first conversation a customer has with you. We design and build sites that load quickly, read well on every screen and make the next step obvious, whether that is a call, an enquiry or a booking.',
    offerings: ['Business websites', 'Landing pages', 'Portfolio websites', 'Responsive websites'],
    benefits: [
      'Layouts built for phones first, then tablets and desktops',
      'Clean, search-friendly structure with proper page titles and metadata',
      'Content you can update, on hosting you choose',
    ],
    useCases: [
      'A new business that needs a credible online presence',
      'A product or campaign that needs a focused landing page',
      'A professional who wants their work presented properly',
    ],
  },
  {
    id: 'web-application-development',
    title: 'Web Application Development',
    short: 'Dashboards, admin panels and platforms that run in the browser.',
    icon: AppWindow,
    summary:
      'When a spreadsheet or a shared inbox stops being enough, a web application gives your team one place to work. We build browser-based tools with sign-in, roles, data and reporting shaped around how you actually operate.',
    offerings: ['Custom dashboards', 'Admin panels', 'Business management systems', 'Web platforms'],
    benefits: [
      'Works on any device with a browser, with nothing to install',
      'Role-based access so each person sees what they need',
      'Structured data instead of scattered files',
    ],
    useCases: [
      'Tracking orders, bookings or inventory in one system',
      'An admin panel for managing a website or mobile app',
      'A customer or partner portal',
    ],
  },
  {
    id: 'custom-software-development',
    title: 'Custom Software Development',
    short: 'Software built around your workflow, not the other way round.',
    icon: Workflow,
    summary:
      'Off-the-shelf software makes you adapt to it. Custom software adapts to you. We map the way work moves through your business and build tools, integrations and database-driven applications that fit it.',
    offerings: ['Tailored software', 'Workflow solutions', 'API integrations', 'Database-driven applications'],
    benefits: [
      'Built for your process, so there is less manual work around it',
      'Connects the tools you already use through their APIs',
      'You own the requirements, the roadmap and the result',
    ],
    useCases: [
      'Replacing a manual, error-prone process with a reliable tool',
      'Connecting a payment gateway, CRM or messaging service to your system',
      'Moving business records into a proper database',
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI & Automation',
    short: 'Practical AI and automation that removes repetitive work.',
    icon: Bot,
    summary:
      'AI is useful when it is pointed at a specific, repetitive job. We identify the tasks that slow your team down and build workflows that handle them, using automation tools and AI model APIs where they genuinely help and plain code where they do not.',
    offerings: ['AI-powered workflows', 'Business process automation', 'API-based AI integrations', 'Intelligent digital tools'],
    benefits: [
      'Fewer repetitive tasks done by hand',
      'Human review kept in the loop where decisions matter',
      'Honest advice on where AI fits and where it does not',
    ],
    useCases: [
      'Sorting, summarising or drafting replies to incoming enquiries',
      'Extracting information from documents into structured records',
      'Scheduled reports and notifications that run on their own',
    ],
  },
  {
    id: 'it-consulting',
    title: 'IT Consulting',
    short: 'Clear technical guidance before you spend on the wrong thing.',
    icon: Compass,
    summary:
      'Choosing a technology, a hosting setup or an architecture is easier with someone who builds software every day. We help you understand the options, the trade-offs and the likely costs before you commit.',
    offerings: ['Technology recommendations', 'Software architecture', 'Digital transformation', 'Technical guidance'],
    benefits: [
      'Decisions explained in plain language',
      'Recommendations based on your budget and team, not trends',
      'A written plan you can act on with us or anyone else',
    ],
    useCases: [
      'Deciding between a website, a web app or a mobile app',
      'Planning how to move from paper or spreadsheets to software',
      'Reviewing an existing system before extending it',
    ],
  },
  {
    id: 'maintenance-support',
    title: 'Maintenance & Support',
    short: 'Keeping your software healthy after launch.',
    icon: LifeBuoy,
    summary:
      'Software needs care after it goes live. We fix bugs, keep dependencies up to date, improve performance and make small enhancements, so the system you rely on keeps working as your needs change.',
    offerings: ['Bug fixes', 'Performance improvements', 'Security updates', 'Ongoing maintenance'],
    benefits: [
      'A clear record of what changed and why',
      'Updates tested before they reach your live site',
      'Scope and response arrangements agreed in writing up front',
    ],
    useCases: [
      'A website or app that has become slow or unreliable',
      'Outdated plugins, libraries or frameworks that need updating',
      'Small feature requests after launch',
    ],
  },
];
