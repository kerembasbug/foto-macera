import { useEffect } from 'react'
import Scene from '../Scene.jsx'
import Mascot from '../components/Mascot.jsx'
import { praise } from '../game.js'
import { badgeSound } from '../sound.js'

// Çekim sonucu: gelişen fotoğraf + yıldızlar + puan dökümü + yeni rozetler.
export default function Result({ level, fx, result, newBadges = [], onRetry, onHome, onNext, nextTitle }) {
  useEffect(() => {
    if (newBadges.length) setTimeout(badgeSound, 700)
  }, [newBadges.length])

  return (
    <div className="modal-back">
      <div className="modal">
        <div className="photo-frame">
          <Scene
            bgBlur={fx.bgBlur} motionBlur={fx.motionBlur} brightness={fx.brightness}
            noise={fx.noise} moving={level.moving} scene={level.scene} paused
          />
          <div className="hud">
            <span>f/{fx.a.f}</span><span>{fx.s.label}</span><span>ISO {fx.i.iso}</span>
          </div>
        </div>

        <div className="result-stars">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`big-star ${n <= result.stars ? 'on' : ''}`}
              style={{ animationDelay: `${n * 0.12}s` }}
            >★</span>
          ))}
        </div>

        <div className="result-head">
          <Mascot size={44} mood={result.stars >= 2 ? 'happy' : 'wow'} />
          <p className="praise">{praise(result.stars)}</p>
        </div>

        {newBadges.length > 0 && (
          <div className="new-badges">
            {newBadges.map((b) => (
              <div className="new-badge" key={b.id}>
                <span className="nb-emoji">{b.emoji}</span>
                <div className="nb-text">
                  <strong>Yeni rozet!</strong>
                  <span className="nb-name">{b.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <ul className="score-list">
          {result.parts.map((p) => (
            <li key={p.label} className={p.ok ? 'good' : 'bad'}>
              <span className="score-icon">{p.ok ? '✅' : '⚠️'}</span>
              <span className="score-label">{p.label}</span>
              <span className="score-msg">{p.msg}</span>
            </li>
          ))}
        </ul>

        <div className="result-actions">
          <button className="ghost-btn" onClick={onHome}>Harita</button>
          <button className="retry-btn" onClick={onRetry}>🔄 Tekrar Çek</button>
          {onNext && <button className="next-btn" onClick={onNext}>Sonraki: {nextTitle} →</button>}
        </div>
      </div>
    </div>
  )
}
