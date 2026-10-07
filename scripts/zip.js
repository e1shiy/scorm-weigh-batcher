import { bestZip } from 'bestzip'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

await bestZip({
  source: '.',
  destination: join(ROOT, 'scorm-package.zip'),
  cwd: join(ROOT, 'dist')
})

console.log('✅ Архив создан: scorm-package.zip')
