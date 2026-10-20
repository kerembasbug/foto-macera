// fal.ai görsel üretim aracı.
// Anahtar KODA YAZILMAZ — ortam değişkeninden okunur:
//   FAL_KEY=xxx node scripts/gen-fal.mjs art/manifest.json [--force] [--only=dosya-adı]
//
// Liste dosyası (manifest) bir dizi öğedir:
//   { "file": "public/x.png", "prompt": "...", "size": "square",
//     "ref": "public/art/mascot.png",   // varsa: bu resmi referans alıp düzenler (karakter tutarlılığı)
//     "removeBg": true }               // varsa: arka planı şeffaf yapar
import { readFileSync, writeFileSync, existsSync } from 'fs'

const KEY = process.env.FAL_KEY
if (!KEY) {
  console.error('FAL_KEY ortam değişkeni yok. Kullanım: FAL_KEY=xxx node scripts/gen-fal.mjs <manifest.json>')
  process.exit(1)
}

const args = process.argv.slice(2)
const manifestPath = args.find((a) => !a.startsWith('--'))
const force = args.includes('--force')
const only = args.find((a) => a.startsWith('--only='))?.slice(7)
if (!manifestPath) { console.error('Manifest yolu gerekli.'); process.exit(1) }

const items = JSON.parse(readFileSync(manifestPath, 'utf8'))
const auth = { Authorization: `Key ${KEY}`, 'Content-Type': 'application/json' }

async function call(model, body) {
  const res = await fetch(`https://fal.run/${model}`, { method: 'POST', headers: auth, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(`${model} ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return res.json()
}

const dataUri = (path) => {
  const ext = path.endsWith('.png') ? 'png' : 'jpeg'
  return `data:image/${ext};base64,${readFileSync(path).toString('base64')}`
}

async function generate(item) {
  let url
  if (item.ref) {
    // Referans resmi koruyarak düzenle (aynı karakter, yeni poz/ifade)
    const out = await call('fal-ai/flux-pro/kontext', {
      prompt: item.prompt, image_url: dataUri(item.ref), output_format: 'png',
    })
    url = out.images[0].url
  } else {
    const out = await call(item.model ?? 'fal-ai/flux/schnell', {
      prompt: item.prompt, image_size: item.size ?? 'square', num_images: 1,
      num_inference_steps: item.steps ?? 4,
    })
    url = out.images[0].url
  }
  if (item.removeBg) {
    const out = await call('fal-ai/birefnet', { image_url: url })
    url = out.image.url
  }
  const img = await fetch(url)
  writeFileSync(item.file, Buffer.from(await img.arrayBuffer()))
}

let ok = 0, fail = 0
for (const item of items) {
  if (only && !item.file.includes(only)) continue
  if (!force && existsSync(item.file)) { console.log(`· atlandı (var): ${item.file}`); continue }
  try {
    process.stdout.write(`→ ${item.file} ... `)
    await generate(item)
    console.log('✓'); ok++
  } catch (e) {
    console.log('✗ ' + e.message); fail++
  }
}
console.log(`\nBitti: ${ok} üretildi, ${fail} hata.`)
