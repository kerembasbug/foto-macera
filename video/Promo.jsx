import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion'
import Scene from '../src/Scene.jsx'
import Mascot from '../src/components/Mascot.jsx'
import { setLang, tx } from '../src/i18n.js'
import '../src/styles.css'

// Oyunun kendi sahne motoru ve maskotuyla kodla üretilen tanıtım videosu.
const FPS = 30
const S = (sec) => Math.round(sec * FPS)
const SHOTS = [
  { from: 0, len: 3.5, kind: 'intro' },
  { from: 3.5, len: 5.5, kind: 'aperture' },
  { from: 9, len: 5.5, kind: 'shutter' },
  { from: 14.5, len: 5, kind: 'zoom' },
  { from: 19.5, len: 5, kind: 'wb' },
  { from: 24.5, len: 5.5, kind: 'outro' },
]
export const PROMO_FRAMES = S(30)

const BG = 'radial-gradient(120% 100% at 50% 0%, #1b2a4a, #142038)'
const INK = '#eaf2ff'
const ease = Easing.bezier(0.45, 0, 0.2, 1)

export function Promo({ lang }) {
  setLang(lang)
  return (
    <AbsoluteFill style={{ background: BG, color: INK, fontFamily: "'Baloo 2', 'Comic Sans MS', 'Trebuchet MS', sans-serif" }}>
      {SHOTS.map((s) => (
        <Sequence key={s.kind} from={S(s.from)} durationInFrames={S(s.len)}>
          <Shot kind={s.kind} len={S(s.len)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  )
}

function Shot({ kind, len }) {
  const frame = useCurrentFrame()
  const fade = interpolate(frame, [0, 8, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const body = {
    intro: <Intro />, aperture: <Aperture len={len} />, shutter: <Shutter len={len} />,
    zoom: <Zoom len={len} />, wb: <WhiteBalance len={len} />, outro: <Outro />,
  }[kind]
  return <AbsoluteFill style={{ opacity: fade }}>{body}</AbsoluteFill>
}

function Pop({ delay = 0, children, style }) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 140 } })
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.4), ...style }}>{children}</div>
}

function Bob({ children }) {
  const frame = useCurrentFrame()
  return <div style={{ transform: `translateY(${Math.sin(frame / 7) * 10}px)` }}>{children}</div>
}

// Ekranın solunda fotoğraf, sağında anlatım + kaydırıcı
function Demo({ title, sub, sceneProps, slider, art, scene }) {
  return (
    <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 90, padding: 80 }}>
      <div style={{ position: 'relative', width: 960, height: 720, borderRadius: 36, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: '6px solid #0b1324' }}>
        <Scene art={art} scene={scene} paused {...sceneProps} />
      </div>
      <div style={{ width: 640 }}>
        <Pop delay={4}><h2 style={{ fontSize: 76, lineHeight: 1.05, margin: 0, fontWeight: 900 }}>{title}</h2></Pop>
        <Pop delay={10}><p style={{ fontSize: 40, opacity: 0.85, margin: '22px 0 46px', lineHeight: 1.25 }}>{sub}</p></Pop>
        {slider}
      </div>
    </AbsoluteFill>
  )
}

