import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'
import { MobileNav } from './MobileNav'
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

export const Header: React.FC = () => {
  return (
    <header className="bg-ivory border-b border-border sticky top-0 z-30 shadow-xs">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" aria-label="Al Rukn Furniture Homepage" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gold-muted rounded-sm">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8 font-medium text-sm text-charcoal">
          <Link href="/" className="hover:text-gold-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1">
            Home
          </Link>

          {/* Services Menu */}
          <div className="relative group">
            <Link
              href={canonicalPath('service', FIXED_SERVICE_SLUGS[0])}
              className="hover:text-gold-muted transition-colors py-2 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1"
            >
              Services
              <svg className="w-4 h-4 fill-current transition-transform group-hover:rotate-180" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </Link>

            <div className="absolute start-0 top-full hidden group-hover:flex group-focus-within:flex flex-col bg-charcoal text-ivory min-w-[280px] p-4 rounded-b-lg shadow-xl border-t-2 border-gold-muted z-50">
              {FIXED_SERVICE_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={canonicalPath('service', slug)}
                  className="py-2 px-3 text-xs hover:bg-gold-muted/20 hover:text-gold-muted rounded transition-colors focus:outline-none focus:bg-gold-muted/20 focus:text-gold-muted"
                >
                  {SERVICE_LABELS[slug] || slug}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/projects/" className="hover:text-gold-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1">
            Projects
          </Link>
          <Link href="/about-us/" className="hover:text-gold-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1">
            About Us
          </Link>
          <Link href="/contact/" className="hover:text-gold-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gold-muted rounded px-1">
            Contact
          </Link>
        </nav>

        <MobileNav />
      </div>
    </header>
  )
}
