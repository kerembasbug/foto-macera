import { tx, localizeAll } from './i18n.js'

// ───────────────────────────────────────────────────────────
//  FOTO MACERA — oyunun kurgusu: dünyalar, bölümler, puanlama
// ───────────────────────────────────────────────────────────

export const WORLDS = [
  { id: 'w1', name: ['Diyafram Dünyası', 'Aperture World'], emoji: '🔵', color: '#4ea1ff', tagline: ['Bulanık arka plan & derinlik', 'Blurry backgrounds & depth'], bg: `${import.meta.env.BASE_URL}world-aperture.webp` },
  { id: 'w2', name: ['Hız Dünyası', 'Speed World'], emoji: '⏱️', color: '#ff8c42', tagline: ['Hareketi yakala', 'Catch the motion'], bg: `${import.meta.env.BASE_URL}world-speed.webp` },
  { id: 'w3', name: ['Işık Dünyası', 'Light World'], emoji: '✨', color: '#b07bff', tagline: ['Az ışıkla çekim', 'Shooting in low light'], bg: `${import.meta.env.BASE_URL}world-light.webp` },
  { id: 'w4', name: ['Zum Dünyası', 'Zoom World'], emoji: '🔭', color: '#3ddc84', tagline: ['Yakınlaştır, uzaklaştır', 'Zoom in, zoom out'], banner: { art: 'birdtree', scene: 'sunny' } },
  { id: 'w5', name: ['Renk Dünyası', 'Color World'], emoji: '🎨', color: '#ff6f91', tagline: ['Işığın rengini yakala', 'Catch the color of light'], banner: { art: 'forest', scene: 'shade' } },
]

localizeAll(WORLDS, ['name', 'tagline'])

