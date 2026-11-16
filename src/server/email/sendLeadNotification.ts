import type { Payload } from 'payload'

export type LeadNotificationDetails = {
  area: string
  message: string
  name: string
  phone: string
  portfolioReference?: string
  service: string
}

const escapeHTML = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return entities[character] ?? character
  })

export async function sendLeadNotification(
  payload: Pick<Payload, 'logger' | 'sendEmail'>,
  details: LeadNotificationDetails,
): Promise<void> {
  const recipient = process.env.SMTP_TO_EMAIL
  if (!recipient) {
    payload.logger.error({ msg: 'Lead notification email skipped: SMTP_TO_EMAIL is not configured' })
    return
  }

  const rows = [
    ['Name', details.name],
    ['Phone / WhatsApp', details.phone],
    ['Service', details.service],
    ['Area', details.area],
    ['Message', details.message],
    ...(details.portfolioReference
      ? ([['Portfolio reference', details.portfolioReference]] as Array<[string, string]>)
      : []),
  ] as Array<[string, string]>

  try {
    await payload.sendEmail({
      html: `<h1>New Quote Request</h1><dl>${rows
        .map(
          ([label, value]) =>
            `<dt><strong>${escapeHTML(label)}</strong></dt><dd>${escapeHTML(value)}</dd>`,
        )
        .join('')}</dl>`,
      subject: 'New Quote Request - Al Rukn Furniture',
      text: rows.map(([label, value]) => `${label}: ${value}`).join('\n\n'),
      to: recipient,
    })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Lead notification email failed after lead was saved' })
  }
}
