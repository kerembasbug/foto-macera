import { useEffect, useState } from 'react'
import { m as motion, AnimatePresence } from 'motion/react'
import Scene from '../Scene.jsx'
import Mascot from '../components/Mascot.jsx'
import Confetti from '../components/Confetti.jsx'
import { praise } from '../game.js'
import { badgeSound, developSound, starDing, missSound, fanfare } from '../sound.js'
import { tx } from '../i18n.js'

const DEVELOP_MS = 1300 // fotoğrafın "banyodan çıkma" süresi
const STAR_GAP = 330    // yıldızlar arası bekleme

const moodFor = (stars) => (stars >= 3 ? 'cheer' : stars === 2 ? 'happy' : stars === 1 ? 'think' : 'sad')

// Çekim sonucu — sahne sahne açılır:
//  1) fotoğraf beyazdan gelişir  2) yıldızlar tek tek patlar  3) maskot tepki verir  4) puan dökümü kayar
export default function Result({ level, fx, result, master = false, newBadges = [], onRetry, onHome, onNext, nextTitle }) {
  const [phase, setPhase] = useState('develop') // develop → stars → done
  const [shownStars, setShownStars] = useState(0)

  useEffect(() => {
    developSound()
    const timers = []
    timers.push(setTimeout(() => setPhase('stars'), DEVELOP_MS))
    for (let i = 0; i < result.stars; i++) {
      timers.push(setTimeout(() => { setShownStars(i + 1); starDing(i) }, DEVELOP_MS + 150 + i * STAR_GAP))
    }
    const end = DEVELOP_MS + 150 + Math.max(result.stars, 1) * STAR_GAP
    timers.push(setTimeout(() => {
      setPhase('done')
      if (result.stars === 0) missSound()
      if (result.stars === 3) fanfare()
    }, end))
    if (newBadges.length) timers.push(setTimeout(badgeSound, end + 500))
    return () => timers.forEach(clearTimeout)
  }, [result.stars, newBadges.length])

  const done = phase === 'done'

  return (
    <motion.div className="modal-back" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {done && result.stars === 3 && <Confetti />}
      <motion.div
        className="modal"
        initial={{ y: 40, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <div className="photo-frame">
          <motion.div
            className="develop"
            initial={{ filter: 'brightness(2.6) saturate(0) blur(7px) sepia(0.6)' }}
            animate={{ filter: 'brightness(1) saturate(1) blur(0px) sepia(0)' }}
            transition={{ duration: DEVELOP_MS / 1000, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <Scene
              art={level.art}
              bgBlur={fx.bgBlur} motionBlur={fx.motionBlur} brightness={fx.brightness}
              noise={fx.noise} moving={level.moving} scene={level.scene} paused
              zoom={fx.zoom} shake={fx.shake} cast={fx.cast}
            />
          </motion.div>
          <div className="hud">
            <span>f/{fx.a.f}</span><span>{fx.s.label}</span><span>ISO {fx.i.iso}</span>
          </div>
        </div>

        <div className="result-stars">
          {[1, 2, 3].map((n) => (
            <span key={n} className="big-star-slot">
              <span className="big-star">★</span>
              <AnimatePresence>
                {n <= shownStars && (
                  <motion.span
                    className="big-star on"
                    initial={{ scale: 0, rotate: -120 }}
                    animate={{ scale: [0, 1.45, 1], rotate: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                  >★</motion.span>
                )}
              </AnimatePresence>
            </span>
          ))}
        </div>

        <div className="result-head">
          <Mascot size={52} mood={done ? moodFor(result.stars) : 'wow'} />
          <AnimatePresence mode="wait">
            <motion.p
              key={done ? 'praise' : 'wait'}
              className="praise"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {done ? praise(result.stars) : tx('Fotoğraf banyodan çıkıyor…', 'Developing your photo…')}
            </motion.p>
          </AnimatePresence>
        </div>

        {done && master && result.stars === 3 && (
          <motion.div className="crown-win" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 360, damping: 14 }}>
            👑 {tx('Usta tacı kazandın!', 'You won the Pro crown!')}
          </motion.div>
        )}

        {done && newBadges.length > 0 && (
          <div className="new-badges">
            {newBadges.map((b, i) => (
              <motion.div
                className="new-badge" key={b.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 380, damping: 16 }}
              >
                <span className="nb-emoji">{b.emoji}</span>
                <div className="nb-text">
                  <strong>{tx('Yeni rozet!', 'New badge!')}</strong>
                  <span className="nb-name">{b.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {done && (
          <ul className="score-list">
            {result.parts.map((p, i) => (
              <motion.li
                key={p.label}
                className={p.ok ? 'good' : 'bad'}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
              >
                <span className="score-icon">{p.ok ? '✅' : '⚠️'}</span>
                <span className="score-label">{p.label}</span>
                <span className="score-msg">{p.msg}</span>
              </motion.li>
            ))}
          </ul>
        )}

        <motion.div
          className="result-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0.35 }}
          style={{ pointerEvents: done ? 'auto' : 'none' }}
        >
          <button className="ghost-btn" onClick={onHome}>{tx('Harita', 'Map')}</button>
          <button className="retry-btn" onClick={onRetry}>🔄 {tx('Tekrar Çek', 'Try Again')}</button>
          {onNext && <button className="next-btn" onClick={onNext}>{tx('Sonraki', 'Next')}: {nextTitle} →</button>}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