// goals: exposure her zaman var. dof: 'shallow'|'deep'. motion: 'freeze'|'blur'. lowNoise: true
// par: ustanın önerdiği ayar (ipucu) — indeksler camera.js dizilerine göre.
export const LEVELS = [
  // ── Dünya 1: Diyafram ──
  {
    id: 'l1', world: 'w1', title: ['Portre Zamanı', 'Portrait Time'], emoji: '👧',
    brief: ['Arkadaşının portresini çek: yüzü net, arka planı erit!', "Take your friend's portrait: sharp face, melted background!"],
    tip: ['Diyaframı sonuna kadar aç (küçük f sayısı) → arka plan bulanıklaşır.', 'Open the aperture all the way (small f-number) and the background goes blurry.'],
    art: 'garden', scene: 'cloudy', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 2, s: 1, i: 0 },
  },
  {
    id: 'l2', world: 'w1', title: ['Her Şey Net', 'Everything Sharp'], emoji: '🏞️',
    brief: ['Baştan sona pırıl pırıl net bir manzara çek.', 'Shoot a landscape that is crisp from front to back.'],
    tip: ['Diyaframı kıs (büyük f sayısı, f/11–f/16) → her yer netleşir.', 'Close the aperture (big f-number, f/11–f/16) and everything gets sharp.'],
    art: 'valley', scene: 'sunny', moving: false,
    goals: { exposure: true, dof: 'deep' }, par: { a: 7, s: 3, i: 0 },
  },
  {
    id: 'l3', world: 'w1', title: ['Makro Büyüsü', 'Macro Magic'], emoji: '🌸',
    brief: ['Gün batımında uğur böceğine odaklan, arka planı tamamen erit.', 'Focus on the ladybug at sunset and melt the background completely.'],
    tip: ['En geniş diyafram (f/1.4–f/2). Karardıkça perdeyi biraz yavaşlat.', 'Use the widest aperture (f/1.4–f/2). As it gets darker, slow the shutter a little.'],
    art: 'macro', scene: 'sunset', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 1, s: 4, i: 0 },
  },
  // ── Dünya 2: Hız ──
  {
    id: 'l4', world: 'w2', title: ['Kelebeği Dondur', 'Freeze the Butterfly'], emoji: '🦋',
    brief: ['Uçan kelebeği net, donmuş gibi yakala!', 'Catch the flying butterfly sharp, as if frozen!'],
    tip: ['Perdeyi hızlandır (1/1000). Işık azalırsa diyaframı aç.', 'Speed up the shutter (1/1000). If it gets too dark, open the aperture.'],
    art: 'meadow', scene: 'sunny', moving: true,
    goals: { exposure: true, motion: 'freeze' }, par: { a: 4, s: 0, i: 0 },
  },
  {
    id: 'l5', world: 'w2', title: ['Hareket İzi', 'Motion Trail'], emoji: '💨',
    brief: ['Yavaş perdeyle uçan martının izini bilerek bulanıklaştır.', "Use a slow shutter to blur the flying seagull's trail on purpose."],
    tip: ['Perdeyi yavaşlat (1/15). Fazla ışığı diyaframı kısarak dengele.', 'Slow the shutter (1/15). Balance the extra light by closing the aperture.'],
    art: 'beach', scene: 'sunset', moving: true,
    goals: { exposure: true, motion: 'blur' }, par: { a: 5, s: 6, i: 2 },
  },
  {
    id: 'l6', world: 'w2', title: ['Spor Fotoğrafçısı', 'Sports Photographer'], emoji: '⚽',
    brief: ['Uçan topu dondur HEM arka planı erit. Usta işi!', 'Freeze the flying ball AND melt the background. A pro move!'],
    tip: ['Diyaframı f/2’ye aç, perdeyi en hızlıya (1/1000) çek. Bulutlu havada ışık tam kıvamında.', 'Open the aperture to f/2 and use the fastest shutter (1/1000). On a cloudy day the light is just right.'],
    art: 'stadium', scene: 'cloudy', moving: true,
    goals: { exposure: true, motion: 'freeze', dof: 'shallow' }, par: { a: 1, s: 0, i: 0 },
  },
  // ── Dünya 3: Işık ──
  {
    id: 'l7', world: 'w3', title: ['Gece Çekimi', 'Night Shot'], emoji: '🌙',
    brief: ['Gece şehrinde, banktaki kediyi doğru aydınlatılmış çek.', 'In the city at night, take a well-lit photo of the cat on the bench.'],
    tip: ['Çok ışık topla: diyaframı aç, perdeyi yavaşlat, ISO’yu yükselt.', 'Gather lots of light: open the aperture, slow the shutter, raise the ISO.'],
    art: 'city', scene: 'night', moving: false,
    goals: { exposure: true }, par: { a: 1, s: 4, i: 4 },
  },
  {
    id: 'l8', world: 'w3', title: ['Temiz Kal', 'Keep It Clean'], emoji: '✨',
    brief: ['Loş ışıkta yelkenliyi çek ama görüntü grenli (kumlu) olmasın!', "Shoot the sailboat in dim light, but don't let the photo get grainy!"],
    tip: ['ISO’yu yükseltmek yerine diyaframı aç ve perdeyi yavaşlat.', 'Instead of raising the ISO, open the aperture and slow the shutter.'],
    art: 'lake', scene: 'sunset', moving: false,
    goals: { exposure: true, lowNoise: true }, par: { a: 1, s: 4, i: 0 },
  },
  {
    id: 'l9', world: 'w3', title: ['Gece Portresi', 'Night Portrait'], emoji: '🌟',
    brief: ['Işıkların önünde gece portresi: doğru ışık + eriyen arka plan. Final!', 'A night portrait in front of the lights: right exposure + melted background. The finale!'],
    tip: ['Geniş diyafram hem ışık toplar hem arkadaki ışıkları kocaman yumuşak dairelere (bokeh) çevirir.', 'A wide aperture gathers light and turns the lights behind into big soft circles (bokeh).'],
    art: 'fairy', scene: 'night', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 1, s: 4, i: 4 },
  },

  // ── Dünya 4: Zum ──
  {
    id: 'l10', world: 'w4', title: ['Uzaktaki Kuş', 'The Faraway Bird'], emoji: '🐦',
    brief: ['Daldaki küçük kuşu kadraja doldur — ama titretme!', 'Fill the frame with the little bird on the branch, but no shaking!'],
    tip: ['Zumu sonuna kadar aç (135–200 mm). Uzun lensle perde en az 1/250 olmalı, yoksa kare titrer.', 'Zoom all the way in (135–200 mm). With a long lens the shutter must be at least 1/250, or the photo shakes.'],
    art: 'birdtree', scene: 'sunny', moving: false, zoom: true,
    goals: { exposure: true, frame: 'tight', steady: true }, par: { a: 5, s: 1, i: 0, f: 5 },
  },
  {
    id: 'l11', world: 'w4', title: ['Geniş Açı', 'Wide Angle'], emoji: '🏔️',
    brief: ['Vadiyi tek kareye sığdır: dağlar, köy ve tabela — hepsi görünsün, hepsi net!', 'Fit the whole valley in one shot: mountains, village and sign, all visible and all sharp!'],
    tip: ['En geniş açıya (24 mm) dön ve diyaframı kıs (f/11–f/16).', 'Go to the widest angle (24 mm) and close the aperture (f/11–f/16).'],
    art: 'valley', scene: 'sunny', moving: false, zoom: true,
    goals: { exposure: true, frame: 'wide', dof: 'deep' }, par: { a: 7, s: 3, i: 0, f: 0 },
  },
  {
    id: 'l12', world: 'w4', title: ['Portre Lensi', 'Portrait Lens'], emoji: '👦',
    brief: ['85 mm portre lensiyle arkadaşını çek: yüz kadrajı doldursun, arka plan erisin.', 'Shoot your friend with an 85 mm portrait lens: the face fills the frame, the background melts.'],
    tip: ['Zumu 85 mm’ye getir ve diyaframı aç. Bulutlu havada 1/1000 perde ışığı dengeler.', 'Set the zoom to 85 mm and open the aperture. On a cloudy day a 1/1000 shutter balances the light.'],
    art: 'garden', scene: 'cloudy', moving: false, zoom: true,
    goals: { exposure: true, frame: 'portrait', dof: 'shallow' }, par: { a: 1, s: 0, i: 0, f: 3 },
  },
  // ── Dünya 5: Renk (beyaz dengesi) ──
  {
    id: 'l13', world: 'w5', title: ['Ampul Işığı', 'Light Bulb Glow'], emoji: '💡',
    brief: ['Ampul ışığı fotoğrafı turuncu yapar. Beyaz dengesini ayarla, renkler doğal görünsün!', 'Light bulbs make photos orange. Set the white balance so the colors look natural!'],
    tip: ['Beyaz dengesini “Ampul” (2800 K) yap. İç mekân loş: diyaframı aç, ISO’yu biraz yükselt.', 'Set the white balance to “Bulb” (2800 K). Indoors is dim: open the aperture and raise the ISO a little.'],
    art: 'room', scene: 'indoor', moving: false, wb: true, lightK: 2800,
    goals: { exposure: true, color: 'neutral' }, par: { a: 1, s: 3, i: 2, w: 0 },
  },
  {
    id: 'l14', world: 'w5', title: ['Gölgede Kal', 'Stay in the Shade'], emoji: '🦊',
    brief: ['Gölge ışığı fotoğrafı mavimsi yapar. Tilkiyi doğal renkleriyle çek!', 'Shade makes photos bluish. Shoot the fox in its natural colors!'],
    tip: ['Beyaz dengesini “Gölge” (8000 K) yap.', 'Set the white balance to “Shade” (8000 K).'],
    art: 'forest', scene: 'shade', moving: false, wb: true, lightK: 8000,
    goals: { exposure: true, color: 'neutral' }, par: { a: 3, s: 3, i: 0, w: 4 },
  },
  {
    id: 'l15', world: 'w5', title: ['Altın Saat', 'Golden Hour'], emoji: '🌅',
    brief: ['Gün batımını daha da sıcak, altın renkli yap — bilerek!', 'Make the sunset even warmer and more golden, on purpose!'],
    tip: ['Beyaz dengesini “Gölge”ye çek: makine ışığı soğuk sanır ve kareyi ısıtır. Yaratıcı bir hile!', 'Set the white balance to “Shade”: the camera thinks the light is cold and warms the photo. A creative trick!'],
    art: 'valley', scene: 'sunset', moving: false, wb: true, lightK: 3800,
    goals: { exposure: true, color: 'warm' }, par: { a: 2, s: 4, i: 1, w: 4 },
  },
]
localizeAll(LEVELS, ['title', 'brief', 'tip'])

