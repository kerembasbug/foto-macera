// Sahne çizim parçaları — hepsi 400×300'lük sahne koordinatında çizilir.
// Her parça küçük ve tekrar kullanılabilir; sahneler bunları üst üste koyarak kurulur.

export const OUT = '#1e2a3f' // ince kontur rengi

export function Cloud({ x, y, s = 1, fill }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill={fill}>
      <ellipse cx="0" cy="0" rx="34" ry="17" />
      <ellipse cx="28" cy="6" rx="24" ry="14" />
      <ellipse cx="-26" cy="7" rx="20" ry="12" />
      <ellipse cx="6" cy="-10" rx="18" ry="13" />
    </g>
  )
}

export function Mountains({ p, y = 175, snow = true }) {
  return (
    <g>
      <polygon points={`-20,${y} 70,${y - 105} 165,${y}`} fill={p.far} />
      <polygon points={`110,${y} 225,${y - 125} 345,${y}`} fill={p.far} opacity="0.92" />
      <polygon points={`270,${y} 350,${y - 85} 430,${y}`} fill={p.far} opacity="0.85" />
      {snow && (
        <g fill={p.farSnow} opacity="0.9">
          <polygon points={`70,${y - 105} 52,${y - 82} 63,${y - 86} 70,${y - 78} 79,${y - 87} 88,${y - 83}`} />
          <polygon points={`225,${y - 125} 203,${y - 98} 216,${y - 102} 225,${y - 93} 236,${y - 103} 248,${y - 97}`} />
        </g>
      )}
    </g>
  )
}

export function Hills({ y, fill, amp = 18, seed = 0 }) {
  // yumuşak dalgalı tepe şeridi
  const pts = []
  for (let x = -20; x <= 420; x += 40) pts.push(`${x},${y + Math.sin((x + seed) / 55) * amp}`)
  return <polygon points={`-20,300 ${pts.join(' ')} 420,300`} fill={fill} />
}

export function Tree({ x, y, s = 1, p, dark = false }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-6" y="0" width="12" height="46" rx="4" fill={p.trunk} />
      <circle cx="0" cy="-12" r="30" fill={dark ? p.treeDark : p.tree} />
      <circle cx="-18" cy="0" r="20" fill={dark ? p.treeDark : p.tree} />
      <circle cx="18" cy="-2" r="22" fill={dark ? p.treeDark : p.tree} />
      <circle cx="-8" cy="-24" r="10" fill="#ffffff" opacity="0.12" />
    </g>
  )
}

export function Pine({ x, y, s = 1, fill, trunk }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-4" y="-4" width="8" height="18" fill={trunk} />
      <polygon points="0,-62 -24,-4 24,-4" fill={fill} />
      <polygon points="0,-78 -18,-30 18,-30" fill={fill} />
    </g>
  )
}

export function House({ x, y, s = 1, p, lit = false }) {
  const win = lit ? '#ffd56b' : '#9fd3ff'
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-26" y="-34" width="52" height="34" fill={p.wall} stroke={OUT} strokeWidth="1.5" />
      <polygon points="-32,-34 0,-60 32,-34" fill={p.roof} stroke={OUT} strokeWidth="1.5" />
      <rect x="-6" y="-18" width="12" height="18" fill="#8a5a2b" />
      <rect x="-21" y="-27" width="11" height="10" fill={win} stroke={OUT} strokeWidth="1" />
      <rect x="10" y="-27" width="11" height="10" fill={win} stroke={OUT} strokeWidth="1" />
    </g>
  )
}

export function Fence({ y, from = -10, to = 410, color = '#e9d7b4' }) {
  const posts = []
  for (let x = from; x <= to; x += 22) posts.push(<rect key={x} x={x} y={y - 26} width="9" height="30" rx="2" fill={color} stroke={OUT} strokeWidth="1" />)
  return (
    <g>
      <rect x={from} y={y - 18} width={to - from} height="5" fill={color} />
      <rect x={from} y={y - 7} width={to - from} height="5" fill={color} />
      {posts}
    </g>
  )
}

export function Flower({ x, y, s = 1, color = '#ff6f91', center = '#ffd34d', stem = '#3f8f2c', h = 40 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height={h} rx="2.5" fill={stem} />
      <ellipse cx="10" cy={h * 0.55} rx="10" ry="4" fill={stem} transform={`rotate(-25 10 ${h * 0.55})`} />
      <g fill={color}>
        <circle cx="0" cy="-10" r="9" /><circle cx="-10" cy="-2" r="9" /><circle cx="10" cy="-2" r="9" />
        <circle cx="-6" cy="9" r="9" /><circle cx="6" cy="9" r="9" />
      </g>
      <circle cx="0" cy="0" r="7" fill={center} />
    </g>
  )
}

