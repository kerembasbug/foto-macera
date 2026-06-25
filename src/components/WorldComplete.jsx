import { WORLDS, levelsByWorld } from '../game.js'

export default function WorldComplete({ worldId, starsOf, onContinue }) {
  const world = WORLDS.find((w) => w.id === worldId)
  const levels = levelsByWorld(worldId)
  const earned = levels.reduce((a, l) => a + starsOf(l.id), 0)
  const max = levels.length * 3

  return (
    <div className="wc-overlay">
      <div className="wc-card">
        <div className="wc-confetti" aria-hidden="true">
          {['🎉','✨','⭐','🌟','🎊','💫','🎈','⭐','🎉','✨'].map((e, i) => (
            <span key={i} className="confetti-piece" style={{ '--i': i }}>{e}</span>
          ))}
        </div>

        <div className="wc-world-emoji">{world.emoji}</div>
        <h2 className="wc-title">{world.name}</h2>
        <p className="wc-tagline">tamamlandı!</p>

        <div className="wc-stars">
          {Array.from({ length: max }).map((_, i) => (
            <span key={i} className={`wc-star ${i < earned ? 'on' : ''}`}>★</span>
          ))}
        </div>
        <p className="wc-score">{earned} / {max} yıldız</p>

        <button className="wc-btn" onClick={onContinue}>Devam Et →</button>
      </div>
    </div>
  )
}
