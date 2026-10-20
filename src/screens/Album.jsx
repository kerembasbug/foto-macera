import { LEVELS } from '../game.js'
import { computeEffects } from '../camera.js'
import { LIGHT_K } from '../camera.js'
import { SETS } from '../scene/sets.jsx'
import { FREE_MAX } from '../useProgress.js'
import Scene from '../Scene.jsx'
import { tx } from '../i18n.js'

// Albüm: her bölümün en iyi karesi, polaroid kart olarak.
export default function Album({ progress, onHome }) {
  const { album, freeShots, deleteFreeShot } = progress
  const shots = LEVELS.filter((l) => album[l.id]) // çekilen bölümler, sıra korunur

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← {tx('Harita', 'Map')}</button>
        <span className="play-title">🎞️ {tx('Albümüm', 'My Album')}</span>
        <span className="album-count">{shots.length} / {LEVELS.length}</span>
      </div>

      {freeShots.length > 0 && (
        <>
          <h2 className="album-section">🧪 {tx('Serbest karelerim', 'My free shots')} <small>{freeShots.length} / {FREE_MAX}</small></h2>
          <div className="album-grid">
            {freeShots.map((shot) => <FreePolaroid key={shot.id} shot={shot} onDelete={() => { if (window.confirm(tx('Bu kare silinsin mi?', 'Delete this photo?'))) deleteFreeShot(shot.id) }} />)}
          </div>
          <h2 className="album-section">🗺️ {tx('Görev kareleri', 'Mission photos')}</h2>
        </>
      )}

      {shots.length === 0 ? (
        <div className="album-empty">
          <span>📸</span>
          <p>{tx('Henüz kare yok. Görevleri tamamla, en iyi fotoğrafların burada birikecek!', 'No photos yet. Complete missions and your best shots will be collected here!')}</p>
        </div>
      ) : (
        <div className="album-grid">
          {shots.map((lv) => {
            const shot = album[lv.id]
            const fx = computeEffects({
              aperture: shot.a, shutter: shot.s, iso: shot.i,
              scene: lv.scene, moving: lv.moving,
              focal: shot.f ?? null, wb: shot.w ?? null, lightK: lv.lightK ?? null,
            })
            return (
              <figure className="polaroid" key={lv.id}>
                <div className="polaroid-photo">
                  <Scene
                    art={lv.art}
                    bgBlur={fx.bgBlur} motionBlur={fx.motionBlur} brightness={fx.brightness}
                    noise={fx.noise} moving={lv.moving} scene={lv.scene} paused
                    zoom={fx.zoom} shake={fx.shake} cast={fx.cast}
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

function FreePolaroid({ shot, onDelete }) {
  const fx = computeEffects({
    aperture: shot.a, shutter: shot.s, iso: shot.i, scene: shot.scene, moving: shot.moving,
    focal: shot.f, wb: shot.w, lightK: LIGHT_K[shot.scene],
  })
  return (
    <figure className="polaroid">
      <div className="polaroid-photo">
        <Scene
          art={shot.art} scene={shot.scene}
          bgBlur={fx.bgBlur} motionBlur={fx.motionBlur} brightness={fx.brightness}
          noise={fx.noise} moving={shot.moving} paused
          zoom={fx.zoom} shake={fx.shake} cast={fx.cast}
        />
      </div>
      <button className="po-delete" onClick={onDelete} aria-label={tx('Bu kareyi sil', 'Delete this photo')}>✕</button>
      <figcaption>
        <div className="po-title">{SETS[shot.art]?.label ?? tx('Kare', 'Photo')}</div>
        <div className="po-settings">{fx.f.mm} mm · f/{fx.a.f} · {fx.s.label} · ISO {fx.i.iso}</div>
      </figcaption>
    </figure>
  )
}
