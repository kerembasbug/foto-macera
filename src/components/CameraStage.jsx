import Scene from '../Scene.jsx'
import ExposureMeter from '../ExposureMeter.jsx'

// Vizör: fotoğraf + üstte ayar bilgisi + pozlama göstergesi.
// showVerdict=false oyunda kapatılabilir (oyuncu kendi karar versin).
export default function CameraStage({ fx, scene, moving, paused, showVerdict = true, flash = false }) {
  return (
    <>
      <section className="viewport">
        <Scene
          bgBlur={fx.bgBlur}
          motionBlur={fx.motionBlur}
          brightness={fx.brightness}
          noise={fx.noise}
          moving={moving}
          scene={scene}
          paused={paused}
        />
        <div className="hud">
          <span>f/{fx.a.f}</span>
          <span>{fx.s.label}</span>
          <span>ISO {fx.i.iso}</span>
        </div>
        {showVerdict && (
          <div className="verdict" style={{ background: fx.verdict.color }}>
            {fx.verdict.text}
          </div>
        )}
        {flash && <div className="flash" />}
      </section>
      <ExposureMeter meter={fx.meter} />
    </>
  )
}
