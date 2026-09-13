export type PublicationState = {
  publishedAt?: Date | null | string
  status?: null | string
}

export function isPubliclyPublished(publication: PublicationState, now: Date): boolean {
  if (publication.status !== 'published' || publication.publishedAt == null) {
    return false
  }

  const publishedAt =
    publication.publishedAt instanceof Date
      ? publication.publishedAt.getTime()
      : Date.parse(publication.publishedAt)

  return Number.isFinite(publishedAt) && publishedAt <= now.getTime()
}