// ── Rozetler (başarımlar) ──
export const BADGES = [
  { id: 'first', emoji: '🎬', name: ['İlk Kare', 'First Shot'], desc: ['İlk yıldızını kazan', 'Earn your first star'] },
  { id: 'perfect', emoji: '💯', name: ['Mükemmeliyetçi', 'Perfectionist'], desc: ['Bir bölümde 3 yıldız al', 'Get 3 stars on a level'] },
  { id: 'shutterbug', emoji: '📷', name: ['Deklanşör Delisi', 'Shutterbug'], desc: ['10 fotoğraf çek', 'Take 10 photos'] },
  { id: 'w1', emoji: '🔵', name: ['Diyafram Ustası', 'Aperture Master'], desc: ['Diyafram Dünyası’nı bitir', 'Finish Aperture World'] },
  { id: 'w2', emoji: '⏱️', name: ['Hız Ustası', 'Speed Master'], desc: ['Hız Dünyası’nı bitir', 'Finish Speed World'] },
  { id: 'w3', emoji: '✨', name: ['Işık Ustası', 'Light Master'], desc: ['Işık Dünyası’nı bitir', 'Finish Light World'] },
  { id: 'w4', emoji: '🔭', name: ['Zum Ustası', 'Zoom Master'], desc: ['Zum Dünyası’nı bitir', 'Finish Zoom World'] },
  { id: 'w5', emoji: '🎨', name: ['Renk Ustası', 'Color Master'], desc: ['Renk Dünyası’nı bitir', 'Finish Color World'] },
  { id: 'crown', emoji: '🎖️', name: ['Usta Fotoğrafçı', 'Pro Photographer'], desc: ['5 görevde Usta tacı kazan', 'Win the Pro crown on 5 levels'] },
  { id: 'album', emoji: '📔', name: ['Albüm Ustası', 'Album Master'], desc: ['Her görevin fotoğrafını çek', 'Take a photo on every level'] },
  { id: 'allstars', emoji: '👑', name: ['Yıldız Kralı', 'Star Champion'], desc: ['Tüm yıldızları topla', 'Collect every star'] },
]
localizeAll(BADGES, ['name', 'desc'])
export const getBadge = (id) => BADGES.find((b) => b.id === id)

