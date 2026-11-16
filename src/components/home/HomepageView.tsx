import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { FaqsBlockComponent } from '@/blocks/Faqs/Component'
import { TrackedContactLink } from '@/components/TrackedContactLink'
import { cmsFallbacks } from '@/data/cmsFallbacks'
import { SERVICE_AREA_GROUP_LABELS, SERVICE_AREA_GROUPS } from '@/data/serviceAreas'
import { whatsappHref } from '@/lib/contactLinks'
import { canonicalPath, FIXED_SERVICE_SLUGS } from '@/lib/routes'
import { isPubliclyPublished } from '@/lib/publication'
import { QuoteRequestForm } from './QuoteRequestForm'

// Homepage blocks and relationships are intentionally narrowed by block type at render time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRecord = Record<string, any>
type HomepageViewProps = { areas: DataRecord[]; contact: DataRecord; faqs: DataRecord[]; homepage: DataRecord; projects: DataRecord[]; services: DataRecord[]; settings: DataRecord; testimonials: DataRecord[] }

const mediaValue = (value: unknown): DataRecord | null => value && typeof value === 'object' && typeof (value as DataRecord).url === 'string' ? value as DataRecord : null
const relationshipID = (value: unknown): number | string | null => typeof value === 'number' || typeof value === 'string' ? value : value && typeof value === 'object' ? (value as DataRecord).id ?? null : null
const selectedRecords = (available: DataRecord[], selected: unknown): DataRecord[] => {
  if (!Array.isArray(selected) || selected.length === 0) return available
  const ids = new Set(selected.map(relationshipID).filter(Boolean))
  return available.filter((item) => ids.has(item.id))
}

function ActionLinks({ contact, hero, settings }: { contact: DataRecord; hero: DataRecord; settings: DataRecord }) {
  const whatsapp = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage)
  return <div className="action-row"><a className="button button-primary" href="#request-quote">{hero.primaryLabel || 'Get Free Quote'}</a>{whatsapp && <TrackedContactLink analytics={{ cta_location: 'homepage_hero' }} className="button button-whatsapp" eventName="whatsapp_click" href={whatsapp} rel="noopener noreferrer" target="_blank">{hero.whatsAppLabel || 'WhatsApp Us'}</TrackedContactLink>}</div>
}

function Hero({ contact, hero, settings }: { contact: DataRecord; hero: DataRecord; settings: DataRecord }) {
  const image = mediaValue(hero.image)
  return <section className="home-hero">{image && <Image alt={image.alt || 'Custom upholstered sofa in a contemporary UAE interior'} className="home-hero-image" fill priority sizes="100vw" src={image.url} />}<div className="home-hero-shade" /><div className="site-container home-hero-content"><p className="eyebrow">{hero.eyebrow || 'Made to measure in the UAE'}</p><h1>{hero.heading || cmsFallbacks.homepage.meta.h1}</h1><p className="hero-copy">{hero.copy || 'Custom-made sofas, Majlis seating, wardrobes, beds, upholstery and furniture restoration designed around your space, style and requirements.'}</p><ActionLinks contact={contact} hero={hero} settings={settings} /><p className="hero-trust">{hero.trustLine || 'Custom Made • Repair • Upholstery • UAE Service'}</p><p className="hero-note">{hero.note || 'Send us your design or furniture photo for a quotation.'}</p></div></section>
}

function TrustStrip({ items }: { items: unknown }) {
  const labels = Array.isArray(items) ? items.map((item) => typeof item === 'object' && item ? (item as DataRecord).label : null).filter(Boolean) : []
  return <aside aria-label="Why customers contact Al Rukn" className="trust-strip"><div className="site-container trust-strip-grid">{(labels.length ? labels : cmsFallbacks.homepage.trustItems).map((label) => <span key={String(label)}>{String(label)}</span>)}</div></aside>
}

function SectionHeading({ eyebrow, heading, intro }: { eyebrow?: string; heading: string; intro?: string }) {
  return <header className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{heading}</h2>{intro && <p>{intro}</p>}</header>
}

