import Link from 'next/link'
import React from 'react'
import { Logo } from '@/components/Logo/Logo'
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

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-charcoal text-ivory border-t-2 border-gold-muted pt-12 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & Contact */}
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="Al Rukn Furniture Homepage">
            <Logo />
          </Link>
          <p className="text-xs text-ivory/80 leading-relaxed">
            Premium custom upholstery, sofa manufacturing, majlis seating, and interior fit-out services across Ajman, Sharjah, Dubai, and the UAE.
          </p>
          <div className="text-xs text-ivory/90 space-y-1">
            <p><strong className="text-gold-muted">Phone:</strong> +971 50 123 4567</p>
            <p><strong className="text-gold-muted">Location:</strong> Industrial Area 2, Ajman, UAE</p>
            <p><strong className="text-gold-muted">Hours:</strong> Mon – Sat: 8:00 AM – 8:00 PM</p>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-muted mb-4">
            Our Services
          </h3>
          <ul className="space-y-2 text-xs">
            {FIXED_SERVICE_SLUGS.map((slug) => (
              <li key={slug}>
                <Link
                  href={canonicalPath('service', slug)}
                  className="hover:text-gold-muted transition-colors focus:outline-none focus:ring-1 focus:ring-gold-muted rounded px-1"
                >
                  {SERVICE_LABELS[slug] || slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Coverage & Links */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-muted mb-4">
            Coverage & Navigation
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <p className="font-semibold text-ivory mb-1">Service Areas:</p>
              <p className="text-ivory/80">Ajman, Sharjah, Dubai, Abu Dhabi, Ras Al Khaimah, Fujairah, Umm Al Quwain.</p>
            </div>
            <ul className="space-y-2 pt-2 border-t border-ivory/10">
              <li><Link href="/projects/" className="hover:text-gold-muted transition-colors">Projects & Portfolio</Link></li>
              <li><Link href="/about-us/" className="hover:text-gold-muted transition-colors">About Al Rukn</Link></li>
              <li><Link href="/contact/" className="hover:text-gold-muted transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Col 4: Social & Legal */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-muted mb-4">
            Connect & Legal
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gold-muted transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gold-muted transition-colors"
              >
                Facebook
              </a>
            </div>
            <div className="pt-4 border-t border-ivory/10 space-y-1">
              <p><Link href="/privacy-policy/" className="hover:text-gold-muted transition-colors">Privacy Policy</Link></p>
              <p><Link href="/terms/" className="hover:text-gold-muted transition-colors">Terms of Service</Link></p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 border-t border-ivory/10 text-center text-[11px] text-ivory/60">
        <p>© {new Date().getFullYear()} Al Rukn Furniture. All rights reserved.</p>
      </div>
    </footer>
  )
}
