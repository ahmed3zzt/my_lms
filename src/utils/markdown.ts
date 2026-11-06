export interface TocItem {
  id: string
  text: string
  level: number
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const items: TocItem[] = []
  let match: RegExpExecArray | null

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const rawText = match[2].trim()
    // Strip markdown formatting if any inside heading (bold, backticks)
    const cleanText = rawText.replace(/[*`_]/g, '')
    const id = slugify(cleanText)
    items.push({ id, text: cleanText, level })
  }

  return items
}

/**
 * Pre-processes GitHub Flavored Callouts into structured HTML blocks
 * Supported: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
 */
export function processCallouts(markdown: string): string {
  const calloutRegex = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*(?:\n|$))*)/gim

  return markdown.replace(calloutRegex, (_, type, body) => {
    const cleanBody = body
      .split('\n')
      .map((line: string) => line.replace(/^>\s?/, ''))
      .join('\n')
      .trim()

    const lowerType = type.toLowerCase()
    return `\n:::callout{type="${lowerType}"}\n${cleanBody}\n:::\n`
  })
}
