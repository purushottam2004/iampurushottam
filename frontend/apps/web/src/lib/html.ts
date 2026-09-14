export function plainTextFromHtml(source: string): string {
  return source.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
