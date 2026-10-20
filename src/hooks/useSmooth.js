import { useEffect, useRef, useState } from 'react'

// Bir sayıyı hedefe doğru yumuşakça kaydırır (kaydırıcı oynatınca vizör "pat" diye değil,
// akarak değişsin diye). Sadece değişim varken çalışır; durunca hiç işlem yapmaz.
const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function useSmooth(target, { speed = 0.2, eps = 0.004 } = {}) {
  const [v, setV] = useState(target)
  const cur = useRef(target)

  useEffect(() => {
    if (reduce) { cur.current = target; setV(target); return }
    let raf
    const step = () => {
      const d = target - cur.current
      if (Math.abs(d) <= eps) { cur.current = target; setV(target); return }
      cur.current += d * speed
      setV(cur.current)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, speed, eps])

  return v
}
