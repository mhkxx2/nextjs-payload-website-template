import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const contact = {
  address: { city: 'Ajman', country: 'United Arab Emirates', line1: 'CGMC+486, Al Jerf 1' },
  email: 'info@alruknfurniture.ae',
  phoneE164: '+971551224902',
  whatsappAvailable: true,
  whatsappE164: '+971551224902',
}
const settings = { brandName: 'Al Rukn Furniture', whatsAppCopy: { defaultMessage: 'Hello' } }
const header = {
  navigation: [
    { destination: 'home', label: 'Home' },
    { destination: 'projects', label: 'Projects' },
    { destination: 'areas', label: 'Areas We Serve' },
    { destination: 'blog', label: 'Blog' },
    { destination: 'contact', label: 'Contact' },
  ],
  serviceLinks: [{ label: 'Sofa Upholstery', service: { id: 1, slug: 'sofa-upholstery', title: 'Sofa Upholstery' } }],
}

describe('CMS-driven conversion chrome', () => {
  it('renders navigation and contact actions only from supplied data', () => {
    const { container } = render(<Header contact={contact} data={header} settings={settings} />)
    expect(screen.getAllByText('Areas We Serve').length).toBeGreaterThan(0)
    expect(container.querySelector('a[href="tel:+971551224902"]')).not.toBeNull()
    expect(container.querySelector('a[href^="https://wa.me/971551224902"]')).not.toBeNull()
    expect(container.textContent).not.toContain('+971 50 123 4567')
  })

  it('omits unavailable footer facts and never supplies placeholder social links', () => {
    const { container } = render(
      <Footer
        contact={{}}
        data={{ legalLinks: [], navigationGroups: [], serviceLinks: [], supportingCopy: 'Custom furniture and upholstery.' }}
        settings={settings}
        social={{ links: [] }}
      />,
    )
    expect(container.textContent).toContain('Custom furniture and upholstery.')
    expect(container.textContent).not.toContain('+971 50 123 4567')
    expect(container.querySelector('a[href="https://instagram.com"]')).toBeNull()
  })
})
