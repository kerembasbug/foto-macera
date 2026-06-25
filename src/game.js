// ───────────────────────────────────────────────────────────
//  FOTO MACERA — oyunun kurgusu: dünyalar, bölümler, puanlama
// ───────────────────────────────────────────────────────────

export const WORLDS = [
  { id: 'w1', name: 'Diyafram Dünyası', emoji: '🔵', color: '#4ea1ff', tagline: 'Bulanık arka plan & derinlik', bg: '/world-aperture.jpg' },
  { id: 'w2', name: 'Hız Dünyası', emoji: '⏱️', color: '#ff8c42', tagline: 'Hareketi yakala', bg: '/world-speed.jpg' },
  { id: 'w3', name: 'Işık Dünyası', emoji: '✨', color: '#b07bff', tagline: 'Az ışıkla çekim', bg: '/world-light.jpg' },
]

// goals: exposure her zaman var. dof: 'shallow'|'deep'. motion: 'freeze'|'blur'. lowNoise: true
// par: ustanın önerdiği ayar (ipucu) — indeksler camera.js dizilerine göre.
export const LEVELS = [
  // ── Dünya 1: Diyafram ──
  {
    id: 'l1', world: 'w1', title: 'Portre Zamanı', emoji: '👧',
    brief: 'Çiçeği ve kelebeği öne çıkar, arka planı erit!',
    tip: 'Diyaframı sonuna kadar aç (küçük f sayısı) → arka plan bulanıklaşır.',
    scene: 'cloudy', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 2, s: 1, i: 0 },
  },
  {
    id: 'l2', world: 'w1', title: 'Her Şey Net', emoji: '🏞️',
    brief: 'Baştan sona pırıl pırıl net bir manzara çek.',
    tip: 'Diyaframı kıs (büyük f sayısı, f/11–f/16) → her yer netleşir.',
    scene: 'sunny', moving: false,
    goals: { exposure: true, dof: 'deep' }, par: { a: 7, s: 3, i: 0 },
  },
  {
    id: 'l3', world: 'w1', title: 'Makro Büyüsü', emoji: '🌸',
    brief: 'Gün batımında çiçeğe odaklan, arka planı tamamen erit.',
    tip: 'En geniş diyafram (f/1.4–f/2). Karardıkça perdeyi biraz yavaşlat.',
    scene: 'sunset', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 1, s: 4, i: 0 },
  },
  // ── Dünya 2: Hız ──
  {
    id: 'l4', world: 'w2', title: 'Kelebeği Dondur', emoji: '🦋',
    brief: 'Uçan kelebeği net, donmuş gibi yakala!',
    tip: 'Perdeyi hızlandır (1/1000). Işık azalırsa diyaframı aç.',
    scene: 'sunny', moving: true,
    goals: { exposure: true, motion: 'freeze' }, par: { a: 4, s: 0, i: 0 },
  },
  {
    id: 'l5', world: 'w2', title: 'Hareket İzi', emoji: '💨',
    brief: 'Yavaş perdeyle kelebeğin uçuş izini bilerek bulanıklaştır.',
    tip: 'Perdeyi yavaşlat (1/15). Fazla ışığı diyaframı kısarak dengele.',
    scene: 'sunset', moving: true,
    goals: { exposure: true, motion: 'blur' }, par: { a: 5, s: 6, i: 2 },
  },
  {
    id: 'l6', world: 'w2', title: 'Spor Fotoğrafçısı', emoji: '⚽',
    brief: 'Hem hareketi dondur HEM arka planı erit. Usta işi!',
    tip: 'Geniş diyafram + hızlıca perde. Bulutlu havada ışık tam kıvamında.',
    scene: 'cloudy', moving: true,
    goals: { exposure: true, motion: 'freeze', dof: 'shallow' }, par: { a: 2, s: 1, i: 0 },
  },
  // ── Dünya 3: Işık ──
  {
    id: 'l7', world: 'w3', title: 'Gece Çekimi', emoji: '🌙',
    brief: 'Karanlıkta doğru aydınlatılmış bir fotoğraf çek.',
    tip: 'Çok ışık topla: diyaframı aç, perdeyi yavaşlat, ISO’yu yükselt.',
    scene: 'night', moving: false,
    goals: { exposure: true }, par: { a: 1, s: 4, i: 4 },
  },
  {
    id: 'l8', world: 'w3', title: 'Temiz Kal', emoji: '✨',
    brief: 'Loş ışıkta çek ama görüntü grenli (kumlu) olmasın!',
    tip: 'ISO’yu yükseltmek yerine diyaframı aç ve perdeyi yavaşlat.',
    scene: 'sunset', moving: false,
    goals: { exposure: true, lowNoise: true }, par: { a: 1, s: 4, i: 0 },
  },
  {
    id: 'l9', world: 'w3', title: 'Gece Portresi', emoji: '🌟',
    brief: 'Gece, hem doğru ışık hem eriyen arka plan. Final görevi!',
    tip: 'Geniş diyafram hem ışık toplar hem arka planı eritir.',
    scene: 'night', moving: false,
    goals: { exposure: true, dof: 'shallow' }, par: { a: 1, s: 4, i: 4 },
  },
]

