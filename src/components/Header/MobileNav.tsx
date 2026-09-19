'use client'

import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { FocusTrap } from '@/components/FocusTrap'
import { FIXED_SERVICE_SLUGS, canonicalPath } from '@/lib/routes'

const SERVICE_LABELS: Record<string, string> = {
  'sofa-upholstery': 'Sofa Upholstery & Re-upholstery',
  'custom-furniture': 'Custom Furniture Manufacturing',
  'custom-sofa': 'Custom Sofa Manufacturing',
  'majlis-furniture': 'Majlis Upholstery & Seating',
  'curtains-blinds': 'Curtains & Blinds Upholstery',
  'sofa-repair': 'Sofa & Cushion Repair',
  'custom-wardrobes': 'Custom Wardrobes & Joinery',
  'custom-beds-headboards': 'Headboard & Bed Upholstery',
  'office-furniture': 'Commercial & Office Upholstery',
}

export interface MobileNavProps {
  contactPhone?: string | null
  contactWhatsApp?: string | null
}

export const MobileNav: React.FC<MobileNavProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsOpen(false)
    if (triggerRef.current) {
      triggerRef.current.focus()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className="p-2 text-charcoal hover:text-gold-muted focus:outline-none focus:ring-2 focus:ring-gold-muted rounded-md"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen ? (
        <FocusTrap active={isOpen} onEscape={closeMenu} className="fixed inset-0 z-50 bg-charcoal/95 text-ivory flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-lg font-bold tracking-wider uppercase text-gold-muted">
              Al Rukn Navigation
            </span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="p-2 text-ivory hover:text-gold-muted focus:outline-none focus:ring-2 focus:ring-gold-muted rounded-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile Navigation" className="flex flex-col gap-6 text-base font-medium">
            <Link href="/" onClick={closeMenu} className="hover:text-gold-muted transition-colors py-1">
              Home
            </Link>

            <div className="flex flex-col gap-2 border-y border-gold-muted/20 py-4 my-2">
              <span className="text-xs uppercase tracking-widest text-gold-muted font-semibold mb-2">
                Our Services
              </span>
              {FIXED_SERVICE_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={canonicalPath('service', slug)}
                  onClick={closeMenu}
                  className="text-sm hover:text-gold-muted transition-colors py-1 ps-2 border-s-2 border-transparent hover:border-gold-muted"
                >
                  {SERVICE_LABELS[slug] || slug}
                </Link>
              ))}
            </div>

            <Link href="/projects/" onClick={closeMenu} className="hover:text-gold-muted transition-colors py-1">
              Projects
            </Link>
            <Link href="/about-us/" onClick={closeMenu} className="hover:text-gold-muted transition-colors py-1">
              About Us
            </Link>
            <Link href="/contact/" onClick={closeMenu} className="hover:text-gold-muted transition-colors py-1">
              Contact
            </Link>
          </nav>
        </FocusTrap>
      ) : null}
    </div>
  )
}
