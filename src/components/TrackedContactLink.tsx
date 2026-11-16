'use client'

import React from 'react'

import {
  pushDataLayerEvent,
  type AnalyticsParameters,
} from '@/lib/analytics'

type TrackedContactLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  analytics?: AnalyticsParameters
  eventName: 'phone_call_click' | 'whatsapp_click'
  href: string
}

export function TrackedContactLink({
  analytics = {},
  eventName,
  href,
  onClick,
  ...props
}: TrackedContactLinkProps) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        pushDataLayerEvent({ event: eventName, ...analytics, link_url: href })
        onClick?.(event)
      }}
    />
  )
}
