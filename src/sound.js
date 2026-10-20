// Asset gerektirmeyen ses motoru (Web Audio API) + titreşim.
// Tüm sesler telefonda anında sentezlenir: dosya indirmez, çevrimdışı çalışır.

let ctx
let noiseBuf
const MUTE_KEY = 'foto-macera-mute'
const MUSIC_KEY = 'foto-macera-music'

const read = (k, def) => { try { const v = localStorage.getItem(k); return v === null ? def : v === '1' } catch { return def } }
const write = (k, v) => { try { localStorage.setItem(k, v ? '1' : '0') } catch {} }

export const isMuted = () => read(MUTE_KEY, false)
export function setMuted(v) { write(MUTE_KEY, v); if (v) stopMusic(); else if (isMusicOn()) startMusic() }
export const isMusicOn = () => read(MUSIC_KEY, true)
export function setMusicOn(v) { write(MUSIC_KEY, v); v ? startMusic() : stopMusic() }

const vibrate = (p) => { try { navigator.vibrate?.(p) } catch {} }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noise(c) {
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 0.5, c.sampleRate)
    const d = noiseBuf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  return noiseBuf
}

function tone(c, { t, freq, dur, gain = 0.2, type = 'sine', out = c.destination, glide }) {
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g); g.connect(out)
  o.start(t); o.stop(t + dur + 0.02)
}

function burst(c, { t, dur, freq, q = 1, gain = 0.3 }) {
  const src = c.createBufferSource()
  src.buffer = noise(c)
  const f = c.createBiquadFilter()
  f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f); f.connect(g); g.connect(c.destination)
  src.start(t); src.stop(t + dur + 0.02)
}

// Çan sesi: temel ton + parlak üst harmonik
function bell(c, t, freq, gain = 0.22) {
  tone(c, { t, freq, dur: 0.9, gain, type: 'sine' })
  tone(c, { t, freq: freq * 2.76, dur: 0.35, gain: gain * 0.35, type: 'sine' })
  tone(c, { t, freq: freq * 5.4, dur: 0.15, gain: gain * 0.12, type: 'sine' })
}

// Deklanşör: ayna kalkar (keskin klik) + perde açılıp kapanır (iki mekanik "klak").
export function shutterClick() {
  vibrate(28)
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  burst(c, { t, dur: 0.025, freq: 4200, q: 0.8, gain: 0.5 })
  tone(c, { t, freq: 180, dur: 0.06, gain: 0.25, type: 'triangle', glide: 90 })
  burst(c, { t: t + 0.075, dur: 0.045, freq: 2200, q: 1.2, gain: 0.45 })
  tone(c, { t: t + 0.075, freq: 140, dur: 0.07, gain: 0.2, type: 'triangle', glide: 70 })
}

// Kaydırıcı tık sesi — çok kısa ve yumuşak; arka arkaya kayınca boğmasın diye kısıtlı.
let lastTick = 0
export function tick() {
  const now = performance.now()
  if (now - lastTick < 45) return
  lastTick = now
  vibrate(4)
  if (isMuted()) return
  const c = ac(); if (!c) return
  burst(c, { t: c.currentTime, dur: 0.018, freq: 3000, q: 2, gain: 0.12 })
}

// Fotoğraf "gelişirken" yükselen ışıltı
export function developSound() {
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  ;[0, 0.18, 0.36, 0.54].forEach((d, i) => tone(c, { t: t + d, freq: 880 + i * 220, dur: 0.25, gain: 0.05 }))
}

// Yıldız başına bir çan; her yıldız bir öncekinden yüksek (do-mi-sol).
const STAR_NOTES = [523.25, 659.25, 783.99]
export function starDing(index) {
  vibrate(18)
  if (isMuted()) return
  const c = ac(); if (!c) return
  bell(c, c.currentTime, STAR_NOTES[index] ?? 1046.5)
}

// Hiç yıldız yoksa: nazik "olmadı" sesi (korkutmaz).
export function missSound() {
  vibrate(60)
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  tone(c, { t, freq: 392, dur: 0.22, gain: 0.14, type: 'triangle', glide: 330 })
  tone(c, { t: t + 0.2, freq: 330, dur: 0.3, gain: 0.14, type: 'triangle', glide: 262 })
}

// Eski API uyumu: yıldızları sırayla çalar.
export function resultSound(stars) {
  if (stars < 1) return missSound()
  for (let i = 0; i < stars; i++) setTimeout(() => starDing(i), i * 260)
}

// Rozet kazanma: parlak arpej.
export function badgeSound() {
  vibrate([15, 30, 15, 30])
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  ;[783.99, 987.77, 1318.5, 1567.98].forEach((f, i) => bell(c, t + i * 0.09, f, 0.16))
}

// Büyük kutlama (dünya bitti / 3 yıldız): yükselen fanfar.
export function fanfare() {
  vibrate([20, 40, 20, 40, 60])
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  ;[[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.38]].forEach(([f, d]) => {
    tone(c, { t: t + d, freq: f, dur: 0.5, gain: 0.12, type: 'triangle' })
    tone(c, { t: t + d, freq: f / 2, dur: 0.5, gain: 0.08, type: 'sine' })
  })
}

// ── Arka plan müziği ──
// Pentatonik (hiç "yanlış" notası olmayan) yumuşak marimba melodisi, rastgele ama uyumlu.
// Çok kısık çalar; ses kapalıysa veya müzik kapalıysa çalmaz.
let musicTimer = null
let musicGain = null
let nextNote = 0
let step = 0
const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]
const BASS = [130.81, 98.0, 110.0, 87.31] // Do - Sol - La - Fa
const BEAT = 0.32

function scheduleMusic() {
  const c = ctx
  if (!c || !musicGain) return
  while (nextNote < c.currentTime + 0.6) {
    const bar = Math.floor(step / 8) % BASS.length
    if (step % 8 === 0) tone(c, { t: nextNote, freq: BASS[bar], dur: BEAT * 7, gain: 0.5, type: 'sine', out: musicGain })
    if (step % 2 === 0 || Math.random() < 0.35) {
      const n = SCALE[Math.floor(Math.random() * SCALE.length)]
      tone(c, { t: nextNote, freq: n, dur: BEAT * 1.6, gain: 0.35, type: 'triangle', out: musicGain })
    }
    nextNote += BEAT
    step++
  }
}

export function startMusic() {
  if (musicTimer || isMuted() || !isMusicOn()) return
  const c = ac(); if (!c) return
  musicGain = c.createGain()
  musicGain.gain.setValueAtTime(0.0001, c.currentTime)
  musicGain.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 1.5)
  musicGain.connect(c.destination)
  nextNote = c.currentTime + 0.1
  step = 0
  musicTimer = setInterval(scheduleMusic, 150)
  scheduleMusic()
}

export function stopMusic() {
  if (!musicTimer) return
  clearInterval(musicTimer)
  musicTimer = null
  const g = musicGain
  if (g && ctx) {
    g.gain.cancelScheduledValues(ctx.currentTime)
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    setTimeout(() => g.disconnect(), 600)
  }
  musicGain = null
}

// Tarayıcılar sesi ancak ilk dokunuştan sonra açar: ilk dokunuşta müziği başlat.
if (typeof window !== 'undefined') {
  const kick = () => { startMusic(); window.removeEventListener('pointerdown', kick) }
  window.addEventListener('pointerdown', kick)
  // Uygulama arka plana geçince müziği durdur, geri gelince devam et.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopMusic()
    else if (ctx) startMusic()
  })
}
