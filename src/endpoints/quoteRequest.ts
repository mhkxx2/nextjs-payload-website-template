import type { Endpoint } from 'payload'

import { sendLeadNotification } from '@/server/email/sendLeadNotification'
import { createControlledLead } from '@/server/leads/createControlledLead'
import { MAX_QUOTE_UPLOAD_BYTES, validateQuoteRequest } from '@/server/leads/validateQuoteRequest'

const json = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { headers: { 'Cache-Control': 'no-store' }, status })

type UploadedFile = {
  arrayBuffer: () => Promise<ArrayBuffer>
  name: string
  size: number
  type: string
}

const asUpload = (value: FormDataEntryValue | null): UploadedFile | null => {
  if (!value || typeof value === 'string') return null
  return typeof value.arrayBuffer === 'function' ? value : null
}

export const quoteRequestEndpoint: Endpoint = {
  method: 'post',
  path: '/quote-request',
  handler: async (req) => {
    let referenceMediaID: number | string | null = null
    try {
      if (!req.formData) return json({ message: 'This endpoint expects multipart form data.' }, 415)
      const form = await req.formData()
      const validation = validateQuoteRequest({
        area: form.get('area'),
        consent: form.get('consent'),
        message: form.get('message'),
        name: form.get('name'),
        phone: form.get('phone'),
        portfolioItem: form.get('portfolioItem'),
        service: form.get('service'),
      })
      if (!validation.ok) return json({ errors: validation.errors, message: 'Please check the required fields.' }, 400)

      const photo = asUpload(form.get('photo'))
      const portfolioItem = validation.value.portfolioItem
        ? await req.payload
            .findByID({
              collection: 'portfolio-items',
              depth: 1,
              id: validation.value.portfolioItem,
              overrideAccess: false,
              req,
            })
            .catch(() => null)
        : null

      if (validation.value.portfolioItem && !portfolioItem) {
        return json({ message: 'The selected portfolio design is not available.' }, 400)
      }
      // Photo is optional on service quote forms (Ads LP). Portfolio flow may still
      // omit a file when a portfolio design id is supplied instead.
      if (photo && photo.size > MAX_QUOTE_UPLOAD_BYTES) {
        return json({ message: 'The photo must not exceed 12 MB.' }, 413)
      }

      const relatedService = portfolioItem && typeof portfolioItem.relatedService === 'object'
        ? portfolioItem.relatedService
        : null
      const resolvedServiceSlug = relatedService?.slug || validation.value.service
      const serviceResult = await req.payload.find({
        collection: 'services',
        depth: 0,
        limit: 1,
        overrideAccess: false,
        pagination: false,
        req,
        where: { slug: { equals: resolvedServiceSlug } },
      })
      const service = serviceResult.docs[0]
      if (!service) return json({ message: 'The selected service is not available.' }, 400)

      if (photo && photo.size > 0) {
        const bytes = Buffer.from(await photo.arrayBuffer())
        const reference = await req.payload.create({
          collection: 'lead-media',
          data: { originalName: photo.name.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 180), purpose: 'quotation-reference' },
          file: { data: bytes, mimetype: photo.type, name: photo.name, size: bytes.length },
          overrideAccess: true,
          req,
        })
        referenceMediaID = reference.id
      }

      await createControlledLead(req.payload, {
        area: validation.value.area,
        consent: true,
        consentAt: new Date().toISOString(),
        fullName: validation.value.name,
        message: validation.value.message,
        phone: validation.value.phone,
        ...(referenceMediaID != null ? { referenceMedia: referenceMediaID } : {}),
        ...(portfolioItem
          ? {
              portfolioDesignTitle: portfolioItem.title,
              portfolioItem: portfolioItem.id,
              projectContext: `Portfolio design: ${portfolioItem.title} · /portfolio/?design=${portfolioItem.slug}`,
            }
          : {}),
        service: service.id,
        sourcePath: portfolioItem ? `/portfolio/?design=${portfolioItem.slug}` : '/',
        sourceTitle: portfolioItem ? 'Portfolio design quotation' : 'Homepage quotation form',
      } as never)

      await sendLeadNotification(req.payload, {
        area: validation.value.area,
        message: validation.value.message,
        name: validation.value.name,
        phone: validation.value.phone,
        ...(portfolioItem
          ? {
              portfolioReference: `${portfolioItem.title} · ${process.env.NEXT_PUBLIC_SERVER_URL}/portfolio/?design=${portfolioItem.slug}`,
            }
          : {}),
        service: service.title,
      })

      return json({ message: 'Thank you. Your quotation request has been received.' }, 201)
    } catch (error) {
      if (referenceMediaID != null) {
        await req.payload.delete({ collection: 'lead-media', id: referenceMediaID, overrideAccess: true, req }).catch(() => undefined)
      }
      req.payload.logger.error({ err: error, msg: 'Quotation request failed' })
      return json({ message: 'The request could not be submitted. Please call or use WhatsApp.' }, 500)
    }
  },
}
