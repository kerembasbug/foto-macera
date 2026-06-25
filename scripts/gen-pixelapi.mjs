// Tek seferlik geliştirme aracı: PixelAPI ile görsel üretir/indirir.
// Anahtar yalnızca ortam değişkeninden okunur, koda gömülmez.
//   PIXEL_KEY=xxx node scripts/gen-pixelapi.mjs "<prompt>" out.png [width] [height] [model]
import { writeFileSync } from 'node:fs'

const KEY = process.env.PIXEL_KEY
const [, , prompt, out, wStr, hStr, modelArg] = process.argv
if (!KEY || !prompt || !out) {
  console.error('Kullanım: PIXEL_KEY=xxx node scripts/gen-pixelapi.mjs "<prompt>" <out.png> [w] [h] [model]')
  process.exit(1)
}
const width = Number(wStr) || 1024
const height = Number(hStr) || 1024
const model = modelArg || 'AI image generation' // en kaliteli model
const BASE = 'https://api.pixelapi.dev'
const headers = {
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FotoMacera/1.0',
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const gen = await fetch(`${BASE}/v1/image/generate`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ model, prompt, width, height, steps: 30 }),
})
if (!gen.ok) {
  console.error('GENERATE', gen.status, await gen.text())
  process.exit(1)
}
const { generation_id, status } = await gen.json()
console.log('• kuyrukta:', generation_id, status)

let url
for (let i = 0; i < 90; i++) {
  await sleep(2000)
  const r = await fetch(`${BASE}/v1/image/${generation_id}`, { headers })
  if (!r.ok) { console.error('POLL', r.status, await r.text()); process.exit(1) }
  const j = await r.json()
  if (j.status === 'completed') { url = j.output_url; break }
  if (j.status === 'failed' || j.error) { console.error('FAILED', JSON.stringify(j)); process.exit(1) }
  if (i % 3 === 0) console.log('  …', j.status)
}
if (!url) { console.error('zaman aşımı'); process.exit(1) }

const img = await fetch(url)
const buf = Buffer.from(await img.arrayBuffer())
writeFileSync(out, buf)
console.log('✓ yazıldı:', out, (buf.length / 1024).toFixed(0) + ' KB  <-', url)