function Slider({ icon, label, value, t, left, right, color = '#4ea1ff' }) {
  return (
    <div style={{ background: '#243456', borderRadius: 28, padding: '26px 30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 40, fontWeight: 800 }}>
        <span>{icon} {label}</span><span style={{ color: '#f4b740' }}>{value}</span>
      </div>
      <div style={{ position: 'relative', height: 18, borderRadius: 9, background: '#16233f', margin: '24px 0 14px' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${t * 100}%`, borderRadius: 9, background: color }} />
        <div style={{ position: 'absolute', top: -13, left: `calc(${t * 100}% - 22px)`, width: 44, height: 44, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, opacity: 0.7 }}><span>{left}</span><span>{right}</span></div>
    </div>
  )
}

const prog = (frame, len) => interpolate(frame, [18, len - 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease })

function Intro() {
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Pop><Bob><Mascot size={300} mood="cheer" /></Bob></Pop>
      <Pop delay={8}><h1 style={{ fontSize: 150, margin: 0, fontWeight: 900, letterSpacing: -2 }}>{tx('Foto Macera', 'Photo Quest')}</h1></Pop>
      <Pop delay={16}><p style={{ fontSize: 52, margin: 0, opacity: 0.9 }}>{tx('Oynayarak fotoğrafçılık öğren! 📸', 'Learn photography by playing! 📸')}</p></Pop>
    </AbsoluteFill>
  )
}

function Aperture({ len }) {
  const t = prog(useCurrentFrame(), len)
  const F = ['16', '11', '8', '5.6', '4', '2.8', '2', '1.4']
  return (
    <Demo art="garden" scene="cloudy"
      title={tx('Diyaframı aç…', 'Open the aperture…')}
      sub={tx('…arka plan sihirli gibi erisin!', '…and watch the background melt!')}
      sceneProps={{ bgBlur: interpolate(t, [0, 1], [0.4, 13]) }}
      slider={<Slider icon="🔵" label={tx('Diyafram', 'Aperture')} value={`f/${F[Math.round(t * 7)]}`} t={t} left="f/16" right="f/1.4" />}
    />
  )
}

function Shutter({ len }) {
  const t = prog(useCurrentFrame(), len)
  const L = ['1/15', '1/30', '1/60', '1/125', '1/250', '1/500', '1/1000']
  return (
    <Demo art="meadow" scene="sunny"
      title={tx('Perdeyi hızlandır…', 'Speed up the shutter…')}
      sub={tx('…uçan kelebeği dondur!', '…and freeze the flying butterfly!')}
      sceneProps={{ moving: true, motionBlur: interpolate(t, [0, 1], [14, 0]), bgBlur: 2 }}
      slider={<Slider icon="⏱️" label={tx('Enstantane', 'Shutter')} value={L[Math.round(t * 6)]} t={t} left="1/15" right="1/1000" color="#ff8c42" />}
    />
  )
}

function Zoom({ len }) {
  const t = prog(useCurrentFrame(), len)
  const MM = [24, 35, 50, 85, 135, 200]
  return (
    <Demo art="birdtree" scene="sunny"
      title={tx('Zumla yaklaş…', 'Zoom in close…')}
      sub={tx('…ama titretme!', '…but keep it steady!')}
      sceneProps={{ zoom: interpolate(t, [0, 1], [1, 3.6]), bgBlur: interpolate(t, [0, 1], [1, 4]) }}
      slider={<Slider icon="🔭" label={tx('Zum', 'Zoom')} value={`${MM[Math.round(t * 5)]} mm`} t={t} left="24 mm" right="200 mm" color="#3ddc84" />}
    />
  )
}

function WhiteBalance({ len }) {
  const t = prog(useCurrentFrame(), len)
  return (
    <Demo art="room" scene="indoor"
      title={tx('Işığın rengini yakala', 'Catch the color of light')}
      sub={tx('Beyaz dengesiyle turuncu ampul ışığını düzelt.', 'Fix orange bulb light with white balance.')}
      sceneProps={{ cast: interpolate(t, [0, 1], [175, 0]), bgBlur: 5 }}
      slider={<Slider icon="⚪" label={tx('Beyaz Dengesi', 'White Balance')} value={t > 0.5 ? tx('💡 Ampul', '💡 Bulb') : tx('☀️ Gün ışığı', '☀️ Daylight')} t={1 - t} left="2800 K" right="8000 K" color="#ff6f91" />}
    />
  )
}

function Outro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 26 }}>
      <div style={{ display: 'flex', gap: 30 }}>
        {[0, 1, 2].map((i) => {
          const s = spring({ frame: frame - 6 - i * 8, fps, config: { damping: 9, stiffness: 160 } })
          return <span key={i} style={{ fontSize: 170, color: '#f4b740', transform: `scale(${s}) rotate(${(1 - s) * -40}deg)`, display: 'inline-block', textShadow: '0 10px 40px rgba(244,183,64,0.5)' }}>★</span>
        })}
      </div>
      <Pop delay={30}><h2 style={{ fontSize: 96, margin: 0, fontWeight: 900 }}>{tx('5 dünya · 15 görev', '5 worlds · 15 missions')}</h2></Pop>
      <Pop delay={38}><p style={{ fontSize: 46, margin: 0, opacity: 0.9 }}>{tx('Reklam yok · Satın alma yok · 6–12 yaş', 'No ads · No purchases · Ages 6–12')}</p></Pop>
      <Pop delay={48} style={{ display: 'flex', alignItems: 'center', gap: 30, marginTop: 20 }}>
        <Mascot size={150} mood="happy" />
        <span style={{ fontSize: 64, fontWeight: 900 }}>{tx('Foto Macera', 'Photo Quest')}</span>
      </Pop>
    </AbsoluteFill>
  )
}
