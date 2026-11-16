import { revalidatePath, revalidateTag } from 'next/cache'

export type CacheInvalidationRequest = {
  payload: {
    logger: {
      info?: (message: string) => void
      warn?: (message: string) => void
    }
  }
}

const isMissingStaticStore = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('static generation store missing')

const runInvalidation = (
  req: CacheInvalidationRequest,
  target: string,
  invalidate: () => void,
): void => {
  try {
    invalidate()
  } catch (error) {
    if (!isMissingStaticStore(error)) throw error

    req.payload.logger.warn?.(
      `Skipped cache revalidation for ${target} outside a Next.js request context.`,
    )
  }
}

export const expireTag = (req: CacheInvalidationRequest, tag: string): void => {
  runInvalidation(req, tag, () => revalidateTag(tag, { expire: 0 }))
}

export const expirePath = (
  req: CacheInvalidationRequest,
  path: string,
  type?: 'layout' | 'page',
): void => {
  runInvalidation(req, path, () => {
    if (type) {
      revalidatePath(path, type)
      return
    }

    revalidatePath(path)
  })
}
