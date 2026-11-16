'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

import { Logo } from '@/components/Logo/Logo'
import type { ContactInformation, Header, SiteSetting } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  contact: ContactInformation
  data: Header
  settings: SiteSetting
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ contact, data, settings }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <header
      className="container relative z-20"
      {...(headerTheme ? { 'data-theme': headerTheme } : {})}
    >
      <div className="py-8 flex justify-between">
        <Link href="/">
          <Logo
            brandName={settings?.brandName}
            className="invert dark:invert-0"
            loading="eager"
            logo={settings?.logo}
            priority="high"
          />
        </Link>
        <HeaderNav contact={contact} data={data} settings={settings} />
      </div>
    </header>
  )
}