function ServicesSection({ block, services }: { block: DataRecord; services: DataRecord[] }) {
  const ordered = [...services].sort((left, right) => FIXED_SERVICE_SLUGS.indexOf(left.slug) - FIXED_SERVICE_SLUGS.indexOf(right.slug))
  const chosen = selectedRecords(ordered, block.services).slice(0, 9)
  if (!chosen.length) return null
  return <section className="home-section services-section" id="services"><div className="site-container"><SectionHeading heading={block.heading || 'Custom Furniture & Upholstery Services'} intro={block.intro || 'Made-to-measure furniture, careful reupholstery and practical repair work for homes, villas and workplaces.'} /><div className="service-grid">{chosen.map((service) => { const image = mediaValue(service.hero?.image); return <article className="service-card" key={service.id}>{image && <div className="card-image"><Image alt={image.alt || service.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={image.url} /></div>}<div className="card-body"><h3>{service.title}</h3><p>{service.summary}</p><Link className="text-link" href={canonicalPath('service', service.slug)}>Learn more <span aria-hidden="true">→</span></Link></div></article>})}</div></div></section>
}

const featureLinks: Record<string, { href: string; label: string }> = { customFurniture: { href: '/custom-furniture/', label: 'Request a Custom Furniture Quote' }, upholstery: { href: '#request-quote', label: 'Send Sofa Photo for a Quote' }, majlis: { href: '/majlis-furniture/', label: 'Explore Majlis Furniture' } }
function FeatureSection({ block }: { block: DataRecord }) {
  const image = mediaValue(block.image); const link = featureLinks[block.blockType] ?? { href: '/custom-furniture/', label: 'Request a Custom Furniture Quote' }
  return <section className={`home-section feature-section feature-${block.blockType}`}><div className={`site-container feature-layout ${block.imagePosition === 'left' ? 'feature-image-left' : ''}`}><div className="feature-copy"><SectionHeading eyebrow={block.eyebrow} heading={block.heading} /><p>{block.body}</p><Link className="button button-dark" href={link.href}>{block.ctaLabel || link.label}</Link></div>{image && <div className="feature-image"><Image alt={image.alt || block.heading} fill sizes="(max-width: 768px) 100vw, 50vw" src={image.url} /></div>}</div></section>
}

function ProjectsSection({ block, projects }: { block: DataRecord; projects: DataRecord[] }) {
  const verified = selectedRecords(projects, block.projects).filter((project) => project.verified === true && mediaValue(project.cover))
  if (!verified.length) return null
  return <section className="home-section projects-section" id="projects"><div className="site-container"><SectionHeading heading={block.heading || 'Our Furniture & Upholstery Work'} intro={block.intro} /><div className="project-grid">{verified.slice(0, 6).map((project) => { const image = mediaValue(project.cover)!; return <article className="project-card" key={project.id}><div className="project-image"><Image alt={image.alt || project.title} fill sizes="(max-width: 768px) 100vw, 50vw" src={image.url} /></div><div><p className="project-meta">{project.location || 'UAE'}</p><h3>{project.title}</h3><Link className="text-link" href={`/projects/${project.slug}/`}>View project</Link></div></article>})}</div><Link className="button button-outline" href="/projects/">View All Projects</Link></div></section>
}

function ProcessSection({ block }: { block: DataRecord }) { const steps = Array.isArray(block.steps) && block.steps.length === 4 ? block.steps : cmsFallbacks.homepage.process; return <section className="home-section process-section"><div className="site-container"><SectionHeading heading={block.heading || 'From Your Idea to Finished Furniture'} /><ol className="process-grid">{steps.map((step: DataRecord, index: number) => <li key={step.id || step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol></div></section> }
function BenefitsSection({ block }: { block: DataRecord }) { const items = Array.isArray(block.items) && block.items.length ? block.items : cmsFallbacks.homepage.benefits.map((title) => ({ title })); return <section className="home-section benefits-section"><div className="site-container benefits-layout"><SectionHeading heading={block.heading || 'Why Choose Al Rukn'} intro={block.intro || 'A practical, made-to-order service focused on your dimensions, materials and intended use.'} /><div className="benefit-list">{items.map((item: DataRecord, index: number) => <article key={item.id || item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</div></article>)}</div></div></section> }

function areaHref(area: DataRecord): string | null { const page = area.landingPage; if (!page || typeof page !== 'object' || typeof page.slug !== 'string' || !isPubliclyPublished(page, new Date())) return null; return `/${page.slug}/` }
function AreasSection({ areas, block }: { areas: DataRecord[]; block: DataRecord }) {
  const chosen = selectedRecords(areas, block.areas); if (!chosen.length) return null
  return <section className="home-section areas-section" id="areas-we-serve"><div className="site-container"><SectionHeading heading={block.heading || 'Furniture & Upholstery Services Across Dubai & the UAE'} intro={block.intro || 'Al Rukn provides custom furniture, sofa upholstery, furniture repair and related services across Dubai, Sharjah and selected UAE communities.'} /><div className="area-groups">{SERVICE_AREA_GROUPS.map((group) => { const groupAreas = chosen.filter((area) => area.group === group); if (!groupAreas.length) return null; return <details className="area-group" key={group} open={group === 'dubai'}><summary>{SERVICE_AREA_GROUP_LABELS[group]} <span>{groupAreas.length}</span></summary><div className="area-chips">{groupAreas.map((area) => { const href = areaHref(area); return href ? <Link href={href} key={area.id}>{area.name}</Link> : <span key={area.id}>{area.name}</span> })}</div></details> })}</div></div></section>
}

function LocalContentSection({ block }: { block: DataRecord }) { const paragraphs = Array.isArray(block.paragraphs) ? block.paragraphs : []; if (!paragraphs.length) return null; return <section className="home-section local-content"><div className="site-container local-content-layout"><h2>{block.heading}</h2><div>{paragraphs.map((paragraph: DataRecord) => <p key={paragraph.id || paragraph.text}>{paragraph.text}</p>)}</div></div></section> }
function TestimonialsSection({ block, testimonials }: { block: DataRecord; testimonials: DataRecord[] }) { const published = selectedRecords(testimonials, block.testimonials); if (!published.length) return null; return <section className="home-section testimonials-section"><div className="site-container"><SectionHeading heading={block.heading || 'Customer Feedback'} /><div className="testimonial-grid">{published.map((item) => <blockquote key={item.id}><p>“{item.statement}”</p><footer>{item.displayName}{item.location ? ` · ${item.location}` : ''}</footer></blockquote>)}</div></div></section> }
function FinalSection({ areas, block, contact, homepage, services, settings }: { areas: DataRecord[]; block: DataRecord; contact: DataRecord; homepage: DataRecord; services: DataRecord[]; settings: DataRecord }) { const whatsapp = contact.whatsappAvailable === false ? null : whatsappHref(contact.whatsappE164, settings.whatsAppCopy?.defaultMessage); const labels = homepage.sharedLabels || {}; return <section className="final-cta"><div className="site-container final-cta-layout"><div className="final-cta-copy"><p className="eyebrow">{labels.finalCtaEyebrow || cmsFallbacks.homepage.sharedLabels.finalCtaEyebrow}</p><h2>{block.heading || 'Have a Furniture Design in Mind?'}</h2><p>{block.description || 'Send your furniture photo, design or requirements and request a quotation.'}</p>{whatsapp && <TrackedContactLink analytics={{ cta_location: 'homepage_final_cta' }} className="button button-whatsapp" eventName="whatsapp_click" href={whatsapp} rel="noopener noreferrer" target="_blank">{block.whatsAppLabel || 'WhatsApp Us'}</TrackedContactLink>}</div><QuoteRequestForm areas={areas.map((area) => area.name)} heading={block.quoteHeading} labels={homepage.quoteForm} services={services.map(({ slug, title }) => ({ slug, title }))} /></div></section> }

export function HomepageView(props: HomepageViewProps) {
  const sections = Array.isArray(props.homepage?.sections) ? props.homepage.sections : []
  return <><Hero contact={props.contact} hero={props.homepage?.hero || {}} settings={props.settings} /><TrustStrip items={props.homepage?.trustItems} />{sections.map((block: DataRecord, index: number) => { if (block.enabled === false) return null; const key = block.id || `${block.blockType}-${index}`; if (block.blockType === 'services') return <ServicesSection block={block} key={key} services={props.services} />; if (['customFurniture', 'upholstery', 'majlis'].includes(block.blockType)) return <FeatureSection block={block} key={key} />; if (block.blockType === 'projects') return <ProjectsSection block={block} key={key} projects={props.projects} />; if (block.blockType === 'process') return <ProcessSection block={block} key={key} />; if (block.blockType === 'whyChoose') return <BenefitsSection block={block} key={key} />; if (block.blockType === 'areas') return <AreasSection areas={props.areas} block={block} key={key} />; if (block.blockType === 'localContent') return <LocalContentSection block={block} key={key} />; if (block.blockType === 'testimonials') return <TestimonialsSection block={block} key={key} testimonials={props.testimonials} />; if (block.blockType === 'faqs') return <FaqsBlockComponent enableSchema={block.enableSchema} faqs={selectedRecords(props.faqs, block.faqs)} heading={block.heading} key={key} />; if (block.blockType === 'finalCta') return <FinalSection areas={props.areas} block={block} contact={props.contact} homepage={props.homepage} key={key} services={props.services} settings={props.settings} />; return null })}</>
}
