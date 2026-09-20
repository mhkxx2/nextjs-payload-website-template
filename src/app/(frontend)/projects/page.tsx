import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import type { Project } from '@/payload-types'
import { archiveCopy, homeCopy } from '@/data/launch-copy'
import { projectHref, serviceHref } from '@/lib/contentLinks'
import { queryPublicList } from '@/lib/publicQueries'

export const metadata: Metadata = {
  description: archiveCopy.projects.intro,
  title: `${archiveCopy.projects.heading} | Al Rukn Furniture`,
}

export default async function ProjectsIndex() {
  const { docs } = await queryPublicList<Project>({
    collection: 'projects',
    depth: 1,
    limit: 100,
    sort: '-publishedAt',
  })

  // Featured work leads the archive, then newest first. Ordering happens in code
  // so it stays deterministic without relying on a multi-field database sort.
  const projects = [...docs].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  )

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4">
        <Breadcrumbs items={[{ label: 'Projects' }]} />
        <header className="max-w-3xl py-6">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal mb-4">
            {archiveCopy.projects.heading}
          </h1>
          <p className="text-neutral-600">{archiveCopy.projects.intro}</p>
        </header>
      </div>

      {projects.length > 0 ? (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const href = projectHref(project.slug)
              const cover = typeof project.cover === 'object' ? project.cover?.url : null
              const service = typeof project.service === 'object' ? project.service : null
              const serviceLink = serviceHref(service?.slug)

              return (
                <article
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {cover ? (
                    <div className="relative h-56 w-full">
                      <Image
                        src={cover}
                        alt={project.title || 'Al Rukn Furniture project'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-56 bg-cream flex items-center justify-center text-neutral-500 text-sm">
                      Photo coming soon
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <h2 className="font-serif font-bold text-xl text-charcoal">
                      {project.title || ''}
                    </h2>
                    {project.location && (
                      <p className="text-xs uppercase tracking-wide text-neutral-500">
                        {project.location}
                      </p>
                    )}
                    {project.summary && (
                      <p className="text-sm text-neutral-600">{project.summary}</p>
                    )}
                    <div className="flex flex-wrap gap-4 pt-1">
                      {href && (
                        <Link
                          href={href}
                          className="text-amber-800 hover:text-amber-900 font-bold text-sm inline-flex items-center gap-1"
                        >
                          Read the case study →
                        </Link>
                      )}
                      {serviceLink && service?.title && (
                        <Link
                          href={serviceLink}
                          className="text-neutral-600 hover:text-charcoal text-sm inline-flex items-center gap-1"
                        >
                          {service.title}
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-10">
          <p className="text-neutral-600">{archiveCopy.projects.emptyMessage}</p>
        </div>
      )}

      <div className="mt-4">
        <CallToActionBlockComponent
          buttonLink={homeCopy.finalCta.buttonLink}
          buttonText={homeCopy.finalCta.buttonText}
          description={homeCopy.finalCta.description}
          heading={homeCopy.finalCta.heading}
        />
      </div>
    </div>
  )
}
