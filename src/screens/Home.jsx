import { useState } from 'react'
import { WORLDS, LEVELS, BADGES, levelsByWorld, dailyLevelId, getLevel } from '../game.js'
import { isMuted, setMuted, isMusicOn, setMusicOn } from '../sound.js'
import { todayStr } from '../useProgress.js'
import Mascot from '../components/Mascot.jsx'
import Hero from '../components/Hero.jsx'
import WorldTrail from '../components/WorldTrail.jsx'
import Scene from '../Scene.jsx'
import { tx, getLang, setLang } from '../i18n.js'

// Ana harita: günlük görev, dünyalar, bölümler, yıldızlar, rozetler.
export default function Home({ progress, onPlay, onFree, onAlbum, onParents }) {
  const { starsOf, totalStars, isUnlocked, hasBadge, dailyDoneToday, dailyStreak, dailyStarsToday, albumCount } = progress
  const maxStars = LEVELS.length * 3
  const [muted, setMutedState] = useState(isMuted())
  const [music, setMusicState] = useState(isMusicOn())

  const dailyLevel = getLevel(dailyLevelId(todayStr()))

  function toggleSound() {
    const v = !muted
    setMuted(v)
    setMutedState(v)
  }
  function toggleMusic() {
    const v = !music
    setMusicOn(v)
    setMusicState(v)
  }

  return (
    <div className="home">
      <header className="hero-header">
        <Hero />
        <div className="hero-sound-group">
          <button className="sound-btn lang-btn" onClick={() => setLang(getLang() === 'tr' ? 'en' : 'tr')}
            aria-label={tx('Dili değiştir: English', 'Change language: Türkçe')}>
            {getLang() === 'tr' ? 'EN' : 'TR'}
          </button>
          <button className="sound-btn" onClick={toggleMusic} aria-label={tx('Müzik aç/kapa', 'Music on/off')} disabled={muted}
            style={{ opacity: muted || !music ? 0.5 : 1 }}>
            🎵
          </button>
          <button className="sound-btn" onClick={toggleSound} aria-label={tx('Ses aç/kapa', 'Sound on/off')}>
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
        <div className="hero-overlay">
          <Mascot size={64} mood={totalStars > 0 ? 'happy' : 'idle'} />
          <div>
            <h1>{tx('Foto Macera', 'Photo Quest')}</h1>
            <p className="subtitle">{tx('Görevi seç, deklanşöre bas, yıldız topla! 📸', 'Pick a mission, press the shutter, collect stars! 📸')}</p>
          </div>
        </div>
      </header>

      <div className="star-bank">⭐ {totalStars} / {maxStars} {tx('yıldız', 'stars')}</div>

      <section className={`daily ${dailyDoneToday ? 'done' : ''}`}>
        <div className="daily-head">
          <span className="daily-tag">📅 {tx('Günün Görevi', 'Daily Mission')}</span>
          {dailyStreak > 0 && <span className="streak">🔥 {dailyStreak} {tx('gün', dailyStreak === 1 ? 'day' : 'days')}</span>}
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
            <span className="daily-check">✓ {tx('Bugün tamamlandı', 'Done for today')}</span>
            <span className="daily-earned">
              {[1, 2, 3].map((n) => (
                <span key={n} className={n <= dailyStarsToday ? 'star on' : 'star'}>★</span>
              ))}
            </span>
            <button className="daily-replay" onClick={() => onPlay(dailyLevel.id, true)}>{tx('Tekrar', 'Again')}</button>
          </div>
        ) : (
          <button className="daily-play" onClick={() => onPlay(dailyLevel.id, true)}>▶ {tx('Oyna', 'Play')}</button>
        )}
      </section>

      {WORLDS.map((w) => (
        <section className="world" key={w.id}>
          <div className="world-banner">
            {w.bg
              ? <img src={w.bg} className="world-banner-img" alt="" draggable="false" />
              : <div className="world-banner-img"><Scene art={w.banner.art} scene={w.banner.scene} bgBlur={5} paused /></div>}
            <div className="world-banner-overlay" style={{ '--wc': w.color }} />
          </div>
          <h2 className="world-title" style={{ color: w.color }}>
            <span>{w.emoji}</span> {w.name}
            <small>{w.tagline}</small>
          </h2>
          <WorldTrail
            levels={levelsByWorld(w.id)}
            color={w.color}
            starsOf={starsOf}
            isUnlocked={isUnlocked}
            onPlay={onPlay}
            crownOf={progress.crownOf}
          />
        </section>
      ))}

      <section className="world badges">
        <h2 className="world-title" style={{ color: 'var(--accent2)' }}>
          <span>🏅</span> {tx('Rozetler', 'Badges')}
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
          🎞️ {tx('Albümüm', 'My Album')} <span className="album-badge">{albumCount}/{LEVELS.length}</span>
        </button>
        <button className="free-btn" onClick={onFree}>
          🧪 {tx('Serbest Mod', 'Free Mode')}
        </button>
      </div>

      <button className="parents-link" onClick={onParents}>👪 {tx('Ebeveynler için', 'For parents')}</button>
    </div>
  )
}
