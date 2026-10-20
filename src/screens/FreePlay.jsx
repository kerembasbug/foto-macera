import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, m as motion } from 'motion/react'
import { SCENES, PRESETS, LIGHT_K, computeEffects } from '../camera.js'
import { shutterClick } from '../sound.js'
import { FREE_MAX } from '../useProgress.js'
import { SETS } from '../scene/sets.jsx'
import CameraStage from '../components/CameraStage.jsx'
import Sliders from '../components/Sliders.jsx'
import { tx } from '../i18n.js'

// Serbest Mod: puansız, istediğin gibi keşfet (eski simülatör).
export default function FreePlay({ progress, onHome, onAlbum }) {
  const [aperture, setAperture] = useState(2)
  const [shutter, setShutter] = useState(1)
  const [iso, setIso] = useState(0)
  const [focal, setFocal] = useState(2)
  const [wb, setWb] = useState(2)
  const [flash, setFlash] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const [scene, setScene] = useState('cloudy')
  const [art, setArt] = useState('meadow')
  const [moving, setMoving] = useState(true)
  const canMove = !!SETS[art].motion
  const [activePreset, setActivePreset] = useState(null)

  const fx = useMemo(
    () => computeEffects({ aperture, shutter, iso, scene, moving: moving && canMove, focal, wb, lightK: LIGHT_K[scene] }),
    [aperture, shutter, iso, scene, moving, canMove, focal, wb]
  )

  // Çek ve Kaydet: kareyi serbest albüme koy (en yeni başta, en çok FREE_MAX).
  function capture() {
    if (flash) return
    shutterClick()
    setFlash(true)
    setTimeout(() => {
      setFlash(false)
      const full = progress.freeShots.length >= FREE_MAX
      progress.saveFreeShot({ art, scene, a: aperture, s: shutter, i: iso, f: focal, w: wb, moving: moving && canMove })
      setToast(full
        ? tx('Kaydedildi! En eski kare yer açmak için çıkarıldı.', 'Saved! The oldest photo was removed to make room.')
        : `${tx('Albüme eklendi!', 'Added to the album!')} (${Math.min(progress.freeShots.length + 1, FREE_MAX)}/${FREE_MAX})`)
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToast(null), 2200)
    }, 360)
  }

  const manual = (setter) => (v) => { setter(v); setActivePreset(null) }

  function applyPreset(p) {
    setAperture(p.a); setShutter(p.s); setIso(p.i); setScene(p.scene); setActivePreset(p.id)
  }

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← {tx('Harita', 'Map')}</button>
        <span className="play-title">🧪 {tx('Serbest Mod', 'Free Mode')}</span>
        <button className="ghost-btn" onClick={onAlbum}>🎞️ {tx('Albüm', 'Album')}</button>
      </div>

      <CameraStage fx={fx} art={art} scene={scene} moving={moving && canMove} showVerdict flash={flash} />

      <AnimatePresence>
        {toast && (
          <motion.div className="free-toast" role="status"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            📸 {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="block">
        <h2>{tx('Sahne', 'Scene')}</h2>
        <div className="chips">
          {Object.entries(SETS).map(([id, s]) => (
            <button key={id} className={`chip ${art === id ? 'on' : ''}`} onClick={() => setArt(id)}>
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>{tx('Ortam ışığı', 'Lighting')}</h2>
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
        focal={focal} setFocal={setFocal} wb={wb} setWb={setWb}
        fx={fx}
      />

      <button className="shutter" onClick={capture}>
        <span className="shutter-ring"><span className="shutter-dot" /></span>
        {tx('ÇEK VE KAYDET', 'SNAP & SAVE')}
      </button>

      {canMove && (
        <section className="block toggle-row">
          <label className="switch">
            <input type="checkbox" checked={moving} onChange={(e) => setMoving(e.target.checked)} />
            <span className="slider-toggle" />
          </label>
          <span>{moving ? tx('Konu hareket ediyor 💨', 'Subject is moving 💨') : tx('Konu duruyor', 'Subject is still')}</span>
        </section>
      )}

      <section className="block">
        <h2>{tx('Hazır ayarlar', 'Presets')}</h2>
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
