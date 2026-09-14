import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { HeaderClient } from './Component.client'

export async function Header() {
  const [headerData, contact, settings] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedGlobal('contact-information', 0)(),
    getCachedGlobal('site-settings', 0)(),
  ])

  return <HeaderClient contact={contact} data={headerData} settings={settings} />
}
