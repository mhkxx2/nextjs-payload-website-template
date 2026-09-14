const presentationPaths = {
  about: '/about',
  blog: '/blog',
  contact: '/contact',
  home: '/',
  privacy: '/privacy-policy',
  projects: '/projects',
  services: '/services',
  terms: '/terms-and-conditions',
} as const

export type PresentationDestination = keyof typeof presentationPaths

export const presentationPath = (destination: PresentationDestination): string =>
  presentationPaths[destination]
