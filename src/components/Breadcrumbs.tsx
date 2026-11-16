import Link from 'next/link'
import React from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumbs" className="py-3 text-xs text-neutral-500">
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link href="/" className="hover:text-charcoal transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={index}>
              <li aria-hidden="true" className="text-neutral-400 select-none">
                /
              </li>
              <li>
                {isLast || !item.href ? (
                  <span aria-current="page" className="font-medium text-charcoal">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-charcoal transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
