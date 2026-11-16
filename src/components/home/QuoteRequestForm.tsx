'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { cmsFallbacks } from '@/data/cmsFallbacks'
import { trackGenerateLead } from '@/lib/analytics'

type QuoteFormCopy = {
  [Key in keyof typeof cmsFallbacks.homepage.quoteForm]: string
}
export type QuoteFormLabels = Partial<Record<keyof QuoteFormCopy, null | string>>

type QuoteRequestFormProps = {
  areas: string[]
  defaultMessage?: string | null
  heading?: string | null
  labels?: QuoteFormLabels | null
  formLocation?: string
  leadType?: 'contact' | 'service_quote'
  service?: string | null
  services?: Array<{ slug: string; title: string }>
}

type SubmissionState = { kind: 'error' | 'success'; message: string } | null

export function QuoteRequestForm({ areas, defaultMessage, formLocation = 'homepage_quote', heading, labels, leadType = 'service_quote', service, services = [] }: QuoteRequestFormProps) {
  const populatedLabels = Object.fromEntries(
    Object.entries(labels ?? {}).filter((entry): entry is [string, string] =>
      typeof entry[1] === 'string' && entry[1].length > 0,
    ),
  )
  const copy = { ...cmsFallbacks.homepage.quoteForm, ...populatedLabels } as QuoteFormCopy
  const serviceOptions = service && !services.some((option) => option.slug === service)
    ? [{ slug: service, title: service }, ...services]
    : services
  const [state, setState] = useState<SubmissionState>(null)
  const [pending, setPending] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setPending(true)
    setState(null)

    try {
      const formData = new FormData(form)
      const response = await fetch('/api/quote-request', {
        body: formData,
        method: 'POST',
      })
      const result = (await response.json().catch(() => null)) as { message?: string } | null

      if (!response.ok) {
        setState({ kind: 'error', message: result?.message ?? copy.errorMessage })
        return
      }

      trackGenerateLead({
        area: String(formData.get('area') ?? ''),
        cta_location: formLocation,
        lead_type: leadType,
        service: String(formData.get('service') ?? service ?? ''),
      })
      form.reset()
      setState({
        kind: 'success',
        message: result?.message ?? copy.successMessage,
      })
    } catch {
      setState({ kind: 'error', message: copy.networkErrorMessage })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="quote-panel" id="request-quote">
      <h3>{heading || copy.heading}</h3>
      <form encType="multipart/form-data" onSubmit={submit}>
        <div className="form-grid">
          <label><span>{copy.nameLabel}</span><input autoComplete="name" name="name" required type="text" /></label>
          <label><span>{copy.phoneLabel}</span><input autoComplete="tel" inputMode="tel" name="phone" required type="tel" /></label>
        </div>
        <div className="form-grid">
          <label><span>{copy.serviceLabel}</span><select defaultValue={service || ''} name="service" required><option disabled value="">{copy.servicePlaceholder}</option>{serviceOptions.map((option) => <option key={option.slug} value={option.slug}>{option.title}</option>)}</select></label>
          <label><span>{copy.areaLabel}</span><input list="quote-area-options" name="area" required type="text" /><datalist id="quote-area-options">{areas.map((area) => <option key={area} value={area} />)}</datalist></label>
        </div>
        <label><span>{copy.messageLabel} <span className="field-optional">(optional)</span></span><textarea defaultValue={defaultMessage || undefined} name="message" rows={4} /></label>
        <label><span>{copy.portfolioReferenceLabel} <span className="field-optional">(optional)</span></span><input accept="image/jpeg,image/png,image/webp,image/avif" name="photo" type="file" /><small>{copy.photoHelp}</small></label>
        <label className="consent-row"><input name="consent" required type="checkbox" value="true" /><span>{copy.consentLabel} See the <Link href="/privacy/">{copy.privacyLabel}</Link>.</span></label>
        <button className="button button-primary button-wide" disabled={pending} type="submit">{pending ? copy.pendingLabel : copy.submitLabel}</button>
        <p aria-live="polite" className={state?.kind === 'error' ? 'form-status form-error' : 'form-status form-success'} role="status">{state?.message}</p>
      </form>
    </div>
  )
}
