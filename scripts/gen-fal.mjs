import { writeFileSync } from 'fs'

const KEY = '037feb22-253b-41a6-a651-287cdae20581:d6052d2f3287cf9fb74dc8c49fad0098'
const API = 'https://fal.run/fal-ai/flux/schnell'

const IMAGES = [
  {
    file: 'public/hero-bg.jpg',
    size: 'landscape_4_3',
    prompt: 'colorful fantasy landscape for kids photography game, magical mountains, butterflies, wildflowers, glowing sun, watercolor illustration style, vibrant colors, no text, no camera, no people',
  },
  {
    file: 'public/world-aperture.jpg',
    size: 'landscape_4_3',
    prompt: 'beautiful soft bokeh photography background, blurry dreamy garden, pink and purple flowers in focus, shallow depth of field, fairy tale style illustration, warm pastel colors, no text, no people',
  },
  {
    file: 'public/world-speed.jpg',
    size: 'landscape_4_3',
    prompt: 'dynamic motion blur action scene, colorful butterflies in flight, speed lines, vibrant streaks of light, energetic cartoon illustration style, blue and orange palette, no text, no people',
  },
  {
    file: 'public/world-light.jpg',
    size: 'landscape_4_3',
    prompt: 'magical night sky photography scene, glowing moon and stars, milky way, dark blue twilight, soft golden light, dreamy illustration style, purple and gold palette, no text, no people',
  },
  {
    file: 'public/mascot-ai.png',
    size: 'square',
    prompt: 'cute chibi camera robot mascot character, big eyes, smile, blue body, cartoon style, white background, centered, no text, flat design, high contrast',
  },
]

async function generate(item) {
  console.log(`Generating: ${item.file}`)
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Authorization': `Key ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: item.prompt, image_size: item.size, num_images: 1 }),
  })
  const json = await res.json()
  if (!json.images?.[0]?.url) throw new Error(`No image: ${JSON.stringify(json)}`)
  const url = json.images[0].url
  console.log(`  ✓ ${url}`)

  const img = await fetch(url)
  const buf = Buffer.from(await img.arrayBuffer())
  writeFileSync(item.file, buf)
  console.log(`  saved → ${item.file} (${(buf.length / 1024).toFixed(0)} KB)`)
}

for (const item of IMAGES) {
  await generate(item)
}
console.log('\nAll done!')
