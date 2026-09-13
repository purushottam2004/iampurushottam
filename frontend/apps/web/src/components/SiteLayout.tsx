import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <SiteHeader />
      <div className="site-column">{children}</div>
      <SiteFooter />
    </div>
  )
}
