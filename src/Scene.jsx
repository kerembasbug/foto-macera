// Çekilen "fotoğraf". Ayarlara göre canlı değişir:
//  • bgBlur     → arka plan bulanıklığı (alan derinliği)
//  • motionBlur → uçan kelebeğin hareket bulanıklığı
//  • brightness → pozlama (parlaklık)
//  • noise      → ISO greni (kumlanma)
//  • scene      → ortam ışığı (gökyüzü rengi + güneş/ay) -> günün saati havası

// Her sahnenin kendi renk paleti ve ışık kaynağı var.
// Pozlama parlaklığı bu paletin ÜZERİNE çarpan olarak bindiği için
// gece doğru pozlandığında bile "gece" görünür; ders bozulmaz.
const PALETTES = {
  sunny: {
    sky: ['#7ec8ff', '#d9f0ff'],
    far: '#9aa7c7', near: '#8492b8',
    hill: ['#86d36b', '#5fae47'], tree: '#4f9e3a',
    cloud: '#ffffff', light: 'sun', tint: null,
  },
  cloudy: {
    sky: ['#aebccf', '#d6dee7'],
    far: '#94a0b8', near: '#7f8aa6',
    hill: ['#72b85c', '#4f9b3d'], tree: '#4a8f38',
    cloud: '#eef2f6', light: 'sun-dim', tint: 'rgba(150,162,180,0.12)',
  },
  sunset: {
    sky: ['#ff9a5a', '#ffe0b0'],
    far: '#b58aa0', near: '#9a7187',
    hill: ['#6f9e54', '#4d7a3a'], tree: '#3f7e30',
    cloud: '#ffd8c2', light: 'sunset', tint: 'rgba(255,120,40,0.16)',
  },
  night: {
    sky: ['#0e1733', '#27406e'],
    far: '#2b3a5c', near: '#21304e',
    hill: ['#214e2f', '#143420'], tree: '#1f5a26',
    cloud: null, light: 'moon', tint: 'rgba(10,18,45,0.5)',
  },
}

