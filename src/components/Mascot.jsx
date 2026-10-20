import { m as motion } from 'motion/react'
import { tx } from '../i18n.js'

// "Çıt" — oyunun rehber maskotu. Kodla çizilmiş vektör (SVG):
// her boyutta keskin, 6 duygu hali, göz kırpar ve duyguya göre hareket eder.
//   mood: 'idle' | 'happy' | 'cheer' | 'wow' | 'sad' | 'think'

const INK = '#13213a'
const BLUE = '#2f8fdc'
const BLUE_D = '#1f6fb3'
const YELLOW = '#f6c544'

// Duyguya göre gövde hareketi
const BODY_MOTION = {
  idle: { animate: { y: [0, -2.5, 0] }, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
  think: { animate: { rotate: [0, -4, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  happy: { animate: { y: [0, -6, 0], scaleY: [1, 0.96, 1] }, transition: { duration: 0.9, repeat: Infinity, ease: 'easeOut' } },
  cheer: { animate: { y: [0, -12, 0], rotate: [0, -5, 5, 0] }, transition: { duration: 0.7, repeat: Infinity, ease: 'easeOut' } },
  wow: { animate: { scale: [1, 1.08, 1] }, transition: { duration: 0.5, repeat: 1 } },
  sad: { animate: { y: [0, 2, 0], rotate: [0, -2, 0] }, transition: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } },
}

const CAN_BLINK = { idle: true, think: true, wow: false, sad: true, happy: false, cheer: false }

export default function Mascot({ size = 56, mood = 'idle', className = '' }) {
  const m = BODY_MOTION[mood] ?? BODY_MOTION.idle
  return (
    <motion.svg
      key={mood}
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`mascot ${className}`}
      role="img"
      aria-label={tx('Çıt, fotoğraf makinesi maskotu', 'Click, the camera mascot')}
      style={{ overflow: 'visible', transformOrigin: '50% 90%' }}
      {...m}
    >
      <defs>
        <radialGradient id="lensGlass" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#3f86c4" />
          <stop offset="60%" stopColor="#173f68" />
          <stop offset="100%" stopColor="#0c2340" />
        </radialGradient>
      </defs>

      {mood === 'cheer' && <Arms />}
      {mood === 'cheer' && <Sparkles />}
      {mood === 'think' && <Bulb />}

      {/* flaş ve deklanşör tuşu (gövdenin arkasında) */}
      <rect x="44" y="16" width="32" height="22" rx="4" fill={BLUE} stroke={INK} strokeWidth="3.5" />
      <rect x="49" y="20" width="22" height="10" rx="2" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
      <rect x="17" y="27" width="16" height="9" rx="3" fill={YELLOW} stroke={INK} strokeWidth="3" />

      {/* gövde */}
      <rect x="8" y="33" width="104" height="72" rx="15" fill={BLUE} stroke={INK} strokeWidth="4" />
      <rect x="14" y="39" width="92" height="10" rx="5" fill="#ffffff" opacity="0.18" />

      {/* lens halkası */}
      <circle cx="60" cy="70" r="31" fill={BLUE_D} stroke={INK} strokeWidth="4" />
      <circle cx="60" cy="70" r="24.5" fill="url(#lensGlass)" stroke={INK} strokeWidth="2.5" />
      <path d="M44 60 A19 19 0 0 1 58 50" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.55" />

      <Face mood={mood} blink={CAN_BLINK[mood]} />
    </motion.svg>
  )
}

function Face({ mood, blink }) {
  return (
    <g>
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        animate={blink ? { scaleY: [1, 1, 0.12, 1] } : undefined}
        transition={blink ? { duration: 3.8, times: [0, 0.92, 0.95, 1], repeat: Infinity } : undefined}
      >
        <Eyes mood={mood} />
      </motion.g>
      <Mouth mood={mood} />
      {(mood === 'happy' || mood === 'cheer') && (
        <g fill="#ff8fb1" opacity="0.75">
          <ellipse cx="45" cy="76" rx="4" ry="2.4" />
          <ellipse cx="75" cy="76" rx="4" ry="2.4" />
        </g>
      )}
      {mood === 'sad' && <path d="M72 70 q2.5 5 0 7 q-2.5 -2 0 -7z" fill="#8fd3ff" stroke={INK} strokeWidth="1" />}
    </g>
  )
}

function Eyes({ mood }) {
  const W = '#ffffff'
  if (mood === 'happy') {
    return (
      <g stroke={W} strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M45 66 q5 -7 10 0" /><path d="M65 66 q5 -7 10 0" />
      </g>
    )
  }
  if (mood === 'cheer') {
    return (
      <g fill={YELLOW} stroke={INK} strokeWidth="1">
        <Star cx={50} cy={64} r={6.5} /><Star cx={70} cy={64} r={6.5} />
      </g>
    )
  }
  if (mood === 'sad') {
    return (
      <g>
        <g fill={W}><ellipse cx="50" cy="66" rx="4.2" ry="4.6" /><ellipse cx="70" cy="66" rx="4.2" ry="4.6" /></g>
        <g stroke={W} strokeWidth="2.6" strokeLinecap="round">
          <line x1="44" y1="60" x2="54" y2="56" /><line x1="76" y1="60" x2="66" y2="56" />
        </g>
      </g>
    )
  }
  const big = mood === 'wow'
  const look = mood === 'think' ? { dx: 2, dy: -2.5 } : { dx: 0, dy: 0 }
  return (
    <g>
      {big && (
        <g stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round">
          <path d="M44 54 q6 -4 11 -1" fill="none" /><path d="M65 53 q5 -3 11 1" fill="none" />
        </g>
      )}
      <g fill="#ffffff">
        <ellipse cx="50" cy="64" rx={big ? 6.5 : 5} ry={big ? 7.5 : 6.2} />
        <ellipse cx="70" cy="64" rx={big ? 6.5 : 5} ry={big ? 7.5 : 6.2} />
      </g>
      <g fill={INK}>
        <circle cx={50 + look.dx} cy={65 + look.dy} r={big ? 3.2 : 2.6} />
        <circle cx={70 + look.dx} cy={65 + look.dy} r={big ? 3.2 : 2.6} />
      </g>
      <g fill="#ffffff">
        <circle cx={48.6 + look.dx} cy={62.6 + look.dy} r="1.1" />
        <circle cx={68.6 + look.dx} cy={62.6 + look.dy} r="1.1" />
      </g>
    </g>
  )
}

function Mouth({ mood }) {
  switch (mood) {
    case 'happy':
    case 'cheer':
      return <path d="M49 76 q11 13 22 0 z" fill="#ff6b8b" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" />
    case 'wow':
      return <ellipse cx="60" cy="80" rx="4.4" ry="5.4" fill="#ff6b8b" stroke="#ffffff" strokeWidth="2.2" />
    case 'sad':
      return <path d="M52 83 q8 -7 16 0" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
    case 'think':
      return <path d="M54 79 q6 3 12 -1" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
    default:
      return <path d="M52 76 q8 9 16 0 z" fill="#ff6b8b" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" />
  }
}

function Star({ cx, cy, r }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? r * 0.45 : r
    return `${cx + rr * Math.cos(a)},${cy + rr * Math.sin(a)}`
  }).join(' ')
  return <polygon points={pts} />
}

