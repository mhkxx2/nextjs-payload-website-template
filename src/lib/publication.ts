export type PublicationState = {
  _status?: null | string
  publishedAt?: Date | null | string
  status?: null | string
}

export function isPubliclyPublished(publication: PublicationState, now: Date): boolean {
  if (
    publication._status !== 'published' ||
    publication.status !== 'published' ||
    publication.publishedAt == null
  ) {
    return false
  }

  const publishedAt =
    publication.publishedAt instanceof Date
      ? publication.publishedAt.getTime()
      : Date.parse(publication.publishedAt)

  return Number.isFinite(publishedAt) && publishedAt <= now.getTime()
}
