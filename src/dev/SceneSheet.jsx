import Scene from '../Scene.jsx'
import { LEVELS } from '../game.js'

// Sadece geliştirme: /#scenes — her bölümün sahnesini net (f/16) ve bulanık (f/1.4) gösterir.
export default function SceneSheet() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 300px)', gap: 10, padding: 12 }}>
      {LEVELS.flatMap((l) => [0.4, 13.8].map((b) => (
        <div key={l.id + b}>
          <div style={{ position: 'relative', width: 300, height: 225, borderRadius: 10, overflow: 'hidden' }}>
            <Scene art={l.art} scene={l.scene} bgBlur={b} brightness={1} moving={l.moving} paused motionBlur={b > 1 ? 10 : 0} />
          </div>
          <small>{l.id} · {l.art} · {l.scene} · {b < 1 ? 'f/16' : 'f/1.4'}</small>
        </div>
      )))}
    </div>
  )
}