// Kazanılmış rozetlerin id listesini hesaplar.
export function earnedBadgeIds({ stars, shots, totalStars, albumCount = 0, crownCount = 0 }) {
  const ids = []
  const vals = Object.values(stars)
  const worldDone = (w) => levelsByWorld(w).every((l) => (stars[l.id] ?? 0) >= 1)
  if (totalStars >= 1) ids.push('first')
  if (vals.some((v) => v >= 3)) ids.push('perfect')
  if (shots >= 10) ids.push('shutterbug')
  if (worldDone('w1')) ids.push('w1')
  if (worldDone('w2')) ids.push('w2')
  if (worldDone('w3')) ids.push('w3')
  if (worldDone('w4')) ids.push('w4')
  if (worldDone('w5')) ids.push('w5')
  if (crownCount >= 5) ids.push('crown')
  if (albumCount >= LEVELS.length) ids.push('album')
  if (totalStars >= LEVELS.length * 3) ids.push('allstars')
  return ids
}

// Güne göre deterministik görev seçer (aynı gün herkese aynı görev).
export function dailyLevelId(dateStr) {
  let h = 0
  for (let i = 0; i < dateStr.length; i++) h = (h * 31 + dateStr.charCodeAt(i)) >>> 0
  return LEVELS[h % LEVELS.length].id
}

