import { useEffect } from 'react'
import { m as motion } from 'motion/react'
import { WORLDS, levelsByWorld } from '../game.js'
import Confetti from './Confetti.jsx'
import Mascot from './Mascot.jsx'
import { fanfare } from '../sound.js'
import { tx } from '../i18n.js'

export default function WorldComplete({ worldId, starsOf, onContinue }) {
  const world = WORLDS.find((w) => w.id === worldId)
  const levels = levelsByWorld(worldId)
  const earned = levels.reduce((a, l) => a + starsOf(l.id), 0)
  const max = levels.length * 3

  useEffect(() => { const t = setTimeout(fanfare, 250); return () => clearTimeout(t) }, [])

  return (
    <motion.div className="wc-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Confetti count={200} origin={{ x: 0.5, y: 0.3 }} duration={4200} />
      <motion.div
        className="wc-card"
        initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
      >
        <Mascot size={110} mood="cheer" />
        <h2 className="wc-title" style={{ color: world.color }}>{world.name}</h2>
        <p className="wc-tagline">{tx('tamamlandı!', 'complete!')}</p>

        <div className="wc-stars">
          {Array.from({ length: max }).map((_, i) => (
            <motion.span
              key={i}
              className={`wc-star ${i < earned ? 'on' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.07, type: 'spring', stiffness: 500, damping: 14 }}
            >★</motion.span>
          ))}
        </div>
        <p className="wc-score">{earned} / {max} {tx('yıldız', 'stars')}</p>

        <button className="wc-btn" onClick={onContinue}>{tx('Devam Et →', 'Continue →')}</button>
      </motion.div>
    </motion.div>
  )
}
