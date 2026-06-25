// Pozlama göstergesi: iğne ortadaysa (yeşil) pozlama doğru,
// sağa kaçarsa fazla parlak, sola kaçarsa çok karanlık.
export default function ExposureMeter({ meter }) {
  // meter: -3..+3 kademe. -3 => %0, 0 => %50, +3 => %100
  const pct = ((meter + 3) / 6) * 100
  return (
    <div className="meter">
      <span className="meter-end">🌑</span>
      <div className="meter-bar">
        <div className="meter-zone" />
        <div className="meter-needle" style={{ left: `${pct}%` }} />
        <div className="meter-ticks">
          <span>-3</span><span>-2</span><span>-1</span>
          <span className="zero">0</span>
          <span>+1</span><span>+2</span><span>+3</span>
        </div>
      </div>
      <span className="meter-end">☀️</span>
    </div>
  )
}
