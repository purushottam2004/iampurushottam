const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatPostDate(value: string | null | undefined): string {
  if (!value) return 'Draft'
  return dateFormatter.format(new Date(value))
}
