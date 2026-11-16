import React from 'react'
import { Header as ComponentHeader } from '@/components/Header'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function Header() {
  const [data, contact, settings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('contact-information', 0)(),
    getCachedGlobal('site-settings', 1)(),
  ])
  return <ComponentHeader contact={contact} data={data} settings={settings} />
}
