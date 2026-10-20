import Scene from '../Scene.jsx'
import ExposureMeter from '../ExposureMeter.jsx'
import { useSmooth } from '../hooks/useSmooth.js'
import { tx } from '../i18n.js'

// Vizör: fotoğraf + üstte ayar bilgisi + pozlama göstergesi.
// Efekt değerleri yumuşatılır: kaydırıcı oynayınca görüntü akarak değişir.
export default function CameraStage({ fx, art, scene, moving, paused, showVerdict = true, flash = false, hideMeter = false }) {
  const bgBlur = useSmooth(fx.bgBlur, { eps: 0.02 })
  const motionBlur = useSmooth(fx.motionBlur, { eps: 0.02 })
  const brightness = useSmooth(fx.brightness, { eps: 0.002 })
  const noise = useSmooth(fx.noise, { eps: 0.002 })
  const zoom = useSmooth(fx.zoom, { eps: 0.003, speed: 0.16 })
  const shake = useSmooth(fx.shake, { eps: 0.02 })
  const cast = useSmooth(fx.cast, { eps: 0.5 })

  return (
    <>
      <section className="viewport">
        <Scene
          art={art}
          bgBlur={bgBlur}
          motionBlur={motionBlur}
          brightness={brightness}
          noise={noise}
          moving={moving}
          scene={scene}
          paused={paused}
          zoom={zoom}
          shake={shake}
          cast={cast}
        />
        <div className="hud">
          <span>f/{fx.a.f}</span>
          <span>{fx.s.label}</span>
          <span>ISO {fx.i.iso}</span>
          {fx.f && <span>{fx.f.mm} mm</span>}
          {fx.w && <span>{fx.w.emoji}</span>}
        </div>
        {showVerdict && (
          <div className="verdict" style={{ background: fx.verdict.color }}>
            {fx.verdict.text}
          </div>
        )}
        {flash && <div className="flash" />}
      </section>
      {hideMeter ? <p className="meter-hidden">👑 {tx('Usta modu: ışık ölçer kapalı, gözüne güven!', 'Pro mode: the light meter is off. Trust your eyes!')}</p> : <ExposureMeter meter={fx.meter} />}
    </>
  )
}
