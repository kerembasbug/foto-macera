import Scene from '../Scene.jsx'
import { computeEffects } from '../camera.js'
import { LEVELS } from '../game.js'

// Sadece geliştirme: /#fx — yeni bölümlerde "usta ayarı" ile "yanlış ayar" yan yana.
const BAD = {
  l10: { f: 5, s: 3, a: 7 }, // uzun lens + yavaş perde = titreme
  l11: { f: 5 },       // dar kadraj
  l12: { f: 0 },       // geniş açı portre
  l13: { w: 2 },       // ampulde gün ışığı = turuncu
  l14: { w: 2 },       // gölgede gün ışığı = mavi
  l15: { w: 0 },       // gün batımında ampul = soğuk
}

function fxFor(l, p) {
  return computeEffects({
    aperture: p.a, shutter: p.s, iso: p.i, scene: l.scene, moving: l.moving,
    focal: l.zoom ? (p.f ?? 2) : null, wb: l.wb ? (p.w ?? 2) : null, lightK: l.lightK ?? null,
  })
}

export default function FxSheet() {
  const levels = LEVELS.filter((l) => BAD[l.id])
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: 10, padding: 12 }}>
      {levels.flatMap((l) => [['usta', l.par], ['yanlış', { ...l.par, ...BAD[l.id] }]].map(([k, p]) => {
        const fx = fxFor(l, p)
        return (
          <div key={l.id + k}>
            <div style={{ position: 'relative', width: 300, height: 225, borderRadius: 10, overflow: 'hidden' }}>
              <Scene art={l.art} scene={l.scene} bgBlur={fx.bgBlur} brightness={fx.brightness} noise={fx.noise}
                motionBlur={fx.motionBlur} moving={l.moving} paused zoom={fx.zoom} shake={fx.shake} cast={fx.cast} />
            </div>
            <small>{l.id} · {k} · zoom {fx.zoom} · shake {fx.shake.toFixed(1)} · cast {Math.round(fx.cast)}</small>
          </div>
        )
      }))}
    </div>
  )
}