export default function Scene({ bgBlur, motionBlur, brightness, noise, moving, scene, paused }) {
  const p = PALETTES[scene] ?? PALETTES.sunny
  const flyClass = moving ? (paused ? 'butterfly flying paused' : 'butterfly flying') : 'butterfly'

  return (
    <div className="scene" style={{ filter: `brightness(${brightness})` }}>
      <svg viewBox="0 0 400 300" className="scene-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.sky[0]} />
            <stop offset="100%" stopColor={p.sky[1]} />
          </linearGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.hill[0]} />
            <stop offset="100%" stopColor={p.hill[1]} />
          </linearGradient>
          <filter id="bgblur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={bgBlur} />
          </filter>
          <filter id="motion" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${motionBlur} 0`} />
          </filter>
        </defs>

        {/* ---- ARKA PLAN: diyaframa göre bulanıklaşır ---- */}
        <g filter="url(#bgblur)">
          <rect x="0" y="0" width="400" height="300" fill="url(#sky)" />

          <Light kind={p.light} />

          {/* bulutlar (gece yok) */}
          {p.cloud && (
            <g fill={p.cloud}>
              <ellipse cx="90" cy="58" rx="34" ry="18" />
              <ellipse cx="120" cy="64" rx="26" ry="15" />
              <ellipse cx="210" cy="40" rx="26" ry="14" />
            </g>
          )}

          {/* dağlar */}
          <polygon points="0,170 90,70 180,170" fill={p.far} />
          <polygon points="120,170 220,60 320,170" fill={p.near} />
          {/* tepeler */}
          <rect x="0" y="160" width="400" height="140" fill="url(#hill)" />
          {/* arka ağaç */}
          <g transform="translate(70,120)">
            <rect x="-6" y="20" width="12" height="50" rx="4" fill="#8a5a2b" />
            <circle cx="0" cy="10" r="34" fill={p.tree} />
          </g>
        </g>

        {/* ---- ÖN PLAN: net kalır (konu burada) ---- */}
        {/* çimen tutamları */}
        <g stroke="#3f8f2c" strokeWidth="4" strokeLinecap="round">
          <line x1="40" y1="300" x2="36" y2="250" />
          <line x1="48" y1="300" x2="56" y2="252" />
          <line x1="360" y1="300" x2="356" y2="248" />
          <line x1="368" y1="300" x2="376" y2="256" />
        </g>

        {/* çiçek (ön plan, net) */}
        <g transform="translate(110,232)">
          <rect x="-3" y="0" width="6" height="60" rx="3" fill="#3f8f2c" />
          <g fill="#ff6f91">
            <circle cx="0" cy="-10" r="11" />
            <circle cx="-12" cy="0" r="11" />
            <circle cx="12" cy="0" r="11" />
            <circle cx="-7" cy="12" r="11" />
            <circle cx="7" cy="12" r="11" />
          </g>
          <circle cx="0" cy="1" r="8" fill="#ffd34d" />
        </g>

        {/* KELEBEK — konu. Uçarken hareket bulanıklığı alır. */}
        <g
          className={flyClass}
          filter={motionBlur > 0.1 ? 'url(#motion)' : undefined}
        >
          <g transform="translate(230,150)">
            <ellipse cx="-14" cy="-10" rx="16" ry="20" fill="#ff8c42" />
            <ellipse cx="-14" cy="12" rx="14" ry="16" fill="#ffb02e" />
            <ellipse cx="14" cy="-10" rx="16" ry="20" fill="#ff8c42" />
            <ellipse cx="14" cy="12" rx="14" ry="16" fill="#ffb02e" />
            <ellipse cx="0" cy="0" rx="4" ry="22" fill="#3a2a4d" />
            <circle cx="0" cy="-22" r="5" fill="#3a2a4d" />
            <line x1="0" y1="-26" x2="-7" y2="-34" stroke="#3a2a4d" strokeWidth="2" strokeLinecap="round" />
            <line x1="0" y1="-26" x2="7" y2="-34" stroke="#3a2a4d" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>

      {/* Ortam ışığı tonlaması (günün saati havası) */}
      {p.tint && <div className="ambient" style={{ background: p.tint }} aria-hidden="true" />}

      {/* ISO greni (kumlanma) — en üst katman */}
      {noise > 0.01 && (
        <div className="grain" style={{ opacity: noise }} aria-hidden="true">
          <svg width="100%" height="100%">
            <filter id="grainf">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grainf)" />
          </svg>
        </div>
      )}
    </div>
  )
}

// Işık kaynağı: sahneye göre güneş / soluk güneş / batan güneş / ay + yıldızlar
function Light({ kind }) {
  if (kind === 'moon') {
    return (
      <g>
        {/* yıldızlar */}
        <g fill="#ffffff">
          <circle cx="60" cy="40" r="1.8" />
          <circle cx="150" cy="30" r="1.4" />
          <circle cx="250" cy="50" r="1.8" />
          <circle cx="190" cy="80" r="1.2" />
          <circle cx="110" cy="95" r="1.4" />
          <circle cx="360" cy="40" r="1.6" />
        </g>
        {/* ay */}
        <circle cx="320" cy="60" r="26" fill="#eef3ff" />
        <circle cx="312" cy="54" r="6" fill="#d6def0" opacity="0.7" />
        <circle cx="328" cy="68" r="4" fill="#d6def0" opacity="0.7" />
      </g>
    )
  }
  if (kind === 'sunset') {
    return (
      <g>
        <circle cx="300" cy="120" r="46" fill="#ffae5e" opacity="0.5" />
        <circle cx="300" cy="120" r="34" fill="#ff8a3d" />
      </g>
    )
  }
  if (kind === 'sun-dim') {
    return <circle cx="320" cy="64" r="28" fill="#fbe9a8" opacity="0.8" />
  }
  // parlak güneş + ışınlar
  return (
    <g>
      <circle cx="320" cy="64" r="30" fill="#ffd34d" />
      <g stroke="#ffd34d" strokeWidth="5" strokeLinecap="round">
        <line x1="320" y1="14" x2="320" y2="2" />
        <line x1="370" y1="64" x2="384" y2="64" />
        <line x1="356" y1="28" x2="366" y2="18" />
        <line x1="284" y1="28" x2="274" y2="18" />
      </g>
    </g>
  )
}
