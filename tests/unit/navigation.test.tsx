import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MobileNav } from '@/components/Header/MobileNav'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

const services = FIXED_SERVICE_SLUGS.map((slug) => ({
  label: slug,
  service: { id: slug, slug, title: slug },
}))
const headerData = {
  navigation: [
    { destination: 'home', label: 'Home' },
    { destination: 'services', label: 'Services' },
    { destination: 'projects', label: 'Projects' },
    { destination: 'areas', label: 'Areas We Serve' },
    { destination: 'about', label: 'About' },
    { destination: 'blog', label: 'Blog' },
    { destination: 'contact', label: 'Contact' },
  ],
  serviceLinks: services,
}
const verifiedContact = {
  address: { city: 'Ajman', country: 'United Arab Emirates', line1: 'CGMC+486, Al Jerf 1' },
  email: 'info@alruknfurniture.ae',
  mapURL: 'https://www.google.com/maps?cid=6740373205854748574&hl=en',
  phoneE164: '+971551224902',
  whatsappAvailable: true,
  whatsappE164: '+971551224902',
}
const settings = { brandName: 'Al Rukn Furniture', whatsAppCopy: { defaultMessage: 'Quotation' } }

describe('Task 11 Site Chrome Navigation Unit Suite', () => {
  it('renders Header with logo and main navigation links', () => {
    render(<Header contact={verifiedContact} data={headerData} settings={settings} />)
    expect(screen.getByLabelText('Al Rukn Furniture Homepage')).toBeDefined()
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
    expect(screen.getAllByText('About').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0)
  })

  it('renders all 9 fixed service paths in Header desktop dropdown', () => {
    const { container } = render(<Header contact={verifiedContact} data={headerData} settings={settings} />)
    for (const slug of FIXED_SERVICE_SLUGS) {
      const link = container.querySelector(`a[href*="${slug}"]`)
      expect(link).not.toBeNull()
    }
  })

  it('renders MobileNav and opens/closes with focus trap', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = render(<MobileNav />)
    const openBtn = container.querySelector<HTMLButtonElement>('button[aria-label="Open navigation menu"]')
    expect(openBtn).not.toBeNull()

    if (openBtn) {
      openBtn.focus()
      fireEvent.click(openBtn)
      const drawer = document.querySelector('#mobile-navigation-drawer')
      expect(drawer).not.toBeNull()
      expect(drawer?.getAttribute('aria-modal')).toBe('true')
      expect(document.querySelector('button[aria-label="Close navigation menu"]')).not.toBeNull()

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(document.querySelector('button[aria-label="Close navigation menu"]')).toBeNull()
      expect(document.activeElement).toBe(openBtn)
    }

    scrollTo.mockRestore()
  })

  it('renders Footer with contact, operating hours, service areas, social, and legal links', () => {
    render(<Footer contact={verifiedContact} data={{ legalLinks: [{ label: 'Privacy Policy', legalDestination: 'privacy' }], serviceLinks: services }} settings={settings} social={{ links: [] }} />)
    expect(screen.getByText(/CGMC\+486, Al Jerf 1, Ajman, United Arab Emirates/i)).toBeDefined()
    expect(screen.getByText('info@alruknfurniture.ae')).toBeDefined()
    expect(screen.queryByLabelText('Instagram')).toBeNull()
    expect(screen.getByText('Privacy Policy')).toBeDefined()
  })

  it('renders AnnouncementBar when enabled and suppresses when disabled', () => {
    const { rerender } = render(
      <AnnouncementBar enabled={true} badgeText="NOTICE" message="Workshop update" />
    )
    expect(screen.getByText('NOTICE')).toBeDefined()
    expect(screen.getByText('Workshop update')).toBeDefined()

    rerender(<AnnouncementBar enabled={false} badgeText="NOTICE" message="Workshop update" />)
    expect(screen.queryByText('Workshop update')).toBeNull()
  })

  it('renders WhatsAppAction when href is provided and suppresses when null', () => {
    const { rerender, container } = render(<WhatsAppAction href="https://wa.me/971551224902" />)
    const link = container.querySelector('a[href="https://wa.me/971551224902"]')
    expect(link).not.toBeNull()

    rerender(<WhatsAppAction href={null} />)
    expect(container.querySelector('a')).toBeNull()
  })
})