export function Grass({ y, color = '#3f8f2c', xs = [30, 44, 350, 366] }) {
  return (
    <g stroke={color} strokeWidth="4" strokeLinecap="round">
      {xs.map((x, i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x - 4} y2={y - 46} />
          <line x1={x + 8} y1={y} x2={x + 14} y2={y - 40} />
          <line x1={x + 4} y1={y} x2={x + 4} y2={y - 52} />
        </g>
      ))}
    </g>
  )
}

export function Butterfly({ s = 1, a = '#ff8c42', b = '#ffb02e' }) {
  return (
    <g transform={`scale(${s})`}>
      <g className="wing-l">
        <ellipse cx="-14" cy="-10" rx="16" ry="20" fill={a} />
        <ellipse cx="-14" cy="12" rx="14" ry="16" fill={b} />
        <circle cx="-16" cy="-12" r="5" fill="#ffffff" opacity="0.6" />
      </g>
      <g className="wing-r">
        <ellipse cx="14" cy="-10" rx="16" ry="20" fill={a} />
        <ellipse cx="14" cy="12" rx="14" ry="16" fill={b} />
        <circle cx="16" cy="-12" r="5" fill="#ffffff" opacity="0.6" />
      </g>
      <ellipse cx="0" cy="0" rx="4" ry="22" fill="#3a2a4d" />
      <circle cx="0" cy="-22" r="5" fill="#3a2a4d" />
      <g stroke="#3a2a4d" strokeWidth="2" strokeLinecap="round">
        <line x1="0" y1="-26" x2="-7" y2="-34" /><line x1="0" y1="-26" x2="7" y2="-34" />
      </g>
    </g>
  )
}

export function Gull({ s = 1 }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M-34 0 Q-18 -18 0 -2 Q18 -18 34 0 Q18 -8 0 4 Q-18 -8 -34 0Z" fill="#ffffff" stroke={OUT} strokeWidth="1.6" />
      <ellipse cx="0" cy="2" rx="9" ry="5" fill="#f2f4f8" stroke={OUT} strokeWidth="1.2" />
      <polygon points="8,1 15,3 8,4" fill="#f4a63a" />
      <circle cx="5" cy="0" r="1.2" fill={OUT} />
    </g>
  )
}

export function Ball({ s = 1 }) {
  return (
    <g transform={`scale(${s})`}>
      <circle r="16" fill="#ffffff" stroke={OUT} strokeWidth="2" />
      <polygon points="0,-6 6,-2 4,5 -4,5 -6,-2" fill={OUT} />
      <g stroke={OUT} strokeWidth="1.6">
        <line x1="0" y1="-6" x2="0" y2="-15" /><line x1="6" y1="-2" x2="14" y2="-6" />
        <line x1="4" y1="5" x2="9" y2="12" /><line x1="-4" y1="5" x2="-9" y2="12" /><line x1="-6" y1="-2" x2="-14" y2="-6" />
      </g>
    </g>
  )
}

// Çizgi film çocuk (baş + omuzlar). Portrelerde konu.
export function Kid({ x, y, s = 1, skin = '#f6c7a0', hair = '#5a3b22', shirt = '#4ea1ff', style = 'short', smile = true }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {style === 'long' && <path d="M-34 -8 Q-38 40 -26 60 L26 60 Q38 40 34 -8 Z" fill={hair} />}
      <path d="M-48 92 Q-46 50 0 46 Q46 50 48 92 Z" fill={shirt} stroke={OUT} strokeWidth="2" />
      <rect x="-8" y="30" width="16" height="20" rx="6" fill={skin} />
      <circle cx="0" cy="0" r="36" fill={skin} stroke={OUT} strokeWidth="2" />
      <ellipse cx="-36" cy="4" rx="6" ry="9" fill={skin} stroke={OUT} strokeWidth="1.5" />
      <ellipse cx="36" cy="4" rx="6" ry="9" fill={skin} stroke={OUT} strokeWidth="1.5" />
      {style === 'short' && <path d="M-36 -4 Q-38 -40 0 -40 Q38 -40 36 -4 Q30 -24 0 -24 Q-18 -24 -36 -4 Z" fill={hair} />}
      {style === 'long' && <path d="M-37 2 Q-40 -42 0 -42 Q40 -42 37 2 Q26 -22 -4 -26 Q-24 -16 -37 2 Z" fill={hair} />}
      {style === 'curly' && (
        <g fill={hair}>
          {[-30, -18, -6, 6, 18, 30].map((cx, i) => <circle key={i} cx={cx} cy={-26 - (i % 2) * 6} r="12" />)}
          <circle cx="-34" cy="-10" r="10" /><circle cx="34" cy="-10" r="10" />
        </g>
      )}
      <g fill={OUT}>
        <ellipse cx="-13" cy="2" rx="4" ry="5" /><ellipse cx="13" cy="2" rx="4" ry="5" />
      </g>
      <circle cx="-11.5" cy="0" r="1.4" fill="#fff" /><circle cx="14.5" cy="0" r="1.4" fill="#fff" />
      <g fill="#ff9aa8" opacity="0.6"><ellipse cx="-22" cy="14" rx="6" ry="3.5" /><ellipse cx="22" cy="14" rx="6" ry="3.5" /></g>
      {smile
        ? <path d="M-11 16 Q0 27 11 16 Q0 21 -11 16Z" fill="#c2405a" stroke={OUT} strokeWidth="1.5" />
        : <path d="M-6 19 Q0 22 6 19" stroke={OUT} strokeWidth="2" fill="none" strokeLinecap="round" />}
    </g>
  )
}

