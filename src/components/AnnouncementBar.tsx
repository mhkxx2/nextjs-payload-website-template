import Link from 'next/link'
import React from 'react'

export interface AnnouncementBarProps {
  enabled?: boolean
  badgeText?: string | null
  message?: string | null
  linkText?: string | null
  linkUrl?: string | null
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  enabled = true,
  badgeText,
  message,
  linkText,
  linkUrl,
}) => {
  if (!enabled || (!message && !badgeText)) {
    return null
  }

  return (
    <aside
      aria-label="Announcement"
      className="bg-charcoal text-ivory text-xs sm:text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-2 border-b border-gold-muted/30"
    >
      {badgeText ? (
        <span className="bg-gold-muted text-charcoal font-semibold px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase tracking-wider">
          {badgeText}
        </span>
      ) : null}
      {message ? <span>{message}</span> : null}
      {linkUrl && linkText ? (
        <Link
          href={linkUrl}
          className="underline font-medium text-gold-muted hover:text-ivory transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1"
        >
          {linkText}
        </Link>
      ) : null}
    </aside>
  )
}
