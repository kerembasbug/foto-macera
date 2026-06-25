// Asset gerektirmeyen ses motoru (Web Audio API) + titreşim.
// Deklanşör "çıt" sesi, yıldız zili ve hata sesi sentezlenir.

let ctx
const MUTE_KEY = 'foto-macera-mute'

export function isMuted() {
  try { return localStorage.getItem(MUTE_KEY) === '1' } catch { return false }
}
export function setMuted(v) {
  try { localStorage.setItem(MUTE_KEY, v ? '1' : '0') } catch {}
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) ctx = new AC()
  }
  if (ctx && ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(c, { t, freq, dur, gain = 0.25, type = 'square' }) {
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + dur)
  o.connect(g); g.connect(c.destination)
  o.start(t); o.stop(t + dur)
}

// Deklanşör: ayna kalkar (yüksek çıt) + perde kapanır (alçak çıt).
export function shutterClick() {
  if (navigator.vibrate) navigator.vibrate(28)
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  tone(c, { t, freq: 1900, dur: 0.03, gain: 0.22 })
  tone(c, { t: t + 0.07, freq: 850, dur: 0.05, gain: 0.28 })
}

// Yıldız zili: yıldız sayısı kadar yükselen nota. 0 yıldızda nazik bir uyarı.
export function resultSound(stars) {
  if (navigator.vibrate) navigator.vibrate(stars >= 1 ? [20, 40, 20] : 60)
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  if (stars < 1) {
    tone(c, { t, freq: 320, dur: 0.18, gain: 0.2, type: 'sawtooth' })
    tone(c, { t: t + 0.12, freq: 240, dur: 0.2, gain: 0.2, type: 'sawtooth' })
    return
  }
  const notes = [523, 659, 784, 1047] // do-mi-sol-do
  for (let i = 0; i < stars; i++) {
    tone(c, { t: t + i * 0.13, freq: notes[i], dur: 0.16, gain: 0.26, type: 'triangle' })
  }
}

// Rozet kazanma sesi: kısa parlak arpej.
export function badgeSound() {
  if (navigator.vibrate) navigator.vibrate([15, 30, 15, 30])
  if (isMuted()) return
  const c = ac(); if (!c) return
  const t = c.currentTime
  ;[784, 988, 1319].forEach((f, i) =>
    tone(c, { t: t + i * 0.08, freq: f, dur: 0.14, gain: 0.22, type: 'triangle' })
  )
}
