import React from 'react'

export type ProcessStepItem = {
  stepNumber: number
  title: string
  description?: string | null
}

export type ProcessStepsBlockProps = {
  blockType?: 'processSteps'
  heading: string
  steps: ProcessStepItem[]
}

export const ProcessStepsBlockComponent: React.FC<ProcessStepsBlockProps> = ({
  heading,
  steps = [],
}) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-center text-charcoal mb-10">{heading}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative p-6 bg-amber-50/40 rounded-lg border border-amber-100 flex flex-col">
              <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center mb-4">
                {step.stepNumber}
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{step.title}</h3>
              {step.description && <p className="text-neutral-600 text-sm">{step.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
