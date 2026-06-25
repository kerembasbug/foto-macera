// PixelAPI görsel düzenleme aracı (dosya yükler, bekler, indirir).
//   PIXEL_KEY=xxx node scripts/edit-pixelapi.mjs <endpoint> <in> <out>
//   endpoint örn: remove-background | upscale | restore-face
import { writeFileSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'

const KEY = process.env.PIXEL_KEY
const [, , endpoint, inFile, out] = process.argv
if (!KEY || !endpoint || !inFile || !out) {
  console.error('Kullanım: PIXEL_KEY=xxx node scripts/edit-pixelapi.mjs <endpoint> <in.png> <out.png>')
  process.exit(1)
}
const BASE = 'https://api.pixelapi.dev'
const auth = { Authorization: `Bearer ${KEY}`, 'User-Agent': 'FotoMacera/1.0' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const fd = new FormData()
fd.append('image', new Blob([readFileSync(inFile)]), basename(inFile))

const res = await fetch(`${BASE}/v1/image/${endpoint}`, { method: 'POST', headers: auth, body: fd })
if (!res.ok) { console.error('EDIT', res.status, await res.text()); process.exit(1) }
const job = await res.json()
const id = job.id ?? job.generation_id
console.log('• kuyrukta:', id, job.status)

let url
for (let i = 0; i < 90; i++) {
  await sleep(2000)
  const r = await fetch(`${BASE}/v1/image/${id}`, { headers: auth })
  if (!r.ok) { console.error('POLL', r.status, await r.text()); process.exit(1) }
  const j = await r.json()
  if (j.status === 'completed') { url = j.output_url; break }
  if (j.status === 'failed' || j.error) { console.error('FAILED', JSON.stringify(j)); process.exit(1) }
}
if (!url) { console.error('zaman aşımı'); process.exit(1) }

const img = await fetch(url)
const buf = Buffer.from(await img.arrayBuffer())
writeFileSync(out, buf)
console.log('✓ yazıldı:', out, (buf.length / 1024).toFixed(0) + ' KB')
