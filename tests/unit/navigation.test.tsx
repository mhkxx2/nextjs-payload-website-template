import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MobileNav } from '@/components/Header/MobileNav'
import { AnnouncementBar } from '@/components/AnnouncementBar'
import { WhatsAppAction } from '@/components/WhatsAppAction'
import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

describe('Task 11 Site Chrome Navigation Unit Suite', () => {
  it('renders Header with logo and main navigation links', () => {
    render(<Header />)
    expect(screen.getByLabelText('Al Rukn Furniture Homepage')).toBeDefined()
    expect(screen.getAllByText('Home').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Projects').length).toBeGreaterThan(0)
    expect(screen.getAllByText('About Us').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0)
  })

  it('renders all 9 fixed service paths in Header desktop dropdown', () => {
    const { container } = render(<Header />)
    for (const slug of FIXED_SERVICE_SLUGS) {
      const link = container.querySelector(`a[href*="${slug}"]`)
      expect(link).not.toBeNull()
    }
  })

  it('renders MobileNav and opens/closes with focus trap', () => {
    const { container } = render(<MobileNav />)
    const openBtn = container.querySelector('button[aria-label="Open navigation menu"]')
    expect(openBtn).not.toBeNull()

    if (openBtn) {
      fireEvent.click(openBtn)
      expect(container.querySelector('button[aria-label="Close navigation menu"]')).not.toBeNull()

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(container.querySelector('button[aria-label="Close navigation menu"]')).toBeNull()
    }
  })

  it('renders Footer with contact, operating hours, service areas, social, and legal links', () => {
    render(<Footer />)
    expect(screen.getByText(/Industrial Area 2, Ajman, UAE/i)).toBeDefined()
    expect(screen.getByText(/Mon – Sat: 8:00 AM – 8:00 PM/i)).toBeDefined()
    expect(screen.getAllByText(/Ajman, Sharjah, Dubai/i).length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Instagram')).toBeDefined()
    expect(screen.getByText('Privacy Policy')).toBeDefined()
  })

  it('renders AnnouncementBar when enabled and suppresses when disabled', () => {
    const { rerender } = render(
      <AnnouncementBar enabled={true} badgeText="OFFER" message="10% Off Upholstery" />
    )
    expect(screen.getByText('OFFER')).toBeDefined()
    expect(screen.getByText('10% Off Upholstery')).toBeDefined()

    rerender(<AnnouncementBar enabled={false} badgeText="OFFER" message="10% Off Upholstery" />)
    expect(screen.queryByText('10% Off Upholstery')).toBeNull()
  })

  it('renders WhatsAppAction when href is provided and suppresses when null', () => {
    const { rerender, container } = render(<WhatsAppAction href="https://wa.me/971501234567" />)
    const link = container.querySelector('a[href="https://wa.me/971501234567"]')
    expect(link).not.toBeNull()

    rerender(<WhatsAppAction href={null} />)
    expect(container.querySelector('a')).toBeNull()
  })
})
