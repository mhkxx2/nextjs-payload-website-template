import React from 'react'
import { Footer as ComponentFooter } from '@/components/Footer'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function Footer() {
  const [data, contact, settings, social] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('contact-information', 0)(),
    getCachedGlobal('site-settings', 1)(),
    getCachedGlobal('social-media', 0)(),
  ])
  return <ComponentFooter contact={contact} data={data} settings={settings} social={social} />
}
