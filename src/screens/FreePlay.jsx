import { useMemo, useState } from 'react'
import { SCENES, PRESETS, computeEffects } from '../camera.js'
import CameraStage from '../components/CameraStage.jsx'
import Sliders from '../components/Sliders.jsx'

// Serbest Mod: puansız, istediğin gibi keşfet (eski simülatör).
export default function FreePlay({ onHome }) {
  const [aperture, setAperture] = useState(2)
  const [shutter, setShutter] = useState(1)
  const [iso, setIso] = useState(0)
  const [scene, setScene] = useState('cloudy')
  const [moving, setMoving] = useState(true)
  const [activePreset, setActivePreset] = useState(null)

  const fx = useMemo(
    () => computeEffects({ aperture, shutter, iso, scene, moving }),
    [aperture, shutter, iso, scene, moving]
  )

  const manual = (setter) => (v) => { setter(v); setActivePreset(null) }

  function applyPreset(p) {
    setAperture(p.a); setShutter(p.s); setIso(p.i); setScene(p.scene); setActivePreset(p.id)
  }

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← Harita</button>
        <span className="play-title">🧪 Serbest Mod</span>
        <span style={{ width: 64 }} />
      </div>

      <CameraStage fx={fx} scene={scene} moving={moving} showVerdict />

      <section className="block">
        <h2>Ortam ışığı</h2>
        <div className="chips">
          {SCENES.map((s) => (
            <button key={s.id} className={`chip ${scene === s.id ? 'on' : ''}`}
              onClick={() => { setScene(s.id); setActivePreset(null) }}>
              <span className="chip-emoji">{s.emoji}</span>{s.label}
            </button>
          ))}
        </div>
      </section>

      <Sliders
        aperture={aperture} shutter={shutter} iso={iso}
        setAperture={manual(setAperture)} setShutter={manual(setShutter)} setIso={manual(setIso)}
        fx={fx}
      />

      <section className="block toggle-row">
        <label className="switch">
          <input type="checkbox" checked={moving} onChange={(e) => setMoving(e.target.checked)} />
          <span className="slider-toggle" />
        </label>
        <span>🦋 Kelebek {moving ? 'uçuyor' : 'duruyor'}</span>
      </section>

      <section className="block">
        <h2>Hazır ayarlar</h2>
        <div className="chips">
          {PRESETS.map((p) => (
            <button key={p.id} className={`chip preset ${activePreset === p.id ? 'on' : ''}`}
              onClick={() => applyPreset(p)} title={p.tip}>
              <span className="chip-emoji">{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
        {activePreset && <p className="preset-tip">💡 {PRESETS.find((p) => p.id === activePreset).tip}</p>}
      </section>
    </div>
  )
}