export const levelsByWorld = (worldId) => LEVELS.filter((l) => l.world === worldId)
export const getLevel = (id) => LEVELS.find((l) => l.id === id)
export const levelIndex = (id) => LEVELS.findIndex((l) => l.id === id)
export const nextLevelId = (id) => LEVELS[levelIndex(id) + 1]?.id ?? null

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

// ── Tek bir çekimi puanlar ──
// Usta modu: ipucu ve ışık ölçer yok, yıldız eşikleri daha sıkı.
const THRESHOLDS = { easy: [85, 65, 45], master: [92, 75, 55] }

export function scoreShot(level, fx, { master = false } = {}) {
  const g = level.goals
  const parts = []

  parts.push(exposurePart(fx.net))
  if (g.dof === 'shallow') parts.push(shallowPart(fx.bgBlur))
  if (g.dof === 'deep') parts.push(deepPart(fx.bgBlur))
  if (g.motion === 'freeze') parts.push(freezePart(fx.motionBlur))
  if (g.motion === 'blur') parts.push(blurPart(fx.motionBlur))
  if (g.lowNoise) parts.push(noisePart(fx.noise))
  if (g.frame) parts.push(framePart(fx.focalIdx ?? 2, g.frame))
  if (g.steady) parts.push(steadyPart(fx.shake))
  if (g.color === 'neutral') parts.push(neutralPart(fx.cast))
  if (g.color === 'warm') parts.push(warmPart(fx.cast))

  const total = Math.round(parts.reduce((a, p) => a + p.score, 0) / parts.length)
  const [t3, t2, t1] = master ? THRESHOLDS.master : THRESHOLDS.easy
  const stars = total >= t3 ? 3 : total >= t2 ? 2 : total >= t1 ? 1 : 0
  return { total, stars, parts }
}

const mk = (label, score, okMsg, badMsg) => ({
  label,
  score: Math.round(clamp(score, 0, 100)),
  ok: score >= 65,
  msg: score >= 65 ? okMsg : badMsg,
})

function exposurePart(net) {
  const s = 100 - Math.abs(net) * 28
  return mk(tx('Pozlama', 'Exposure'), s, tx('Işık tam kıvamında! 🎯', 'The light is just right! 🎯'),
    net > 0 ? tx('Pozlama biraz fazla parlak kaçtı.', 'The photo came out a bit too bright.') : tx('Pozlama biraz karanlık kaçtı.', 'The photo came out a bit too dark.'))
}
function shallowPart(bgBlur) {
  const s = ((bgBlur - 2) / (11 - 2)) * 100
  return mk(tx('Bulanık arka plan', 'Blurry background'), s, tx('Arka plan güzelce eridi! 😍', 'The background melted beautifully! 😍'), tx('Arka plan yeterince erimedi — diyaframı daha aç.', 'The background is not blurry enough. Open the aperture more.'))
}
function deepPart(bgBlur) {
  const s = ((6 - bgBlur) / (6 - 0.4)) * 100
  return mk(tx('Baştan sona netlik', 'Sharp front to back'), s, tx('Her şey pırıl pırıl net! 🔍', 'Everything is crystal clear! 🔍'), tx('Arka plan bulanık kaldı — diyaframı kıs.', 'The background is still blurry. Close the aperture.'))
}
function freezePart(motionBlur) {
  const s = ((6 - motionBlur) / 6) * 100
  return mk(tx('Hareketi dondurma', 'Frozen motion'), s, tx('Hareket buz gibi dondu! ❄️', 'The motion is frozen solid! ❄️'), tx('Bulanık çıktı — perdeyi hızlandır.', 'It came out blurry. Use a faster shutter.'))
}
function blurPart(motionBlur) {
  const s = ((motionBlur - 3) / (12 - 3)) * 100
  return mk(tx('Hareket izi', 'Motion trail'), s, tx('Harika bir hız izi! 💫', 'What a great speed trail! 💫'), tx('İz oluşmadı — perdeyi daha yavaşlat.', 'No trail yet. Slow the shutter down more.'))
}
function noisePart(noise) {
  const s = 100 - noise * 180
  return mk(tx('Temiz görüntü', 'Clean image'), s, tx('Pırıl pırıl, gren yok! ✨', 'Super clean, no grain! ✨'), tx('Görüntü grenli — ISO’yu düşür.', 'The photo is grainy. Lower the ISO.'))
}