// ── Rozetler (başarımlar) ──
export const BADGES = [
  { id: 'first', emoji: '🎬', name: 'İlk Kare', desc: 'İlk yıldızını kazan' },
  { id: 'perfect', emoji: '💯', name: 'Mükemmeliyetçi', desc: 'Bir bölümde 3 yıldız al' },
  { id: 'shutterbug', emoji: '📷', name: 'Deklanşör Delisi', desc: '10 fotoğraf çek' },
  { id: 'w1', emoji: '🔵', name: 'Diyafram Ustası', desc: 'Diyafram Dünyası’nı bitir' },
  { id: 'w2', emoji: '⏱️', name: 'Hız Ustası', desc: 'Hız Dünyası’nı bitir' },
  { id: 'w3', emoji: '✨', name: 'Işık Ustası', desc: 'Işık Dünyası’nı bitir' },
  { id: 'album', emoji: '📔', name: 'Albüm Ustası', desc: 'Her görevin fotoğrafını çek' },
  { id: 'allstars', emoji: '👑', name: 'Yıldız Kralı', desc: 'Tüm yıldızları topla' },
]
export const getBadge = (id) => BADGES.find((b) => b.id === id)

// Kazanılmış rozetlerin id listesini hesaplar.
export function earnedBadgeIds({ stars, shots, totalStars, albumCount = 0 }) {
  const ids = []
  const vals = Object.values(stars)
  const worldDone = (w) => levelsByWorld(w).every((l) => (stars[l.id] ?? 0) >= 1)
  if (totalStars >= 1) ids.push('first')
  if (vals.some((v) => v >= 3)) ids.push('perfect')
  if (shots >= 10) ids.push('shutterbug')
  if (worldDone('w1')) ids.push('w1')
  if (worldDone('w2')) ids.push('w2')
  if (worldDone('w3')) ids.push('w3')
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
export function scoreShot(level, fx) {
  const g = level.goals
  const parts = []

  parts.push(exposurePart(fx.net))
  if (g.dof === 'shallow') parts.push(shallowPart(fx.bgBlur))
  if (g.dof === 'deep') parts.push(deepPart(fx.bgBlur))
  if (g.motion === 'freeze') parts.push(freezePart(fx.motionBlur))
  if (g.motion === 'blur') parts.push(blurPart(fx.motionBlur))
  if (g.lowNoise) parts.push(noisePart(fx.noise))

  const total = Math.round(parts.reduce((a, p) => a + p.score, 0) / parts.length)
  const stars = total >= 85 ? 3 : total >= 65 ? 2 : total >= 45 ? 1 : 0
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
  const dir = net > 0 ? 'biraz fazla parlak' : 'biraz karanlık'
  return mk('Pozlama', s, 'Işık tam kıvamında! 🎯', `Pozlama ${dir} kaçtı.`)
}
function shallowPart(bgBlur) {
  const s = ((bgBlur - 2) / (11 - 2)) * 100
  return mk('Bulanık arka plan', s, 'Arka plan güzelce eridi! 😍', 'Arka plan yeterince erimedi — diyaframı daha aç.')
}
function deepPart(bgBlur) {
  const s = ((6 - bgBlur) / (6 - 0.4)) * 100
  return mk('Baştan sona netlik', s, 'Her şey pırıl pırıl net! 🔍', 'Arka plan bulanık kaldı — diyaframı kıs.')
}
function freezePart(motionBlur) {
  const s = ((6 - motionBlur) / 6) * 100
  return mk('Hareketi dondurma', s, 'Hareket buz gibi dondu! ❄️', 'Bulanık çıktı — perdeyi hızlandır.')
}
function blurPart(motionBlur) {
  const s = ((motionBlur - 3) / (12 - 3)) * 100
  return mk('Hareket izi', s, 'Harika bir hız izi! 💫', 'İz oluşmadı — perdeyi daha yavaşlat.')
}
function noisePart(noise) {
  const s = 100 - noise * 180
  return mk('Temiz görüntü', s, 'Pırıl pırıl, gren yok! ✨', 'Görüntü grenli — ISO’yu düşür.')
}

// Yıldıza göre kısa kutlama
export function praise(stars) {
  if (stars >= 3) return 'Mükemmel kare! Sen tam bir ustasın! 🏆'
  if (stars === 2) return 'Çok iyi! Birazcık daha keskinleştirebilirsin. 👏'
  if (stars === 1) return 'Güzel başlangıç! Tekrar deneyip yıldız topla. 🙂'
  return 'Olmadı ama pes yok! İpucuna bak ve tekrar dene. 💪'
}
