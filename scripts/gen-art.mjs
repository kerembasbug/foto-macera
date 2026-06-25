// Tek seferlik geliştirme aracı: Gemini ile dekoratif PNG üretir.
// Anahtar yalnızca ortam değişkeninden okunur, koda gömülmez.
//   GEMINI_KEY=xxx node scripts/gen-art.mjs "<prompt>" public/art/out.png
import { writeFileSync } from 'node:fs'

const KEY = process.env.GEMINI_KEY
const [, , prompt, out] = process.argv
if (!KEY || !prompt || !out) {
  console.error('Kullanım: GEMINI_KEY=xxx node scripts/gen-art.mjs "<prompt>" <out.png>')
  process.exit(1)
}

const MODEL = 'gemini-2.5-flash-image'
const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
})

if (!res.ok) {
  console.error('HTTP', res.status, await res.text())
  process.exit(1)
}

const data = await res.json()
const parts = data?.candidates?.[0]?.content?.parts ?? []
const img = parts.find((p) => p.inlineData)?.inlineData?.data
if (!img) {
  console.error('Görsel dönmedi:', JSON.stringify(data).slice(0, 500))
  process.exit(1)
}

writeFileSync(out, Buffer.from(img, 'base64'))
console.log('✓ yazıldı:', out, (Buffer.from(img, 'base64').length / 1024).toFixed(0) + ' KB')