const FRAME_SCORES = {
  tight: [0, 10, 30, 55, 90, 100],
  wide: [100, 85, 45, 20, 5, 0],
  portrait: [5, 20, 65, 100, 75, 40],
}
const FRAME_MSG = () => ({
  tight: [tx('Kuş kadrajı dolduruyor! 🔭', 'The bird fills the frame! 🔭'), tx('Kuş çok küçük kaldı — zumu artır.', 'The bird is too small. Zoom in more.')],
  wide: [tx('Her şey kareye sığdı! 🏔️', 'Everything fits in the frame! 🏔️'), tx('Kadraj çok dar — geniş açıya dön.', 'The frame is too tight. Go back to wide angle.')],
  portrait: [tx('Tam portre kadrajı! 👦', 'A perfect portrait frame! 👦'), tx('Kadraj portre için uygun değil — 85 mm’yi dene.', 'That framing is not right for a portrait. Try 85 mm.')],
})
function framePart(idx, target) {
  const [ok, bad] = FRAME_MSG()[target]
  return mk(tx('Kadraj', 'Framing'), FRAME_SCORES[target][idx] ?? 0, ok, bad)
}
function steadyPart(shake) {
  return mk(tx('Titreme yok', 'No shake'), 100 - shake * 30, tx('Kare kaya gibi sabit! 🪨', 'Steady as a rock! 🪨'), tx('Kare titredi — uzun lensle perdeyi hızlandır.', 'The photo shook. With a long lens, use a faster shutter.'))
}
function neutralPart(cast) {
  const bad = cast > 0
    ? tx('Fotoğraf turuncu kaçtı — beyaz dengesini ışığa göre ayarla.', 'The photo turned orange. Match the white balance to the light.')
    : tx('Fotoğraf mavi kaçtı — beyaz dengesini ışığa göre ayarla.', 'The photo turned blue. Match the white balance to the light.')
  return mk(tx('Doğal renkler', 'Natural colors'), 100 - Math.abs(cast) * 0.7, tx('Renkler doğal, beyaz bembeyaz! ⚪', 'Natural colors, white looks white! ⚪'), bad)
}
function warmPart(cast) {
  return mk(tx('Sıcak renkler', 'Warm colors'), (cast / 120) * 100, tx('Altın gibi sıcacık bir kare! 🌅', 'A warm, golden photo! 🌅'), tx('Yeterince sıcak değil — beyaz dengesini daha yükseğe çek.', 'Not warm enough. Push the white balance higher.'))
}

// Yıldıza göre kısa kutlama
export function praise(stars) {
  if (stars >= 3) return tx('Mükemmel kare! Sen tam bir ustasın! 🏆', 'Perfect shot! You are a real pro! 🏆')
  if (stars === 2) return tx('Çok iyi! Birazcık daha keskinleştirebilirsin. 👏', 'Very good! You can make it a little better. 👏')
  if (stars === 1) return tx('Güzel başlangıç! Tekrar deneyip yıldız topla. 🙂', 'Nice start! Try again to collect more stars. 🙂')
  return tx('Olmadı ama pes yok! İpucuna bak ve tekrar dene. 💪', 'Not quite, but don’t give up! Check the tip and try again. 💪')
}
