'use client'

import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { phoneHref, whatsappHref } from '@/lib/contactLinks'
import { canonicalPath } from '@/lib/routes'
import { presentationPath } from '@/lib/presentationRoutes'
import type { ContactInformation, Header as HeaderType, SiteSetting } from '@/payload-types'

export const HeaderNav: React.FC<{
  contact: ContactInformation
  data: HeaderType
  settings: SiteSetting
}> = ({ contact, data, settings }) => {
  const actionHref = (
    action: NonNullable<HeaderType['conversionActions']>[number]['action'],
  ) => {
    if (action === 'quotation') return '/contact'
    if (action === 'phone') return phoneHref(contact.phoneE164)
    if (!contact.whatsappAvailable) return null
    return whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
  }

  return (
    <nav className="flex gap-3 items-center" aria-label="Primary navigation">
      {(data.navigation ?? []).map((item) => (
        <Link href={presentationPath(item.destination)} key={item.id ?? item.label}>
          {item.label}
        </Link>
      ))}
      {(data.serviceLinks ?? []).map((item) => {
        if (typeof item.service === 'number') return null
        return (
          <Link href={canonicalPath('service', item.service.slug)} key={item.id ?? item.service.id}>
            {item.label || item.service.title}
          </Link>
        )
      })}
      {(data.conversionActions ?? []).map((item) => {
        const href = actionHref(item.action)
        return href ? (
          <Link href={href} key={item.id ?? `${item.action}-${item.label}`}>
            {item.label}
          </Link>
        ) : null
      })}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
