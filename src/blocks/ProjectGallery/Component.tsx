import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { projectHref } from '@/lib/contentLinks'

export type ProjectGalleryBlockProps = {
  blockType?: 'projectGallery'
  heading?: string | null
  subheading?: string | null
  projects?: unknown[] | null
  limit?: number | null
}

export const ProjectGalleryBlockComponent: React.FC<ProjectGalleryBlockProps> = ({
  heading,
  subheading,
  projects = [],
}) => {
  const projectItems = (projects || []).map((item) => {
    const project =
      typeof item === 'object' && item !== null
        ? (item as {
            cover?: { url?: string } | number | null
            featuredImage?: { url?: string } | number | null
            slug?: string
            title?: string
          })
        : {}

    return { ...project, href: projectHref(project.slug) }
  })

  return (
    <section className="py-12 md:py-16 bg-neutral-900 text-white">
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {heading && <h2 className="text-2xl md:text-4xl font-serif font-bold text-amber-100 mb-3">{heading}</h2>}
            {subheading && <p className="text-neutral-400">{subheading}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectItems.map((project, idx) => {
            const cover = typeof project.cover === 'object' ? project.cover?.url : null
            const featured =
              typeof project.featuredImage === 'object' ? project.featuredImage?.url : null
            const imgUrl = cover || featured || null
            return (
              <div key={idx} className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-600 transition-colors">
                {imgUrl ? (
                  <div className="relative h-56 w-full">
                    <Image src={imgUrl} alt={project.title || 'Project'} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-56 bg-neutral-700 flex items-center justify-center text-neutral-400">Project Image</div>
                )}
                <div className="p-5">
                  <h3 className="font-serif font-bold text-xl text-amber-50 mb-2">{project.title || ''}</h3>
                  {project.href && (
                    <Link href={project.href} className="text-amber-400 hover:text-amber-300 text-sm font-bold inline-flex items-center gap-1">
                      View Project Case Study →
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
