import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, sep, posix } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ---- Настройки ----
const PROJECT_ROOT = join(__dirname, '..')
const DIST_DIR = join(PROJECT_ROOT, 'dist')
const TEMPLATE_PATH = join(__dirname, 'manifest.template.xml')
const OUTPUT_PATH = join(DIST_DIR, 'imsmanifest.xml')

const RESOURCE_ID = 'resource-1'
const ENTRY_POINT = 'index.html'
// Файлы, которые не нужно включать в манифест
const EXCLUDE = new Set([])

// ---- Утилиты ----
/** Рекурсивно обходит папку и возвращает список относительных путей (posix-стиль) */
function walk(dir, baseDir = dir) {
  const result = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      result.push(...walk(full, baseDir))
    } else {
      const rel = relative(baseDir, full).split(sep).join(posix.sep)
      if (!EXCLUDE.has(rel)) result.push(rel)
    }
  }
  return result
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

// ---- Основная логика ----
function main() {
  if (!existsSync(DIST_DIR)) {
    console.error(`❌ Папка сборки не найдена: ${DIST_DIR}`)
    console.error('   Сначала выполните `npm run build`.')
    process.exit(1)
  }

  const files = walk(DIST_DIR).sort()

  if (!files.includes(ENTRY_POINT)) {
    console.error(`❌ Точка входа "${ENTRY_POINT}" не найдена в ${DIST_DIR}`)
    process.exit(1)
  }

  const fileLines = files.map(f => `      <file href="${escapeXml(f)}"/>`).join('\n')

  const resourcesXml = `  <resources>
    <resource identifier="${RESOURCE_ID}" type="webcontent" adlcp:scormType="sco" href="${escapeXml(ENTRY_POINT)}">
${fileLines}
    </resource>
  </resources>`

  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  if (!template.includes('{{RESOURCES}}')) {
    console.error('❌ В шаблоне отсутствует плейсхолдер {{RESOURCES}}')
    process.exit(1)
  }

  const output = template.replace('{{RESOURCES}}', resourcesXml)
  writeFileSync(OUTPUT_PATH, output, 'utf8')

  console.log(`✅ Манифест сгенерирован: ${relative(PROJECT_ROOT, OUTPUT_PATH)}`)
  console.log(`   Файлов в ресурсе: ${files.length}`)
}

main()
