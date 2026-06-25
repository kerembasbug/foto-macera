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
  { label: '1 sn', stops: 7 },
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
  { id: 'sunny', label: 'Güneşli', emoji: '☀️', required: -2 },
  { id: 'cloudy', label: 'Bulutlu', emoji: '⛅', required: 1 },
  { id: 'sunset', label: 'Gün batımı', emoji: '🌅', required: 5 },
  { id: 'night', label: 'Gece', emoji: '🌙', required: 9 },
]

// HAZIR AYARLAR (presets) — her biri bir konuyu öğretir, sonuç da güzel çıkar.
export const PRESETS = [
  { id: 'portrait', label: 'Portre', emoji: '👧', tip: 'Arka planı eritip yüzü öne çıkarır', a: 1, s: 0, i: 0, scene: 'cloudy' },
  { id: 'sport', label: 'Spor', emoji: '⚽', tip: 'Hızlı perdeyle hareketi dondurur', a: 4, s: 0, i: 0, scene: 'sunny' },
  { id: 'landscape', label: 'Manzara', emoji: '🏞️', tip: 'Her şey baştan sona net', a: 7, s: 3, i: 0, scene: 'sunny' },
  { id: 'night', label: 'Gece', emoji: '🌙', tip: 'Çok ışık toplar, ISO yükselir', a: 1, s: 4, i: 4, scene: 'night' },
]

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// Tüm efektleri tek yerden hesaplar.
export function computeEffects({ aperture, shutter, iso, scene, moving }) {
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

  // Arka plan bulanıklığı (alan derinliği): geniş diyafram (küçük f) = çok bulanık.
  const bgBlur = clamp((a.stops + 1) * 2.3, 0.4, 14)

  // Gren (ISO gürültüsü): yüksek ISO = daha kumlu.
  const noise = clamp((i.stops / 5) * 0.6, 0, 0.6)

  // Hareket bulanıklığı: yavaş perde + hareket eden konu = bulanık.
  const motionBlur = moving ? clamp((s.stops + 3) * 1.7, 0, 18) : 0

  return {
    a, s, i, sc,
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
  if (net >= 1.5) return { key: 'bright', text: 'Çok parlak — fazla ışık girdi! ☀️', color: '#ffb02e' }
  if (net <= -1.5) return { key: 'dark', text: 'Çok karanlık — yeterli ışık yok 🌑', color: '#5a6b8c' }
  if (Math.abs(net) <= 0.5) return { key: 'perfect', text: 'Harika! Pozlama tam kıvamında 🎉', color: '#3ddc84' }
  return { key: 'ok', text: net > 0 ? 'Birazcık parlak 🙂' : 'Birazcık karanlık 🙂', color: '#9bd1ff' }
}
