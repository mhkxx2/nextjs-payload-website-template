'use client'

import Link from 'next/link'
import React, { useRef, useState } from 'react'

import { TrackedContactLink } from '@/components/TrackedContactLink'
import { trackGenerateLead } from '@/lib/analytics'

type Props = {
  areas?: string[]
  formLocation?: string
  whatsappURL?: null | string
}

type SubmissionState = { kind: 'error' | 'success'; message: string } | null

export function CompactQuoteForm({
  areas = [],
  formLocation = 'curtains_quick_quote',
  whatsappURL,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [pending, setPending] = useState(false)
  const [state, setState] = useState<SubmissionState>(null)
  const submittingLock = useRef(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingLock.current || pending) return
    submittingLock.current = true
    setPending(true)
    setState(null)

    const form = event.currentTarget
    const formData = new FormData(form)
    const interest = String(formData.get('interest') || 'Both')
    const existingMessage = String(formData.get('message') || '').trim()
    const composed = [
      `Interested in: ${interest}`,
      existingMessage || null,
      typeof window !== 'undefined' ? `Page: ${window.location.href}` : null,
      typeof window !== 'undefined' && window.location.search
        ? `UTM/query: ${window.location.search}`
        : null,
    ]
      .filter(Boolean)
      .join('\n')
    formData.set('message', composed)
    formData.set('service', 'curtains-blinds')
    if (formData.get('consent') !== 'true' && formData.get('consent') !== 'on') {
      setState({ kind: 'error', message: 'Privacy consent is required.' })
      submittingLock.current = false
      setPending(false)
      return
    }

    try {
      const response = await fetch('/api/quote-request', {
        body: formData,
        method: 'POST',
      })
      const result = (await response.json().catch(() => null)) as { message?: string } | null
      if (!response.ok) {
        setState({ kind: 'error', message: result?.message || 'Please check the form and try again.' })
        return
      }

      trackGenerateLead({
        area: String(formData.get('area') || ''),
        category: interest.toLowerCase(),
        cta_location: formLocation,
        lead_type: 'service_quote',
        service: 'curtains-blinds',
      })
      form.reset()
      setState({
        kind: 'success',
        message: result?.message || 'Thank you. Our team will contact you shortly.',
      })
    } catch {
      setState({ kind: 'error', message: 'Network error. Please try WhatsApp or call us.' })
    } finally {
      setPending(false)
      submittingLock.current = false
    }
  }

  return (
    <div className="cb-quick-quote" id="quick-quote">
      <div className="cb-quick-quote-copy">
        <p className="eyebrow">Quick enquiry</p>
        <h2>Get a Quote for Your Curtains in Minutes</h2>
        <p>Share a few details and we will follow up with options for measurement and installation.</p>
        {whatsappURL ? (
          <TrackedContactLink
            analytics={{ cta_location: 'curtains_quick_whatsapp', service: 'curtains-blinds' }}
            className="button button-secondary cb-quick-wa"
            eventName="whatsapp_click"
            href={whatsappURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Prefer WhatsApp? Message us
          </TrackedContactLink>
        ) : null}
      </div>
      <form className="cb-quick-form" encType="multipart/form-data" onSubmit={submit} ref={formRef}>
        <label>
          <span>Name</span>
          <input autoComplete="name" name="name" required type="text" />
        </label>
        <label>
          <span>WhatsApp Number</span>
          <input autoComplete="tel" inputMode="tel" name="phone" required type="tel" />
        </label>
        <label>
          <span>Location / Area</span>
          <input list="cb-quick-areas" name="area" required type="text" />
          <datalist id="cb-quick-areas">
            {areas.map((area) => (
              <option key={area} value={area} />
            ))}
          </datalist>
        </label>
        <label>
          <span>Interested In</span>
          <select defaultValue="Both" name="interest" required>
            <option value="Curtains">Curtains</option>
            <option value="Blinds">Blinds</option>
            <option value="Both">Both</option>
          </select>
        </label>
        <label className="cb-quick-photo">
          <span>Window photo <span className="field-optional">(optional)</span></span>
          <input accept="image/jpeg,image/png,image/webp,image/avif" name="photo" type="file" />
        </label>
        <input name="message" type="hidden" value="" />
        <label className="consent-row">
          <input name="consent" required type="checkbox" value="true" />
          <span>
            I agree to be contacted about this enquiry. See the <Link href="/privacy/">Privacy Policy</Link>.
          </span>
        </label>
        <button className="button button-primary button-wide" disabled={pending} type="submit">
          {pending ? 'Sending…' : 'Request My Quote'}
        </button>
        <p
          aria-live="polite"
          className={state?.kind === 'error' ? 'form-status form-error' : 'form-status form-success'}
          role="status"
        >
          {state?.message}
        </p>
      </form>
    </div>
  )
}
