import { SITE_NAME } from '../site/constants'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      {SITE_NAME}, {new Date().getFullYear()}
    </footer>
  )
}
