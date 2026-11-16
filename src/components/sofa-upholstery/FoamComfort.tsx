export type ComfortSectionContent = {
  heading?: string | null
  copy?: string | null
  items?: { id?: string | null; text?: string | null }[] | null
  ctaLabel?: string | null
} | null | undefined

export function FoamComfort({ content }: { content: ComfortSectionContent }) {
  if (!content?.heading) return null
  return (
    <section className="service-section sofa-foam-section">
      <div className="site-container sofa-foam-layout">
        <header className="section-heading">
          <h2>{content.heading}</h2>
          {content.copy && <p>{content.copy}</p>}
        </header>
        <div>
          {Boolean(content.items?.length) && (
            <ul>
              {content.items?.map((item) => (
                <li key={item.id || item.text}>{item.text}</li>
              ))}
            </ul>
          )}
          {content.ctaLabel && (
            <a className="button button-primary" href="#request-service-quote">
              {content.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
