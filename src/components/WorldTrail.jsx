import { m as motion } from 'motion/react'
import Scene from '../Scene.jsx'
import Mascot from './Mascot.jsx'
import { tx } from '../i18n.js'

// Bir dünyanın bölümleri: kıvrımlı yol üzerinde fotoğraf duraklar.
// Her durak o bölümün sahnesinden küçük bir önizleme gösterir.
//  • kilitli → sisli + kilit  • sıradaki → nabız atan halka + maskot  • 3 yıldız → altın çerçeve
export default function WorldTrail({ levels, color, starsOf, isUnlocked, onPlay, crownOf = () => false }) {
  const firstOpen = levels.find((l) => isUnlocked(l.id) && starsOf(l.id) === 0)?.id

  return (
    <div className="trail" style={{ '--w': color }}>
      <svg className="trail-path" viewBox="0 0 100 300" preserveAspectRatio="none" aria-hidden="true">
        <path d="M28 40 C 90 70, 90 110, 72 150 S 10 230, 28 262" fill="none" stroke="currentColor"
          strokeWidth="2.4" strokeDasharray="1 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </svg>

      {levels.map((lv, i) => {
        const locked = !isUnlocked(lv.id)
        const s = starsOf(lv.id)
        const current = lv.id === firstOpen
        return (
          <motion.div
            key={lv.id}
            className={`trail-row ${i % 2 ? 'right' : 'left'}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08 }}
          >
            <motion.button
              className={`trail-node ${locked ? 'locked' : ''} ${s === 3 ? 'mastered' : ''} ${current ? 'current' : ''}`}
              disabled={locked}
              onClick={() => onPlay(lv.id)}
              whileTap={locked ? undefined : { scale: 0.93 }}
              aria-label={`${lv.title}${locked ? tx(' (kilitli)', ' (locked)') : `, ${s} ${tx('yıldız', 'stars')}`}`}
            >
              <span className="node-photo">
                <Scene art={lv.art} scene={lv.scene} bgBlur={lv.goals.dof === 'shallow' ? 5 : 0.6} paused />
                {locked && <span className="node-lock">🔒</span>}
              </span>
              <span className="node-num">{i + 1}</span>
              {crownOf(lv.id) && <span className="node-crown" aria-label={tx('Usta tacı', 'Pro crown')}>👑</span>}
            </motion.button>

            <div className="trail-info">
              <strong>{lv.title}</strong>
              <span className="stars">
                {[1, 2, 3].map((n) => <span key={n} className={n <= s ? 'star on' : 'star'}>★</span>)}
              </span>
              {current && <span className="trail-here">{tx('Sıradaki görev!', 'Next mission!')}</span>}
            </div>

            {current && <span className="trail-mascot"><Mascot size={44} mood="idle" /></span>}
          </motion.div>
        )
      })}
    </div>
  )
}
