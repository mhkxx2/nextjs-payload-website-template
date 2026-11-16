import { FIXED_SERVICE_SLUGS } from '@/lib/routes'

export const ANALYTICS_EVENT_NAMES = [
  'whatsapp_click',
  'phone_call_click',
  'generate_lead',
  'select_item',
  'view_item',
  'reviews_view_google_click',
  'review_write_click',
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]

export type AnalyticsParameters = {
  area?: null | string
  category?: null | string
  cta_location?: null | string
  lead_type?: null | string
  link_url?: null | string
  page_path?: null | string
  page_title?: null | string
  portfolio_item?: null | string
  project?: null | string
  service?: null | string
}

export type AnalyticsEvent = AnalyticsParameters & {
  event: AnalyticsEventName
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const ALLOWED_PARAMETERS = [
  'page_path',
  'page_title',
  'cta_location',
  'service',
  'lead_type',
  'area',
  'portfolio_item',
  'project',
  'category',
  'link_url',
] as const satisfies ReadonlyArray<keyof AnalyticsParameters>

const populated = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

export function pushDataLayerEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return

  const payload: Record<string, string> = { event: event.event }
  const pathSegments = window.location.pathname.split('/').filter(Boolean)
  const routeService = pathSegments.length === 1 && (FIXED_SERVICE_SLUGS as readonly string[]).includes(pathSegments[0]!)
    ? pathSegments[0]
    : null
  const defaults: AnalyticsParameters = {
    page_path: window.location.pathname,
    page_title: document.title,
    service: routeService,
  }

  for (const key of ALLOWED_PARAMETERS) {
    const value = event[key] ?? defaults[key]
    if (populated(value)) payload[key] = value.trim()
  }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
}

export const trackWhatsAppClick = (context: AnalyticsParameters = {}): void => {
  pushDataLayerEvent({ event: 'whatsapp_click', ...context })
}

export const trackPhoneCallClick = (context: AnalyticsParameters = {}): void => {
  pushDataLayerEvent({ event: 'phone_call_click', ...context })
}

export const trackGenerateLead = (context: AnalyticsParameters): void => {
  pushDataLayerEvent({ event: 'generate_lead', ...context })
}
