import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import React from 'react'

import { CallToActionBlockComponent } from '@/blocks/CallToAction/Component'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import type { Media as MediaType, Project } from '@/payload-types'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { serviceHref } from '@/lib/contentLinks'
import { canonicalPath } from '@/lib/routes'
import { queryPublicDocBySlug, queryPublicSlugs } from '@/lib/publicQueries'
import { buildSchemas, getSchemaGlobals } from '@/lib/schema'
import { buildMetadata, getSeoDefaults } from '@/lib/seo'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function generateStaticParams() {
  const slugs = await queryPublicSlugs('projects')

  return slugs.map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProjectDetail({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = canonicalPath('project', decodedSlug)
  const project = await queryPublicDocBySlug<Project>('projects', decodedSlug)

  if (!project) return <PayloadRedirects url={url} />

  const service = typeof project.service === 'object' ? project.service : null
  const serviceLink = serviceHref(service?.slug)
  const cover = typeof project.cover === 'object' ? (project.cover as MediaType) : null
  const gallery = (project.gallery ?? [])
    .map((item) => (typeof item.image === 'object' ? (item.image as MediaType) : null))
    .filter((image): image is MediaType => image !== null)
  const narrative = Array.isArray(project.narrative) ? project.narrative : []
  const breadcrumbs = buildBreadcrumbs(url, project)
  const [schemaGlobals, archives] = await Promise.all([
    getSchemaGlobals(),
    getCachedGlobal('archive-settings', 1)(),
  ])
  const schemas = buildSchemas({
    breadcrumbs,
    globals: schemaGlobals,
    kind: 'project',
    path: url,
    record: project,
  })
  const archive = archives.projectsArchive

  return (
    <article className="pt-16 pb-16">
      <JsonLd schemas={schemas} />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <div className="container mx-auto px-4">
        <Breadcrumbs items={breadcrumbs} />

        <header className="max-w-3xl py-6 space-y-3">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-charcoal">
            {project.title}
          </h1>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {[project.location, project.completion?.date].filter(Boolean).join(' · ')}
          </p>
          {project.summary && <p className="text-lg text-neutral-700">{project.summary}</p>}
          {serviceLink && service?.title && (
            <p className="text-sm text-neutral-600">
              Service:{' '}
              <Link href={serviceLink} className="text-amber-800 hover:text-amber-900 font-semibold">
                {service.title}
              </Link>
            </p>
          )}
        </header>

        {cover && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-200 mb-10">
            <Media resource={cover} fill className="object-cover" />
          </div>
        )}

        {(project.challenge || project.solution || project.completion?.details) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mb-12">
            {project.challenge && (
              <section className="p-6 bg-white rounded-xl border border-neutral-200">
                <h2 className="font-serif font-bold text-xl text-charcoal mb-3">The brief</h2>
                <p className="text-neutral-700 text-sm whitespace-pre-line">{project.challenge}</p>
              </section>
            )}
            {project.solution && (
              <section className="p-6 bg-cream rounded-xl border border-neutral-200">
                <h2 className="font-serif font-bold text-xl text-charcoal mb-3">What we did</h2>
                <p className="text-neutral-700 text-sm whitespace-pre-line">{project.solution}</p>
              </section>
            )}
            {project.completion?.details && (
              <section className="p-6 bg-white rounded-xl border border-neutral-200 lg:col-span-2">
                <h2 className="font-serif font-bold text-xl text-charcoal mb-3">Completion</h2>
                <p className="text-neutral-700 text-sm">{project.completion.details}</p>
              </section>
            )}
          </div>
        )}

        {narrative.length > 0 && (
          <div className="mb-12">
            <RenderBlocks blocks={narrative as never} />
          </div>
        )}

        {gallery.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif font-bold text-2xl text-charcoal mb-6">Project gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((image, index) => (
                <div
                  key={image.id ?? index}
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200"
                >
                  <Image
                    src={image.url || ''}
                    alt={image.alt || project.title || 'Al Rukn Furniture project'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <CallToActionBlockComponent
        buttonLink="/contact/"
        buttonText={archive?.cta?.primaryLabel || cmsFallbacks.archives.projects.cta.buttonText}
        description={archive?.cta?.description || cmsFallbacks.archives.projects.cta.description}
        heading={archive?.cta?.heading || cmsFallbacks.archives.projects.cta.heading}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const [project, defaults] = await Promise.all([
    queryPublicDocBySlug<Project>('projects', decodedSlug),
    getSeoDefaults(),
  ])

  if (!project) return {}

  return buildMetadata(project, { ...defaults, path: canonicalPath('project', decodedSlug) })
}