export function Boat({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-40 0 L40 0 L28 16 L-28 16 Z" fill="#c8553d" stroke={OUT} strokeWidth="1.8" />
      <rect x="-1.5" y="-62" width="3" height="62" fill="#5b3a22" />
      <polygon points="2,-60 2,-6 38,-6" fill="#ffffff" stroke={OUT} strokeWidth="1.5" />
      <polygon points="-2,-50 -2,-8 -28,-8" fill="#ffe08a" stroke={OUT} strokeWidth="1.5" />
    </g>
  )
}

export function Lamp({ x, y, s = 1, on = true }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-3" y="-120" width="6" height="120" fill="#2b3346" />
      <rect x="-12" y="-4" width="24" height="6" rx="2" fill="#2b3346" />
      <path d="M-14 -120 L14 -120 L9 -138 L-9 -138 Z" fill="#2b3346" />
      <rect x="-9" y="-132" width="18" height="12" fill={on ? '#ffe9a0' : '#c9d3e6'} />
    </g>
  )
}

export function Bench({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} fill="#7a4e2a" stroke={OUT} strokeWidth="1.2">
      <rect x="-40" y="-30" width="80" height="7" rx="2" />
      <rect x="-40" y="-18" width="80" height="7" rx="2" />
      <rect x="-36" y="-11" width="6" height="14" /><rect x="30" y="-11" width="6" height="14" />
    </g>
  )
}

export function Cat({ x, y, s = 1, color = '#2c2c3a' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M22 -6 Q44 -10 40 -34" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-14" rx="22" ry="16" fill={color} />
      <circle cx="-16" cy="-34" r="14" fill={color} />
      <polygon points="-28,-42 -26,-56 -18,-46" fill={color} /><polygon points="-12,-46 -4,-56 -4,-42" fill={color} />
      <g stroke="#b9663a" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
        <line x1="-4" y1="-26" x2="4" y2="-26" /><line x1="-2" y1="-18" x2="8" y2="-18" /><line x1="2" y1="-10" x2="10" y2="-10" />
      </g>
      <ellipse cx="-21" cy="-35" rx="3" ry="4" fill="#ffd34d" /><ellipse cx="-11" cy="-35" rx="3" ry="4" fill="#ffd34d" />
      <ellipse cx="-21" cy="-35" rx="1" ry="3" fill="#111" /><ellipse cx="-11" cy="-35" rx="1" ry="3" fill="#111" />
    </g>
  )
}

export function Ladybug({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx="0" cy="-10" r="6" fill="#1e1e28" />
      <ellipse cx="0" cy="2" rx="12" ry="13" fill="#e2393b" stroke="#1e1e28" strokeWidth="1.5" />
      <line x1="0" y1="-10" x2="0" y2="15" stroke="#1e1e28" strokeWidth="1.5" />
      <g fill="#1e1e28"><circle cx="-6" cy="-1" r="2.6" /><circle cx="6" cy="-1" r="2.6" /><circle cx="-5" cy="8" r="2.2" /><circle cx="5" cy="8" r="2.2" /></g>
      <circle cx="-3" cy="-12" r="1.4" fill="#fff" /><circle cx="3" cy="-12" r="1.4" fill="#fff" />
    </g>
  )
}

