export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  /** Include in sitemap.xml */
  index: boolean;
  priority?: number;
};

export const routes: RouteMeta[] = [
  {
    path: '/',
    title: 'PYMLABS TECHNOLOGY — Software, Web Apps & AI Automation',
    description:
      'PYMLABS turns ideas into working software: websites, web applications, custom software, AI automation and IT consulting for startups and businesses across India.',
    index: true,
    priority: 1.0,
  },
  {
    path: '/about/',
    title: 'About PYMLABS — Mission, Values & Founder',
    description:
      'Learn how PYMLABS TECHNOLOGY works: our mission, vision, values and engineering philosophy. Founded and led by Sharvesh Raja, Founder & CEO.',
    index: true,
    priority: 0.8,
  },
  {
    path: '/services/',
    title: 'Services — Websites, Web Apps, Custom Software & AI | PYMLABS',
    description:
      'Website development, web application development, custom software, AI and automation, IT consulting, and maintenance and support from PYMLABS TECHNOLOGY.',
    index: true,
    priority: 0.9,
  },
  {
    path: '/solutions/',
    title: 'Solutions for Startups, Businesses & Individuals | PYMLABS',
    description:
      'How PYMLABS helps startups, small businesses, growing businesses, individuals and organisations plan and build the right software.',
    index: true,
    priority: 0.8,
  },
  {
    path: '/portfolio/',
    title: 'Portfolio — Projects by PYMLABS TECHNOLOGY',
    description: 'Projects and case studies from PYMLABS TECHNOLOGY, with the technologies behind each one.',
    index: true,
    priority: 0.6,
  },
  {
    path: '/contact/',
    title: 'Contact PYMLABS — Start a Project',
    description:
      'Tell PYMLABS about your project. Email info.pymlabs@gmail.com or send an enquiry through the project form.',
    index: true,
    priority: 0.9,
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | PYMLABS TECHNOLOGY',
    description: 'How the PYMLABS TECHNOLOGY website handles your information.',
    index: true,
    priority: 0.3,
  },
  {
    path: '/terms-and-conditions/',
    title: 'Terms and Conditions | PYMLABS TECHNOLOGY',
    description: 'Terms that apply to the use of the PYMLABS TECHNOLOGY website.',
    index: true,
    priority: 0.3,
  },
];

export const notFoundMeta: RouteMeta = {
  path: '/404.html',
  title: 'Page not found | PYMLABS TECHNOLOGY',
  description: 'The page you are looking for does not exist.',
  index: false,
};

export const findRoute = (pathname: string): RouteMeta => {
  const normalised = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return routes.find((r) => r.path === normalised) ?? notFoundMeta;
};
