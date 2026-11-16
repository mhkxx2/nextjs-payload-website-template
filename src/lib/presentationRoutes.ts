const presentationPaths = {
  about: '/about-us',
  areas: '/#areas-we-serve',
  blog: '/blog',
  contact: '/contact',
  home: '/',
  privacy: '/privacy',
  portfolio: '/portfolio',
  projects: '/projects',
  services: '/services',
  terms: '/terms',
} as const

export type PresentationDestination = keyof typeof presentationPaths

export const presentationPath = (destination: PresentationDestination): string =>
  presentationPaths[destination]
