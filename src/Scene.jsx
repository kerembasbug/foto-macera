// Çekilen "fotoğraf". Ayarlara göre canlı değişir:
//  • bgBlur     → her katman kameraya uzaklığı kadar bulanır (alan derinliği)
//  • lights     → parlak noktalar geniş diyaframda büyüyüp yumuşak dairelere (bokeh) dönüşür
//  • motionBlur → hareketli konu bulanır + arkasında hız izi bırakır
//  • brightness → pozlama (parlaklık)   • noise → ISO greni
//  • scene      → günün saati paleti (güneşli / bulutlu / gün batımı / gece)
//  • art        → hangi sahne (bahçe, vadi, makro, çayır, sahil, stadyum, şehir, göl, ışıklı gece)
import { useId, useMemo } from 'react'
import { paletteFor } from './scene/palettes.js'
import { SETS } from './scene/sets.jsx'
import { Cloud } from './scene/parts.jsx'

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

export default function Scene({
  art = 'meadow', scene = 'sunny', bgBlur = 0, motionBlur = 0, brightness = 1, noise = 0,
  moving = false, paused = false, zoom = 1, shake = 0, cast = 0,
}) {
  const uid = useId().replace(/:/g, '')
  const p = paletteFor(scene)
  const set = SETS[art] ?? SETS.meadow
  const built = useMemo(() => set.build(p), [set, p])

  // Her farklı uzaklık için bir bulanıklık filtresi
  const depths = [...new Set([1, ...built.layers.map((l) => l.depth), ...(built.fg ?? []).map((l) => l.depth)])]
  const fid = (d) => `${uid}-b${String(d).replace(/[.-]/g, '_')}`
  const blurOf = (d) => bgBlur * Math.abs(d)
  const filt = (d) => (blurOf(d) > 0.15 ? `url(#${fid(d)})` : undefined)

  const showMotion = moving && motionBlur > 0.15
  const ghosts = showMotion ? Math.min(6, Math.round(motionBlur / 2.4)) : 0
  const spacing = motionBlur * 1.25
  // Zum: kadraj konunun etrafında daralır (uzun lens = konu büyür).
  const [fx0, fy0] = set.focus ?? [200, 150]
  const vw = 400 / zoom, vh = 300 / zoom
  const vx = clamp(fx0 - vw / 2, 0, 400 - vw), vy = clamp(fy0 - vh / 2, 0, 300 - vh)

  // Beyaz dengesi kayması: + turuncu, − mavi
  const castOp = clamp(Math.abs(cast) / 260, 0, 0.55)
  const castColor = cast > 0 ? '#ff8a2a' : '#3f7dff'

  const motionClass = moving ? `mover mover-${set.motion ?? 'flutter'}${paused ? ' paused' : ''}` : 'mover'

  return (
    <div className="scene" style={{ filter: `brightness(${brightness})${shake > 0.1 ? ` blur(${shake * 0.6}px)` : ''}` }}>
      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} className="scene-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.sky[0]} />
            <stop offset="100%" stopColor={p.sky[1]} />
          </linearGradient>
          {depths.map((d) => (
            <filter key={d} id={fid(d)} x="-15%" y="-15%" width="130%" height="130%">
              <feGaussianBlur stdDeviation={blurOf(d)} />
            </filter>
          ))}
          <filter id={`${uid}-motion`} x="-60%" y="-30%" width="220%" height="160%">
            <feGaussianBlur stdDeviation={`${motionBlur * 0.55} 0`} />
          </filter>
          <filter id={`${uid}-soft`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" />
          </filter>
        </defs>

        {/* gökyüzü — en uzak katman */}
        <g filter={filt(1)}>
          <rect x="-10" y="-10" width="420" height="320" fill={`url(#${uid}-sky)`} />
          <Light kind={p.light} />
          {set.clouds && p.cloud && (
            <g opacity="0.95">
              <Cloud x={80} y={52} s={0.9} fill={p.cloud} />
              <Cloud x={230} y={34} s={0.7} fill={p.cloud} />
            </g>
          )}
        </g>

        {/* arka katmanlar (uzaktan yakına) + o uzaklıktaki ışıklar */}
        {built.layers.map((l, i) => (
          <g key={i}>
            <g filter={filt(l.depth)}>{l.el}</g>
            <Bokeh lights={built.lights.filter((x) => x.depth === l.depth)} spread={blurOf(l.depth)} soft={`url(#${uid}-soft)`} />
          </g>
        ))}
        {/* katmanı olmayan uzak ışıklar (ör. parıltılar) */}
        <Bokeh
          lights={built.lights.filter((x) => !built.layers.some((l) => l.depth === x.depth))}
          spread={0} spreadOf={(x) => blurOf(x.depth)} soft={`url(#${uid}-soft)`}
        />

        {/* sabit ön plan (konu düzleminde, hep net) */}
        {built.still}

        {/* KONU — her zaman net odakta. Hareketliyse bulanır + iz bırakır. */}
        {(built.subjectLights ?? []).map((g, i) => <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={g.color} />)}
        <g className={motionClass}>
          {Array.from({ length: ghosts }, (_, k) => k + 1).flatMap((k) => [-1, 1].map((dir) => (
            <g key={`${k}${dir}`} transform={`translate(${dir * k * spacing},0)`} opacity={0.32 * (1 - k / (ghosts + 1))}>
              {built.subject}
            </g>
          )))}
          <g filter={showMotion ? `url(#${uid}-motion)` : undefined}>{built.subject}</g>
        </g>

        {/* ön plan: konunun önündeki şeyler (geniş diyaframda onlar da bulanır) */}
        {(built.fg ?? []).map((l, i) => <g key={i} filter={filt(l.depth)}>{l.el}</g>)}
      </svg>

      {p.tint && <div className="ambient" style={{ background: p.tint }} aria-hidden="true" />}
      {castOp > 0.02 && (
        <div className="wb-cast" style={{ background: castColor, opacity: castOp }} aria-hidden="true" />
      )}

      {noise > 0.01 && (
        <div className="grain" style={{ opacity: noise }} aria-hidden="true">
          <svg width="100%" height="100%">
            <filter id={`${uid}-grain`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${uid}-grain)`} />
          </svg>
        </div>
      )}
    </div>
  )
}

// Bokeh: odak dışı parlak nokta → yumuşak, kenarı hafif parlak daire.
// Bulanıklık ne kadar büyükse daire o kadar büyür ve şeffaflaşır.
function Bokeh({ lights, spread, spreadOf, soft }) {
  if (!lights.length) return null
  return (
    <g style={{ mixBlendMode: 'screen' }}>
      {lights.map((l, i) => {
        const s = spreadOf ? spreadOf(l) : spread
        if (s < 1.2) {
          return (
            <g key={i}>
              <circle cx={l.x} cy={l.y} r={l.r * 2.4} fill={l.color} opacity="0.22" filter={soft} />
              <circle cx={l.x} cy={l.y} r={l.r} fill={l.color} />
            </g>
          )
        }
        const R = l.r + s * 1.05
        const op = clamp(0.9 - s * 0.022, 0.4, 0.9)
        return (
          <circle
            key={i} cx={l.x} cy={l.y} r={R} fill={l.color} fillOpacity={op * 0.7}
            stroke={l.color} strokeOpacity={op} strokeWidth={Math.max(0.8, R * 0.09)} filter={soft}
          />
        )
      })}
    </g>
  )
}

// Işık kaynağı: sahneye göre güneş / soluk güneş / batan güneş / ay + yıldızlar
function Light({ kind }) {
  if (kind === 'none') return null
  if (kind === 'moon') {
    return (
      <g>
        <g fill="#ffffff">
          {[[60, 40, 1.8], [150, 30, 1.4], [250, 50, 1.8], [190, 80, 1.2], [110, 95, 1.4], [360, 40, 1.6], [30, 110, 1.1], [290, 100, 1.2]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} className={`twinkle t${i % 3}`} />
          ))}
        </g>
        <circle cx="320" cy="60" r="34" fill="#eef3ff" opacity="0.15" />
        <circle cx="320" cy="60" r="24" fill="#eef3ff" />
        <circle cx="312" cy="54" r="5.5" fill="#d6def0" opacity="0.7" />
        <circle cx="328" cy="68" r="3.6" fill="#d6def0" opacity="0.7" />
      </g>
    )
  }
  if (kind === 'sunset') {
    return (
      <g>
        <circle cx="300" cy="138" r="56" fill="#ffae5e" opacity="0.35" />
        <circle cx="300" cy="138" r="34" fill="#ff8a3d" />
      </g>
    )
  }
  if (kind === 'sun-dim') return <circle cx="320" cy="64" r="28" fill="#fbe9a8" opacity="0.8" />
  return (
    <g>
      <circle cx="320" cy="64" r="44" fill="#ffe680" opacity="0.25" />
      <circle cx="320" cy="64" r="30" fill="#ffd34d" />
      <g stroke="#ffd34d" strokeWidth="5" strokeLinecap="round">
        <line x1="320" y1="14" x2="320" y2="2" /><line x1="370" y1="64" x2="384" y2="64" />
        <line x1="356" y1="28" x2="366" y2="18" /><line x1="284" y1="28" x2="274" y2="18" />
      </g>
    </g>
  )
}