export function Bird({ s = 1 }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M8 2 L20 8 L9 9 Z" fill="#6b4a2e" stroke={OUT} strokeWidth="0.8" />
      <ellipse cx="0" cy="0" rx="11" ry="8" fill="#8a5a3a" stroke={OUT} strokeWidth="1" />
      <ellipse cx="-3" cy="2.5" rx="7" ry="5" fill="#ef7b45" />
      <circle cx="-8" cy="-6" r="6" fill="#8a5a3a" stroke={OUT} strokeWidth="1" />
      <polygon points="-14,-6 -19,-4.5 -14,-3.5" fill="#f4a63a" />
      <circle cx="-9.5" cy="-7" r="1.4" fill={OUT} /><circle cx="-10" cy="-7.5" r="0.5" fill="#fff" />
      <path d="M2 -2 Q8 -6 12 0" stroke="#6b4a2e" strokeWidth="2" fill="none" />
      <g stroke="#3a2a1a" strokeWidth="1"><line x1="-2" y1="7" x2="-3" y2="11" /><line x1="2" y1="7" x2="2" y2="11" /></g>
    </g>
  )
}

export function Fox({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M24 10 Q62 4 56 -30 Q48 -6 22 -6 Z" fill="#e8743b" stroke={OUT} strokeWidth="1.6" />
      <path d="M52 -26 Q58 -32 56 -30 Q60 -18 50 -14 Z" fill="#ffffff" />
      <ellipse cx="0" cy="0" rx="28" ry="22" fill="#e8743b" stroke={OUT} strokeWidth="1.8" />
      <ellipse cx="-4" cy="6" rx="14" ry="14" fill="#fff4e6" />
      <path d="M-26 -40 L-18 -64 L-6 -42 Z" fill="#e8743b" stroke={OUT} strokeWidth="1.6" />
      <path d="M6 -42 L18 -64 L26 -40 Z" fill="#e8743b" stroke={OUT} strokeWidth="1.6" />
      <path d="M-20 -44 L-17 -56 L-11 -45 Z" fill="#3a2a2a" /><path d="M11 -45 L17 -56 L20 -44 Z" fill="#3a2a2a" />
      <path d="M-28 -36 Q0 -54 28 -36 Q22 -10 0 -6 Q-22 -10 -28 -36 Z" fill="#e8743b" stroke={OUT} strokeWidth="1.8" />
      <path d="M-14 -22 Q0 -10 14 -22 Q8 -6 0 -6 Q-8 -6 -14 -22 Z" fill="#fff4e6" />
      <ellipse cx="-10" cy="-30" rx="3" ry="3.6" fill={OUT} /><ellipse cx="10" cy="-30" rx="3" ry="3.6" fill={OUT} />
      <circle cx="-9" cy="-31.5" r="1" fill="#fff" /><circle cx="11" cy="-31.5" r="1" fill="#fff" />
      <ellipse cx="0" cy="-17" rx="3.4" ry="2.6" fill={OUT} />
      <g fill="#3a2a2a"><ellipse cx="-14" cy="21" rx="7" ry="4" /><ellipse cx="10" cy="21" rx="7" ry="4" /></g>
    </g>
  )
}

export function Mushroom({ x, y, s = 1, cap = '#e2393b' }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-5" y="-12" width="10" height="14" rx="3" fill="#f5ecd9" stroke={OUT} strokeWidth="1" />
      <path d="M-16 -10 Q0 -30 16 -10 Z" fill={cap} stroke={OUT} strokeWidth="1.2" />
      <g fill="#ffffff"><circle cx="-6" cy="-16" r="2.2" /><circle cx="5" cy="-18" r="2.6" /><circle cx="10" cy="-12" r="1.6" /></g>
    </g>
  )
}

export function Book({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-34 0 L0 6 L0 -24 L-34 -30 Z" fill="#ffffff" stroke={OUT} strokeWidth="1.6" />
      <path d="M34 0 L0 6 L0 -24 L34 -30 Z" fill="#f6f1e6" stroke={OUT} strokeWidth="1.6" />
      <path d="M-36 2 L0 9 L36 2" stroke="#4ea1ff" strokeWidth="4" fill="none" />
      <g stroke="#b9c3d6" strokeWidth="1.2">
        <line x1="-28" y1="-20" x2="-6" y2="-16" /><line x1="-28" y1="-13" x2="-6" y2="-9" /><line x1="6" y1="-16" x2="28" y2="-20" /><line x1="6" y1="-9" x2="28" y2="-13" />
      </g>
    </g>
  )
}

// Basit deterministik rastgele (aynı sahne hep aynı çizilsin diye)
export function rng(seed) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
