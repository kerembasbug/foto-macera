import { tx, localizeAll } from './i18n.js'

// Fotoğraf makinesi simülatörünün "beyni".
// Her ayar, ışığı "diyafram kademesi" (stop) cinsinden değiştirir.
// 1 kademe (stop) = ışığın 2 katına çıkması veya yarıya inmesi demektir.

// DİYAFRAM (Aperture) — küçük f sayısı = büyük delik = daha çok ışık + bulanık arka plan
export const APERTURES = [
  { f: '1.4', stops: 5 },
  { f: '2', stops: 4 },
  { f: '2.8', stops: 3 },
  { f: '4', stops: 2 },
  { f: '5.6', stops: 1 },
  { f: '8', stops: 0 },
  { f: '11', stops: -1 },
  { f: '16', stops: -2 },
]

// ENSTANTANE (Shutter) — yavaş perde = daha çok ışık + hareket bulanıklığı
export const SHUTTERS = [
  { label: '1/1000', stops: -3 },
  { label: '1/500', stops: -2 },
  { label: '1/250', stops: -1 },
  { label: '1/125', stops: 0 },
  { label: '1/60', stops: 1 },
  { label: '1/30', stops: 2 },
  { label: '1/15', stops: 3 },
  { label: '1/8', stops: 4 },
  { label: '1/4', stops: 5 },
  { label: '1/2', stops: 6 },
  { label: ['1 sn', '1 s'], stops: 7 },
]

// ISO — yüksek ISO = daha çok ışık (hassasiyet) + grenli (kumlu) görüntü
export const ISOS = [
  { iso: 100, stops: 0 },
  { iso: 200, stops: 1 },
  { iso: 400, stops: 2 },
  { iso: 800, stops: 3 },
  { iso: 1600, stops: 4 },
  { iso: 3200, stops: 5 },
]

// ORTAM IŞIĞI — sahne ne kadar karanlıksa doğru pozlama için o kadar çok ışık toplamak gerekir.
// "required" = doğru pozlama için gereken toplam ışık kademesi.
export const SCENES = [
  { id: 'sunny', label: ['Güneşli', 'Sunny'], emoji: '☀️', required: -2 },
  { id: 'cloudy', label: ['Bulutlu', 'Cloudy'], emoji: '⛅', required: 1 },
  { id: 'sunset', label: ['Gün batımı', 'Sunset'], emoji: '🌅', required: 5 },
  { id: 'night', label: ['Gece', 'Night'], emoji: '🌙', required: 9 },
  { id: 'shade', label: ['Gölge', 'Shade'], emoji: '🌳', required: 2 },
  { id: 'indoor', label: ['İç mekân', 'Indoors'], emoji: '💡', required: 6 },
]

// ODAK UZAKLIĞI (Zum) — uzun lens: konu büyür, arka plan daha çok bulanır,
// ama el titremesine karşı daha hızlı perde ister (kural: perde ≤ 1/odak uzaklığı).
export const FOCALS = [
  { mm: 24, zoom: 1 },
  { mm: 35, zoom: 1.3 },
  { mm: 50, zoom: 1.6 },
  { mm: 85, zoom: 2.1 },
  { mm: 135, zoom: 2.8 },
  { mm: 200, zoom: 3.6 },
]

// BEYAZ DENGESİ — makineye "ışık ne renk?" diye söylersin. Yanlış söylersen fotoğraf
// turuncumsu (sıcak) ya da mavimsi (soğuk) çıkar. K = Kelvin (ışığın renk sıcaklığı).
export const WBS = [
  { id: 'tungsten', label: ['Ampul', 'Bulb'], emoji: '💡', k: 2800 },
  { id: 'fluor', label: ['Floresan', 'Fluorescent'], emoji: '🔆', k: 4000 },
  { id: 'day', label: ['Gün ışığı', 'Daylight'], emoji: '☀️', k: 5500 },
  { id: 'cloudy', label: ['Bulutlu', 'Cloudy'], emoji: '⛅', k: 6500 },
  { id: 'shade', label: ['Gölge', 'Shade'], emoji: '🌳', k: 8000 },
]

localizeAll(SHUTTERS, ['label'])
localizeAll(SCENES, ['label'])
localizeAll(WBS, ['label'])

// Serbest modda her ortamın ışık rengi
export const LIGHT_K = { sunny: 5500, cloudy: 6500, sunset: 3800, night: 4200, shade: 8000, indoor: 2800 }

