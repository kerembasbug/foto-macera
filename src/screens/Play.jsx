import { useMemo, useState } from 'react'
import { computeEffects } from '../camera.js'
import { scoreShot, nextLevelId, getLevel } from '../game.js'
import { shutterClick } from '../sound.js'
import Mascot from '../components/Mascot.jsx'
import CameraStage from '../components/CameraStage.jsx'
import Sliders from '../components/Sliders.jsx'
import Result from './Result.jsx'
import { tx } from '../i18n.js'

export function goalChips(level) {
  const g = level.goals
  const chips = []
  if (g.exposure) chips.push(tx('🎯 Doğru pozlama', '🎯 Right exposure'))
  if (g.dof === 'shallow') chips.push(tx('😍 Eriyen arka plan', '😍 Melted background'))
  if (g.dof === 'deep') chips.push(tx('🔍 Baştan sona net', '🔍 Sharp front to back'))
  if (g.motion === 'freeze') chips.push(tx('❄️ Hareketi dondur', '❄️ Freeze the motion'))
  if (g.motion === 'blur') chips.push(tx('💨 Hareket izi', '💨 Motion trail'))
  if (g.lowNoise) chips.push(tx('✨ Gren olmasın', '✨ No grain'))
  if (g.frame === 'tight') chips.push(tx('🔭 Kadrajı doldur', '🔭 Fill the frame'))
  if (g.frame === 'wide') chips.push(tx('🏔️ Hepsini sığdır', '🏔️ Fit it all in'))
  if (g.frame === 'portrait') chips.push(tx('👦 Portre kadrajı', '👦 Portrait framing'))
  if (g.steady) chips.push(tx('🪨 Titreme yok', '🪨 No shake'))
  if (g.color === 'neutral') chips.push(tx('⚪ Doğal renkler', '⚪ Natural colors'))
  if (g.color === 'warm') chips.push(tx('🌅 Sıcak renkler', '🌅 Warm colors'))
  return chips
}

export default function Play({ level, progress, onHome, onPlay, isDaily = false }) {
  // Görev nötr ayarlarla başlar — çözüm hazır verilmez.
  const [aperture, setAperture] = useState(3)
  const [shutter, setShutter] = useState(3)
  const [iso, setIso] = useState(1)
  const [focal, setFocal] = useState(2)
  const [wb, setWb] = useState(2)
  const [showTip, setShowTip] = useState(false)
  const [flash, setFlash] = useState(false)
  const [result, setResult] = useState(null)
  // Usta modu: bölümden en az 1 yıldız alınca açılır (günlük görevde yok).
  const canMaster = !isDaily && progress.starsOf(level.id) >= 1
  const [master, setMaster] = useState(false)

  const fx = useMemo(
    () => computeEffects({
      aperture, shutter, iso, scene: level.scene, moving: level.moving,
      focal: level.zoom ? focal : null, wb: level.wb ? wb : null, lightK: level.lightK ?? null,
    }),
    [aperture, shutter, iso, focal, wb, level]
  )

  function capture() {
    if (flash || result) return
    const sc = scoreShot(level, fx, { master })
    shutterClick()
    setFlash(true)
    setTimeout(() => {
      setFlash(false)
      progress.recordShot(level.id, {
        a: aperture, s: shutter, i: iso, f: level.zoom ? focal : null, w: level.wb ? wb : null,
        stars: sc.stars, total: sc.total,
      }, { master })
      if (isDaily) progress.recordDaily(sc.stars)
      setResult(sc)
    }, 360)
  }

  // Sonuç kapanırken yeni rozetleri "görüldü" işaretle.
  const closeResult = (fn) => () => { progress.ackBadges(); setResult(null); fn?.() }

  const nextId = nextLevelId(level.id)
  const canNext = result && result.stars >= 1 && nextId

  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← {tx('Harita', 'Map')}</button>
        <span className="play-title">{isDaily ? '📅 ' : ''}{level.emoji} {level.title}</span>
        {master
          ? <span className="master-tag" aria-label={tx('Usta modu', 'Pro mode')}>👑 {tx('Usta', 'Pro')}</span>
          : <button className="ghost-btn" onClick={() => setShowTip((v) => !v)}>💡 {tx('İpucu', 'Tip')}</button>}
      </div>

      <div className="brief">
        <div className="brief-row">
          <Mascot size={46} mood={showTip ? 'think' : 'idle'} />
          <p>{level.brief}</p>
        </div>
        <div className="goal-chips">
          {goalChips(level).map((c) => <span key={c}>{c}</span>)}
        </div>
        {showTip && !master && <p className="tip-text">💡 {level.tip}</p>}
        {canMaster && (
          <div className="mode-switch" role="group" aria-label={tx('Zorluk', 'Difficulty')}>
            <button className={!master ? 'on' : ''} onClick={() => setMaster(false)}>🙂 {tx('Kolay', 'Easy')}</button>
            <button className={master ? 'on' : ''} onClick={() => { setMaster(true); setShowTip(false) }}>
              👑 {tx('Usta', 'Pro')} {progress.crownOf(level.id) && '✓'}
            </button>
          </div>
        )}
      </div>

      <CameraStage fx={fx} art={level.art} scene={level.scene} moving={level.moving} showVerdict={false} flash={flash} hideMeter={master} />

      <Sliders
        aperture={aperture} shutter={shutter} iso={iso}
        setAperture={setAperture} setShutter={setShutter} setIso={setIso}
        focal={focal} setFocal={level.zoom ? setFocal : null}
        wb={wb} setWb={level.wb ? setWb : null}
        fx={fx}
      />

      <button className="shutter" onClick={capture}>
        <span className="shutter-ring"><span className="shutter-dot" /></span>
        {tx('ÇEK!', 'SNAP!')}
      </button>

      {result && (
        <Result
          level={level}
          fx={fx}
          result={result}
          master={master}
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
