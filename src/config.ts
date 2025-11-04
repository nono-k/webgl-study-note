import type { HeaderLink, SiteConfig } from '@/types/config';

export const siteConfig: SiteConfig = {
  siteTitle: 'My Site',
  siteDesc: 'My Site Description',
  siteUrl: 'https://example.com',
  siteType: 'website',
  siteLocale: 'ja_JP',
  siteIcon: '/favicon.svg',
  siteImg: '/ogp.png',
};

export const headerLink: HeaderLink[] = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'Contact', url: '/contact' },
];
