export type Solution = {
  id: string;
  audience: string;
  heading: string;
  situation: string;
  howWeHelp: string[];
  typicalStart: string;
  services: string[];
};

export const solutions: Solution[] = [
  {
    id: 'startups',
    audience: 'Startups',
    heading: 'Get a first version in front of users',
    situation:
      'You have an idea and limited runway. The priority is learning quickly what users actually want, without building things that will have to be thrown away.',
    howWeHelp: [
      'Scope a minimum viable product around the one problem that matters most',
      'Choose a technology stack that can grow beyond the first version',
      'Build a launch website alongside the product',
      'Plan the next iterations from real feedback',
    ],
    typicalStart: 'A short discovery call and a written scope for a first release.',
    services: ['web-application-development', 'website-development', 'it-consulting'],
  },
  {
    id: 'small-businesses',
    audience: 'Small businesses',
    heading: 'Look professional and save hours every week',
    situation:
      'You run the business and the technology has to fit around you. You need a credible website and simpler ways to handle bookings, orders, records or enquiries.',
    howWeHelp: [
      'A responsive website that explains what you offer and how to reach you',
      'Simple tools for bookings, orders, invoices or customer records',
      'Automating routine messages and reports',
      'Ongoing support so you are not left on your own after launch',
    ],
    typicalStart: 'A review of how you work today and where the time goes.',
    services: ['website-development', 'custom-software-development', 'maintenance-support'],
  },
  {
    id: 'growing-businesses',
    audience: 'Growing businesses',
    heading: 'Replace the spreadsheets you have outgrown',
    situation:
      'What worked for five people does not work for twenty. Data lives in too many places, and manual steps cause delays and mistakes.',
    howWeHelp: [
      'Custom web applications and dashboards for your operations',
      'Integrations between the tools your teams already use',
      'AI and automation for repetitive, high-volume tasks',
      'Architecture that can handle more users and more data',
    ],
    typicalStart: 'Mapping one core workflow end to end before writing any code.',
    services: ['web-application-development', 'ai-automation', 'custom-software-development'],
  },
  {
    id: 'individuals',
    audience: 'Individuals',
    heading: 'Bring a personal project to life',
    situation:
      'You are a professional, creator or independent builder with a specific idea: a portfolio, a personal brand site or a small tool you wish existed.',
    howWeHelp: [
      'Portfolio and personal websites that present your work well',
      'Small custom tools and utilities',
      'Technical guidance if you want to build part of it yourself',
      'Straightforward pricing agreed before work begins',
    ],
    typicalStart: 'A conversation about what you want visitors or users to do.',
    services: ['website-development', 'custom-software-development', 'it-consulting'],
  },
  {
    id: 'organisations',
    audience: 'Organisations',
    heading: 'Modernise systems with care',
    situation:
      'Institutions, associations and teams often depend on systems that are hard to change. Any update has to respect existing processes, data and people.',
    howWeHelp: [
      'Assessment of current systems and a phased modernisation plan',
      'Internal portals, record systems and administrative tools',
      'Data migration from legacy tools and spreadsheets',
      'Documentation and handover so your team stays in control',
    ],
    typicalStart: 'A consulting engagement to agree priorities and constraints.',
    services: ['it-consulting', 'web-application-development', 'maintenance-support'],
  },
];
