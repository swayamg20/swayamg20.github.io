const articleFiles = import.meta.glob('./articles/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

function getSlugFromPath(filePath) {
  const fileName = filePath.split('/').pop() ?? ''
  return fileName.replace(/\.md$/i, '')
}

function toTimestamp(dateValue) {
  const parsed = new Date(dateValue)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

function parseScalar(value) {
  const trimmed = value.trim()
  if (trimmed === 'true') {
    return true
  }
  if (trimmed === 'false') {
    return false
  }
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(rawContent) {
  if (!rawContent.startsWith('---\n')) {
    return { data: {}, content: rawContent }
  }

  const endOfFrontmatter = rawContent.indexOf('\n---', 4)
  if (endOfFrontmatter === -1) {
    return { data: {}, content: rawContent }
  }

  const frontmatterBlock = rawContent.slice(4, endOfFrontmatter).trim()
  const content = rawContent.slice(endOfFrontmatter + 4).trimStart()
  const data = {}

  for (const line of frontmatterBlock.split('\n')) {
    const cleanLine = line.trim()
    if (!cleanLine || cleanLine.startsWith('#')) {
      continue
    }

    const separatorIndex = cleanLine.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = cleanLine.slice(0, separatorIndex).trim()
    const value = cleanLine.slice(separatorIndex + 1)
    if (!key) {
      continue
    }

    data[key] = parseScalar(value)
  }

  return { data, content }
}

export const allArticles = Object.entries(articleFiles)
  .map(([filePath, rawContent]) => {
    if (filePath.endsWith('/README.md')) {
      return null
    }

    const { data, content } = parseFrontmatter(rawContent)
    const fallbackSlug = getSlugFromPath(filePath)
    const slug = data.slug ?? fallbackSlug

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? '',
      readTime: data.readTime ?? '',
      summary: data.summary ?? data.subtitle ?? '',
      coverImage: data.coverImage ?? '',
      heroLabel: data.heroLabel ?? '',
      subtitle: data.subtitle ?? '',
      authorName: data.authorName ?? '',
      authorMeta: data.authorMeta ?? '',
      tags: data.tags ?? '',
      externalUrl: data.externalUrl ?? '',
      draft: data.draft === true,
      body: content.trim(),
      sortTimestamp: toTimestamp(data.date),
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.sortTimestamp - a.sortTimestamp)

export const articles = allArticles.filter((article) => !article.draft)

export function findArticleBySlug(slug) {
  return allArticles.find((article) => article.slug === slug) ?? null
}
