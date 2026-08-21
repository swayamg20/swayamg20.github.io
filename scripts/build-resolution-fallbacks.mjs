import { copyFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const repositoryRoot = path.resolve(scriptDirectory, '..')
const distDirectory = path.join(repositoryRoot, 'dist')
const sourceEntry = path.join(distDirectory, 'index.html')

const legacyEntries = [
  'work.html',
  'writing.html',
  'about.html',
  'college.html',
  'project.html',
]

const articleSlugs = [
  'intelligence-at-the-speed-of-speech',
  'indexeddb-lottie-persistence',
  'multi-target-javascript-sdk-build-tooling',
  'voice-travel-agent-openclaw',
]

try {
  const sourceStats = await stat(sourceEntry)
  if (!sourceStats.isFile()) {
    throw new Error(`${sourceEntry} is not a file.`)
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error(
      `Cannot create route fallbacks: ${sourceEntry} is missing. Run the Vite build first.`,
      { cause: error },
    )
  }
  throw error
}

const fallbackEntries = [
  ...legacyEntries,
  ...articleSlugs.map((slug) => path.join('articles', slug, 'index.html')),
  '404.html',
]

for (const relativeEntry of fallbackEntries) {
  const destination = path.join(distDirectory, relativeEntry)
  await mkdir(path.dirname(destination), { recursive: true })
  await copyFile(sourceEntry, destination)
}

console.log(
  `Created ${fallbackEntries.length} React route fallbacks in dist (${legacyEntries.length} legacy, ${articleSlugs.length} articles, 1 catch-all).`,
)
