import React from 'react'

export type QuoteFormBlockProps = {
  blockType?: 'quoteForm'
  heading?: string | null
  description?: string | null
  serviceContext?: unknown | null
  formTitle?: string | null
}

export const QuoteFormBlockComponent: React.FC<QuoteFormBlockProps> = ({
  heading,
  description,
  formTitle = 'Request a Quote',
}) => {
  return (
    <section className="py-12 md:py-16 bg-neutral-50" id="quote-form">
      <div className="container mx-auto px-4 max-w-2xl">
        {(heading || description) && (
          <div className="text-center mb-8">
            {heading && <h2 className="text-2xl md:text-3xl font-serif font-bold text-charcoal mb-2">{heading}</h2>}
            {description && <p className="text-neutral-600">{description}</p>}
          </div>
        )}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-neutral-200">
          <h3 className="font-serif font-bold text-xl text-charcoal mb-6 border-b pb-3">{formTitle}</h3>
          <form className="space-y-4" action="/api/leads" method="POST">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
              <input type="text" name="name" required className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-amber-700 focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                <input type="tel" name="phone" required className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-amber-700 focus:outline-none" placeholder="+971 50 123 4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                <input type="email" name="email" className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-amber-700 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Service Required</label>
              <select name="service" className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-amber-700 focus:outline-none">
                <option value="custom-sofa">Custom Sofa Manufacturing</option>
                <option value="sofa-upholstery">Sofa Upholstery & Repair</option>
                <option value="arabic-majlis">Arabic Majlis Design</option>
                <option value="furniture-restoration">Furniture Restoration</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Project Details</label>
              <textarea name="message" rows={4} className="w-full px-4 py-2 border border-neutral-300 rounded focus:ring-2 focus:ring-amber-700 focus:outline-none" placeholder="Tell us about dimensions, fabric preferences, or requirements..."></textarea>
            </div>
            <button type="submit" className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded transition-colors">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
