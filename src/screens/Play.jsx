import { useMemo, useState } from 'react'
import { computeEffects } from '../camera.js'
import { scoreShot, nextLevelId, getLevel } from '../game.js'
import { shutterClick, resultSound } from '../sound.js'
import CameraStage from '../components/CameraStage.jsx'
import Sliders from '../components/Sliders.jsx'
import Result from './Result.jsx'

export function goalChips(level) {
  const g = level.goals
  const chips = []
  if (g.exposure) chips.push('🎯 Doğru pozlama')
  if (g.dof === 'shallow') chips.push('😍 Eriyen arka plan')
  if (g.dof === 'deep') chips.push('🔍 Baştan sona net')
  if (g.motion === 'freeze') chips.push('❄️ Hareketi dondur')
  if (g.motion === 'blur') chips.push('💨 Hareket izi')
  if (g.lowNoise) chips.push('✨ Gren olmasın')
  return chips
}

export default function Play({ level, progress, onHome, onPlay, isDaily = false }) {
  // Görev nötr ayarlarla başlar — çözüm hazır verilmez.
  const [aperture, setAperture] = useState(3)
  const [shutter, setShutter] = useState(3)
  const [iso, setIso] = useState(1)
  const [showTip, setShowTip] = useState(false)
  const [flash, setFlash] = useState(false)
  const [result, setResult] = useState(null)

  const fx = useMemo(
    () => computeEffects({ aperture, shutter, iso, scene: level.scene, moving: level.moving }),
    [aperture, shutter, iso, level]
  )

  function capture() {
    if (flash || result) return
    const sc = scoreShot(level, fx)
    shutterClick()
    setFlash(true)
    setTimeout(() => {
      setFlash(false)
      progress.recordShot(level.id, { a: aperture, s: shutter, i: iso, stars: sc.stars, total: sc.total })
      if (isDaily) progress.recordDaily(sc.stars)
      setResult(sc)
      resultSound(sc.stars)
    }, 360)
  }

  // Sonuç kapanırken yeni rozetleri "görüldü" işaretle.
  const closeResult = (fn) => () => { progress.ackBadges(); setResult(null); fn?.() }

  const nextId = nextLevelId(level.id)
  const canNext = result && result.stars >= 1 && nextId

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← Harita</button>
        <span className="play-title">{isDaily ? '📅 ' : ''}{level.emoji} {level.title}</span>
        <button className="ghost-btn" onClick={() => setShowTip((v) => !v)}>💡 İpucu</button>
      </div>

      <div className="brief">
        <p>{level.brief}</p>
        <div className="goal-chips">
          {goalChips(level).map((c) => <span key={c}>{c}</span>)}
        </div>
        {showTip && <p className="tip-text">💡 {level.tip}</p>}
      </div>

      <CameraStage fx={fx} scene={level.scene} moving={level.moving} showVerdict={false} flash={flash} />

      <Sliders
        aperture={aperture} shutter={shutter} iso={iso}
        setAperture={setAperture} setShutter={setShutter} setIso={setIso}
        fx={fx}
      />

      <button className="shutter" onClick={capture}>
        <span className="shutter-ring"><span className="shutter-dot" /></span>
        ÇEK!
      </button>

      {result && (
        <Result
          level={level}
          fx={fx}
          result={result}
          newBadges={progress.newBadges}
          onRetry={closeResult()}
          onHome={closeResult(onHome)}
          onNext={!isDaily && canNext ? closeResult(() => onPlay(nextId)) : null}
          nextTitle={canNext ? getLevel(nextId).title : null}
        />
      )}
    </div>
  )
}