function Arms() {
  return (
    <g stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill={BLUE}>
      <path d="M12 56 C2 46 0 34 4 24" fill="none" strokeWidth="12" stroke={INK} />
      <path d="M12 56 C2 46 0 34 4 24" fill="none" strokeWidth="6.5" stroke={BLUE} />
      <circle cx="4" cy="21" r="7" />
      <path d="M108 56 C118 46 120 34 116 24" fill="none" strokeWidth="12" stroke={INK} />
      <path d="M108 56 C118 46 120 34 116 24" fill="none" strokeWidth="6.5" stroke={BLUE} />
      <circle cx="116" cy="21" r="7" />
    </g>
  )
}

function Sparkles() {
  return (
    <motion.g
      fill={YELLOW} stroke={INK} strokeWidth="1"
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 0.9, repeat: Infinity }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <Star cx={22} cy={8} r={6} /><Star cx={98} cy={6} r={5} /><Star cx={60} cy={-2} r={4} />
    </motion.g>
  )
}

function Bulb() {
  return (
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
      <circle cx="96" cy="8" r="9" fill="#fff3a8" stroke={INK} strokeWidth="2.5" />
      <rect x="92" y="16" width="8" height="5" rx="1.5" fill="#c9d3e6" stroke={INK} strokeWidth="2" />
      <g stroke={YELLOW} strokeWidth="2.4" strokeLinecap="round">
        <line x1="96" y1="-6" x2="96" y2="-10" /><line x1="108" y1="2" x2="112" y2="0" /><line x1="84" y1="2" x2="80" y2="0" />
      </g>
    </motion.g>
  )
}
