import { LEVELS } from '../game.js'
import { computeEffects } from '../camera.js'
import Scene from '../Scene.jsx'

// Albüm: her bölümün en iyi karesi, polaroid kart olarak.
export default function Album({ progress, onHome }) {
  const { album } = progress
  const shots = LEVELS.filter((l) => album[l.id]) // çekilen bölümler, sıra korunur

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← Harita</button>
        <span className="play-title">🎞️ Albümüm</span>
        <span className="album-count">{shots.length} / {LEVELS.length}</span>
      </div>

      {shots.length === 0 ? (
        <div className="album-empty">
          <span>📸</span>
          <p>Henüz kare yok. Görevleri tamamla, en iyi fotoğrafların burada birikecek!</p>
        </div>
      ) : (
        <div className="album-grid">
          {shots.map((lv) => {
            const shot = album[lv.id]
            const fx = computeEffects({
              aperture: shot.a, shutter: shot.s, iso: shot.i,
              scene: lv.scene, moving: lv.moving,
            })
            return (
              <figure className="polaroid" key={lv.id}>
                <div className="polaroid-photo">
                  <Scene
                    bgBlur={fx.bgBlur} motionBlur={fx.motionBlur} brightness={fx.brightness}
                    noise={fx.noise} moving={lv.moving} scene={lv.scene} paused
                  />
                </div>
                <figcaption>
                  <div className="po-title">{lv.emoji} {lv.title}</div>
                  <div className="po-stars">
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={n <= shot.stars ? 'star on' : 'star'}>★</span>
                    ))}
                  </div>
                  <div className="po-settings">f/{fx.a.f} · {fx.s.label} · ISO {fx.i.iso}</div>
                </figcaption>
              </figure>
            )
          })}
        </div>
      )}
    </div>
  )
}
