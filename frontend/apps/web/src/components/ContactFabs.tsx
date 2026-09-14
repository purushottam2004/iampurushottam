import { linkedinHref, mailtoUrl, whatsappChatUrl } from '../lib/settings'
import { useSiteSettings } from '../site/useSiteSettings'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7ZM12.05 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.15.82.84-3.07-.2-.32a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.26-8.22 8.26Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.22-.08-.39-.12-.55.13-.16.24-.63.8-.77.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.2 3.7.59.25 1.05.41 1.41.52.59.18 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z"
      />
    </svg>
  )
}

export function ContactFabs() {
  const { whatsappPhone, contactEmail, linkedinUrl, loading } = useSiteSettings()
  const whatsappHref = whatsappPhone ? whatsappChatUrl(whatsappPhone) : null
  const linkedinLink = linkedinUrl ? linkedinHref(linkedinUrl) : null
  const mailHref = contactEmail ? mailtoUrl(contactEmail) : null

  if (loading || (!whatsappHref && !linkedinLink && !mailHref)) {
    return null
  }

  return (
    <nav className="contact-fabs" aria-label="Contact">
      {whatsappHref && (
        <a
          className="contact-fab contact-fab-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
        >
          <span className="visually-hidden">Chat on WhatsApp</span>
          <WhatsAppIcon />
        </a>
      )}
      {linkedinLink && (
        <a
          className="contact-fab contact-fab-linkedin"
          href={linkedinLink}
          target="_blank"
          rel="noreferrer"
        >
          <span className="visually-hidden">Open LinkedIn</span>
          <LinkedInIcon />
        </a>
      )}
      {mailHref && (
        <a className="contact-fab contact-fab-mail" href={mailHref}>
          <span className="visually-hidden">Send email</span>
          <MailIcon />
        </a>
      )}
    </nav>
  )
}