// HAZIR AYARLAR (presets) — her biri bir konuyu öğretir, sonuç da güzel çıkar.
export const PRESETS = [
  { id: 'portrait', label: ['Portre', 'Portrait'], emoji: '👧', tip: ['Arka planı eritip yüzü öne çıkarır', 'Melts the background so the face stands out'], a: 1, s: 0, i: 0, scene: 'cloudy' },
  { id: 'sport', label: ['Spor', 'Sports'], emoji: '⚽', tip: ['Hızlı perdeyle hareketi dondurur', 'Freezes motion with a fast shutter'], a: 4, s: 0, i: 0, scene: 'sunny' },
  { id: 'landscape', label: ['Manzara', 'Landscape'], emoji: '🏞️', tip: ['Her şey baştan sona net', 'Everything sharp from front to back'], a: 7, s: 3, i: 0, scene: 'sunny' },
  { id: 'night', label: ['Gece', 'Night'], emoji: '🌙', tip: ['Çok ışık toplar, ISO yükselir', 'Gathers lots of light, ISO goes up'], a: 1, s: 4, i: 4, scene: 'night' },
]

localizeAll(PRESETS, ['label', 'tip'])

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Tüm efektleri tek yerden hesaplar.
export function computeEffects({ aperture, shutter, iso, scene, moving, focal = null, wb = null, lightK = null }) {
  const a = APERTURES[aperture]
  const s = SHUTTERS[shutter]
  const i = ISOS[iso]
  const sc = SCENES.find((x) => x.id === scene) ?? SCENES[0]

  // Toplanan toplam ışık (kademe). Sahnenin ihtiyacından farkı = pozlama hatası.
  const gathered = a.stops + s.stops + i.stops
  const net = gathered - sc.required // 0 = mükemmel, + = fazla parlak, - = karanlık

  // Parlaklık: her kademe ışığı 2'yle çarpar. Aşırı uçları yumuşatıyoruz.
  const brightness = clamp(Math.pow(2, net * 0.62), 0.18, 3.4)

  // Pozlama göstergesi için -3..+3 kademe arası iğne.
  const meter = clamp(net, -3, 3)

  // Lens: zum seviyesi verilmediyse sahne olduğu gibi (eski bölümler değişmez).
  const f = focal === null ? null : FOCALS[focal]
  const dofMult = f ? Math.pow(f.mm / 50, 0.6) : 1

  // Arka plan bulanıklığı (alan derinliği): geniş diyafram (küçük f) = çok bulanık.
  // Uzun lens arka planı daha da eritir.
  const bgBlur = clamp((a.stops + 1) * 2.3 * dofMult, 0.4, 18)

  // El titremesi: perde süresi 1/odak uzaklığından yavaşsa tüm kare titrer.
  const shutterSec = Math.pow(2, s.stops) / 125
  const shake = f ? clamp(Math.log2(shutterSec * f.mm) * 1.4, 0, 6) : 0

  // Beyaz dengesi kayması (mired = 1.000.000 / Kelvin): + turuncu, − mavi
  const w = wb === null ? null : WBS[wb]
  const cast = w && lightK ? 1e6 / lightK - 1e6 / w.k : 0

  // Gren (ISO gürültüsü): yüksek ISO = daha kumlu.
  const noise = clamp((i.stops / 5) * 0.6, 0, 0.6)

  // Hareket bulanıklığı: yavaş perde + hareket eden konu = bulanık.
  const motionBlur = moving ? clamp((s.stops + 3) * 1.7, 0, 18) : 0

  return {
    a, s, i, sc, f, w,
    zoom: f ? f.zoom : 1,
    focalIdx: focal,
    wbIdx: wb,
    shake,
    cast,
    net,
    brightness,
    meter,
    bgBlur,
    noise,
    motionBlur,
    verdict: verdictFor(net),
  }
}

function verdictFor(net) {
  if (net >= 1.5) return { key: 'bright', text: tx('Çok parlak — fazla ışık girdi! ☀️', 'Too bright! Too much light got in ☀️'), color: '#ffb02e' }
  if (net <= -1.5) return { key: 'dark', text: tx('Çok karanlık — yeterli ışık yok 🌑', 'Too dark! Not enough light 🌑'), color: '#5a6b8c' }
  if (Math.abs(net) <= 0.5) return { key: 'perfect', text: tx('Harika! Pozlama tam kıvamında 🎉', 'Great! The exposure is just right 🎉'), color: '#3ddc84' }
  return { key: 'ok', text: net > 0 ? tx('Birazcık parlak 🙂', 'A little bright 🙂') : tx('Birazcık karanlık 🙂', 'A little dark 🙂'), color: '#9bd1ff' }
}
