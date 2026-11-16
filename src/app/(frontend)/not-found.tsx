import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

/**
 * The real 404 route: Next serves this with an HTTP 404 status for unknown
 * paths, so it stays useful for a visitor (and honest for a crawler).
 */
export default function NotFound() {
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">This page could not be found.</p>
        <p className="mb-4">
          The page you asked for has moved, or it never existed. Use the links below to carry on, or
          call us if you were looking for a service you cannot find.
        </p>
      </div>
      <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/services/">Services</Link>
        </li>
        <li>
          <Link href="/projects/">Projects</Link>
        </li>
        <li>
          <Link href="/blog/">Blog</Link>
        </li>
        <li>
          <Link href="/contact/">Contact</Link>
        </li>
      </ul>
      <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
