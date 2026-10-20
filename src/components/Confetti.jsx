import { useEffect, useRef } from 'react'

// Kutlama konfetisi — tek bir <canvas>, kütüphanesiz. Takıldığı an patlar, ~3 sn sonra kendini temizler.
const COLORS = ['#4ea1ff', '#f4b740', '#3ddc84', '#ff6f91', '#b07bff', '#ffffff']
const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Confetti({ count = 140, origin = { x: 0.5, y: 0.35 }, duration = 3200 }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return
    const cv = ref.current
    const c = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      cv.width = cv.clientWidth * dpr
      cv.height = cv.clientHeight * dpr
    }
    resize()
    const W = () => cv.width, H = () => cv.height

    const parts = Array.from({ length: count }, () => {
      const a = Math.random() * Math.PI * 2
      const sp = (4 + Math.random() * 9) * dpr
      return {
        x: origin.x * W(), y: origin.y * H(),
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6 * dpr,
        w: (6 + Math.random() * 6) * dpr, h: (3 + Math.random() * 4) * dpr,
        r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        star: Math.random() < 0.18,
      }
    })

    const start = performance.now()
    let raf
    const frame = (now) => {
      const t = now - start
      c.clearRect(0, 0, W(), H())
      const fade = t > duration - 700 ? Math.max(0, (duration - t) / 700) : 1
      for (const p of parts) {
        p.vy += 0.28 * dpr
        p.vx *= 0.99; p.vy *= 0.99
        p.x += p.vx; p.y += p.vy; p.r += p.vr
        c.save()
        c.globalAlpha = fade
        c.translate(p.x, p.y); c.rotate(p.r)
        c.fillStyle = p.color
        if (p.star) {
          c.beginPath()
          for (let i = 0; i < 10; i++) {
            const rr = i % 2 ? p.w * 0.35 : p.w * 0.8
            const ang = (Math.PI / 5) * i
            c.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr)
          }
          c.fill()
        } else {
          c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)))
        }
        c.restore()
      }
      if (t < duration) raf = requestAnimationFrame(frame)
      else c.clearRect(0, 0, W(), H())
    }
    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [count, origin.x, origin.y, duration])

  return <canvas ref={ref} className="confetti-canvas" aria-hidden="true" />
}
