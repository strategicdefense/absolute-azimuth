import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
    },      
    {
      text: 'Industries',
      links: [
        {
          text: 'Insurers',
          href: getPermalink('/insurers'),
        },
        {
          text: 'MSSP',
          href: getPermalink('/mssp'),
        },
        {
          text: 'Venture Capital',
          href: getPermalink('/vc'),
        },
      ],
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    { 
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  actions: [{ text: 'Contact', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
      {
      title: '',       
      },
      {
      title: '',       
      },
      {
      title: 'Services',
      links: [
        { text: 'Penetration Testing', href: '/services/network' },
        { text: 'Application Security', href: '/services/web-app' },
        { text: 'Cyber Consulting', href: '/services/cyber-consulting' },
        { text: 'AI/LLM', href: '/services/ai-llm' },
        { text: 'Cloud', href: '/services/cloud' },
        { text: 'All Services', href: '/services' },
      ],
      },    
   {
      title: 'Company',
      links: [
        { text: 'About', href: '/about' },
        { text: 'Blog', href: '/blog' },
        { text: 'Contact', href: '/contact' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Linkedin', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/strategic-defense/' },
  ],
  footNote: `
    Strategic Defense · All rights reserved.
  `,
};
