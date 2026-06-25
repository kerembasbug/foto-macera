import { useState } from 'react'
import { WORLDS, LEVELS, BADGES, levelsByWorld, dailyLevelId, getLevel } from '../game.js'
import { isMuted, setMuted } from '../sound.js'
import { todayStr } from '../useProgress.js'
import Mascot from '../components/Mascot.jsx'
import Hero from '../components/Hero.jsx'

// Ana harita: günlük görev, dünyalar, bölümler, yıldızlar, rozetler.
export default function Home({ progress, onPlay, onFree, onAlbum }) {
  const { starsOf, totalStars, isUnlocked, hasBadge, dailyDoneToday, dailyStreak, dailyStarsToday, albumCount } = progress
  const maxStars = LEVELS.length * 3
  const [muted, setMutedState] = useState(isMuted())

  const dailyLevel = getLevel(dailyLevelId(todayStr()))

  function toggleSound() {
    const v = !muted
    setMuted(v)
    setMutedState(v)
  }

  return (
    <div className="home">
      <header className="hero-header">
        <Hero />
        <button className="sound-btn hero-sound" onClick={toggleSound} aria-label="Ses aç/kapa">
          {muted ? '🔇' : '🔊'}
        </button>
        <div className="hero-overlay">
          <Mascot size={58} />
          <div>
            <h1>Foto Macera</h1>
            <p className="subtitle">Görevi seç, deklanşöre bas, yıldız topla! 📸</p>
          </div>
        </div>
      </header>

      <div className="star-bank">⭐ {totalStars} / {maxStars} yıldız</div>

      <section className={`daily ${dailyDoneToday ? 'done' : ''}`}>
        <div className="daily-head">
          <span className="daily-tag">📅 Günün Görevi</span>
          {dailyStreak > 0 && <span className="streak">🔥 {dailyStreak} gün</span>}
        </div>
        <div className="daily-body">
          <span className="daily-emoji">{dailyLevel.emoji}</span>
          <div className="daily-info">
            <strong>{dailyLevel.title}</strong>
            <small>{dailyLevel.brief}</small>
          </div>
        </div>
        {dailyDoneToday ? (
          <div className="daily-done-row">
            <span className="daily-check">✓ Bugün tamamlandı</span>
            <span className="daily-earned">
              {[1, 2, 3].map((n) => (
                <span key={n} className={n <= dailyStarsToday ? 'star on' : 'star'}>★</span>
              ))}
            </span>
            <button className="daily-replay" onClick={() => onPlay(dailyLevel.id, true)}>Tekrar</button>
          </div>
        ) : (
          <button className="daily-play" onClick={() => onPlay(dailyLevel.id, true)}>▶ Oyna</button>
        )}
      </section>

      {WORLDS.map((w) => (
        <section className="world" key={w.id}>
          <div className="world-banner">
            <img src={w.bg} className="world-banner-img" alt="" draggable="false" />
            <div className="world-banner-overlay" style={{ '--wc': w.color }} />
          </div>
          <h2 className="world-title" style={{ color: w.color }}>
            <span>{w.emoji}</span> {w.name}
            <small>{w.tagline}</small>
          </h2>
          <div className="level-grid">
            {levelsByWorld(w.id).map((lv) => {
              const locked = !isUnlocked(lv.id)
              const s = starsOf(lv.id)
              return (
                <button
                  key={lv.id}
                  className={`level-card ${locked ? 'locked' : ''} ${s === 3 ? 'mastered' : ''}`}
                  disabled={locked}
                  onClick={() => onPlay(lv.id)}
                  style={{ '--w': w.color }}
                >
                  <span className="level-emoji">{locked ? '🔒' : lv.emoji}</span>
                  <span className="level-name">{lv.title}</span>
                  <span className="stars">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= s ? 'star on' : 'star'}>★</span>
                    ))}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <section className="world badges">
        <h2 className="world-title" style={{ color: 'var(--accent2)' }}>
          <span>🏅</span> Rozetler
        </h2>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const got = hasBadge(b.id)
            return (
              <div key={b.id} className={`badge ${got ? 'got' : ''}`} title={b.desc}>
                <span className="badge-emoji">{got ? b.emoji : '🔒'}</span>
                <span className="badge-name">{b.name}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="home-actions">
        <button className="album-btn" onClick={onAlbum}>
          🎞️ Albümüm <span className="album-badge">{albumCount}/{LEVELS.length}</span>
        </button>
        <button className="free-btn" onClick={onFree}>
          🧪 Serbest Mod
        </button>
      </div>
    </div>
  )
}
