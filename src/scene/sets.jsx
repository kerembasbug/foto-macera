// 9 benzersiz sahne. Her sahne katmanlardan oluşur; her katmanın kameraya "uzaklığı" (depth) var:
//   depth 1 = en uzak (gökyüzü/dağ) · 0 = konu (hep net) · eksi = konunun ÖNÜNDEKİ şeyler.
// Diyafram açılınca her katman uzaklığı kadar bulanır — gerçek lens gibi.
// lights: parlak noktalar (pencere, yıldızlı ışık, parıltı) → geniş diyaframda bokeh dairesi olur.
import {
  OUT, Cloud, Mountains, Hills, Tree, Pine, House, Fence, Flower, Grass,
  Butterfly, Gull, Ball, Kid, Boat, Lamp, Bench, Cat, Ladybug, Bird, Fox, Mushroom, Book, rng,
} from './parts.jsx'
import { localize } from '../i18n.js'

const FLOWER_COLORS = ['#ff6f91', '#ffd34d', '#b07bff', '#ffffff', '#ff9a4d']

function flowerField(seed, n, yMin, yMax, sMin, sMax) {
  const r = rng(seed)
  return Array.from({ length: n }, (_, i) => {
    const x = r() * 420 - 10
    const y = yMin + r() * (yMax - yMin)
    return <Flower key={i} x={x} y={y} s={sMin + r() * (sMax - sMin)} color={FLOWER_COLORS[(r() * 5) | 0]} h={22} />
  })
}

export const SETS = {
  // ── Portre: bahçede arkadaşın ──
  garden: {
    label: ['Bahçe Portresi', 'Garden Portrait'], clouds: true, focus: [200, 168],
    build: (p) => {
      const r = rng(7)
      return {
        layers: [
          { depth: 1, el: (<g>
            <Hills y={150} fill={p.treeDark} amp={10} seed={40} />
            <Tree x={50} y={128} s={1.1} p={p} dark />
            <House x={312} y={168} s={1.15} p={p} lit={p.night} />
            <Tree x={385} y={135} s={0.9} p={p} />
          </g>) },
          { depth: 0.6, el: (<g>
            <rect x="-10" y="178" width="420" height="122" fill={p.ground[1]} />
            <Fence y={205} color={p.night ? '#6b6478' : '#efe0c0'} />
            {[20, 90, 300, 380].map((x, i) => <circle key={i} cx={x} cy={200} r={26} fill={p.tree} />)}
          </g>) },
        ],
        lights: Array.from({ length: 16 }, () => ({
          x: r() * 400, y: 182 + r() * 30, r: 3.2, depth: 0.6, color: FLOWER_COLORS[(r() * 5) | 0],
        })),
        subject: <Kid x={200} y={176} s={1.25} hair="#3b2416" shirt="#ff8c42" style="curly" />,
        fg: [{ depth: -0.6, el: (<g>
          <Flower x={36} y={262} s={1.9} color="#ff6f91" h={30} />
          <Grass y={300} color="#2f7a22" xs={[338, 362]} />
        </g>) }],
      }
    },
  },

  // ── Manzara: vadi (her şey net olmalı) ──
  valley: {
    label: ['Vadi Manzarası', 'Valley View'], clouds: true, focus: [200, 200],
    build: (p) => ({
      layers: [
        { depth: 1, el: <Mountains p={p} y={172} /> },
        { depth: 0.7, el: (<g>
          <Hills y={170} fill={p.mid} amp={8} seed={10} />
          <ellipse cx="200" cy="186" rx="120" ry="12" fill={p.water[0]} opacity="0.9" />
          <House x={95} y={180} s={0.42} p={p} lit={p.night} />
          <House x={128} y={184} s={0.36} p={p} lit={p.night} />
          <House x={305} y={182} s={0.4} p={p} lit={p.night} />
        </g>) },
        { depth: 0.4, el: (<g>
          <Hills y={212} fill={p.near} amp={12} seed={90} />
          <Pine x={48} y={214} s={0.95} fill={p.treeDark} trunk={p.trunk} />
          <Pine x={78} y={218} s={0.7} fill={p.tree} trunk={p.trunk} />
          <Pine x={352} y={216} s={1.05} fill={p.treeDark} trunk={p.trunk} />
        </g>) },
      ],
      lights: [],
      subject: (<g>
        <rect x="-10" y="244" width="420" height="60" fill={p.ground[1]} />
        <rect x="196" y="196" width="8" height="64" fill="#7a4e2a" stroke={OUT} strokeWidth="1.2" />
        <path d="M168 200 L226 200 L238 211 L226 222 L168 222 Z" fill="#e9c27a" stroke={OUT} strokeWidth="1.5" />
        <path d="M184 211 L214 211 M206 205 L214 211 L206 217" stroke={OUT} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        {flowerField(3, 7, 252, 270, 0.55, 0.75)}
      </g>),
      fg: [{ depth: -0.35, el: (<g fill="#8b8f99" stroke={OUT} strokeWidth="1.2">
        <path d="M-10 300 Q10 262 46 270 Q66 280 70 300 Z" /><path d="M350 300 Q368 276 404 282 L410 300 Z" />
      </g>) }],
    }),
  },

  // ── Makro: çiçek üstünde uğur böceği ──
  macro: {
    label: ['Makro Çiçek', 'Macro Flower'], clouds: false,
    build: (p) => {
      const r = rng(21)
      return {
        layers: [
          { depth: 1, el: <Hills y={168} fill={p.mid} amp={10} seed={5} /> },
          { depth: 0.7, el: (<g>
            <rect x="-10" y="190" width="420" height="120" fill={p.ground[0]} />
            {flowerField(11, 18, 185, 250, 0.7, 1.1)}
          </g>) },
        ],
        lights: Array.from({ length: 16 }, () => ({
          x: r() * 400, y: 30 + r() * 150, r: 2.6, depth: 0.95,
          color: ['#ffe2a8', '#ffc27a', '#fff4d6'][(r() * 3) | 0],
        })),
        subject: (<g>
          <path d="M212 168 Q206 240 214 304" stroke="#3f8f2c" strokeWidth="9" fill="none" />
          <ellipse cx="240" cy="236" rx="30" ry="11" fill="#3f8f2c" transform="rotate(-30 240 236)" />
          <Flower x={212} y={146} s={3.3} color="#ff5f8f" center="#ffcf3d" h={0} />
          <Ladybug x={238} y={122} s={1.25} />
        </g>),
        fg: [{ depth: -0.75, el: <Grass y={300} color="#2f7a22" xs={[10, 30, 360, 382]} /> }],
      }
    },
  },

  // ── Çayır: uçan kelebek ──
  meadow: {
    label: ['Kelebek Çayırı', 'Butterfly Meadow'], clouds: true, motion: 'flutter',
    build: (p) => ({
      layers: [
        { depth: 1, el: <Mountains p={p} y={172} snow={false} /> },
        { depth: 0.6, el: (<g>
          <Hills y={165} fill={p.ground[0]} amp={12} seed={30} />
          <Tree x={70} y={130} s={1} p={p} />
          <Tree x={338} y={142} s={0.82} p={p} dark />
        </g>) },
        { depth: 0.3, el: <g>{flowerField(5, 10, 205, 240, 0.5, 0.7)}</g> },
      ],
      lights: [],
      subject: <g transform="translate(200,140)"><Butterfly s={1.1} /></g>,
      still: <Flower x={112} y={240} s={1.1} color="#ff6f91" h={60} />,
      fg: [{ depth: -0.5, el: <Grass y={300} color="#3f8f2c" xs={[30, 352]} /> }],
    }),
  },

  // ── Sahil: uçan martı ──
  beach: {
    label: ['Gün Batımı Sahili', 'Sunset Beach'], clouds: true, motion: 'glide',
    build: (p) => ({
      layers: [
        { depth: 1, el: (<g>
          <path d="M260 156 Q300 128 350 140 Q380 146 410 156 Z" fill={p.far} />
          <rect x="-10" y="155" width="420" height="70" fill={p.water[0]} />
          <rect x="-10" y="185" width="420" height="40" fill={p.water[1]} opacity="0.6" />
        </g>) },
        { depth: 0.6, el: (<g stroke="#ffffff" strokeWidth="2" opacity="0.6" strokeLinecap="round">
          <line x1="40" y1="176" x2="90" y2="176" /><line x1="150" y1="190" x2="210" y2="190" /><line x1="270" y1="200" x2="330" y2="200" />
          <g transform="translate(320,172) scale(0.38)" stroke="none" opacity="1"><Boat x={0} y={0} /></g>
        </g>) },
        { depth: 0.3, el: (<g>
          <path d="M-10 214 Q120 204 220 214 Q320 222 410 210 L410 300 L-10 300 Z" fill={p.sand} />
          <g fill="#ffffff" opacity="0.8"><ellipse cx="90" cy="248" rx="5" ry="3" /><ellipse cx="270" cy="262" rx="6" ry="3.5" /></g>
        </g>) },
      ],
      lights: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
        x: 230 + i * 17 + (i % 3) * 5, y: 162 + (i % 4) * 9, r: 2.2, depth: 0.95, color: '#ffe0a6',
      })),
      subject: <g transform="translate(140,104)"><Gull s={1.35} /></g>,
      fg: [{ depth: -0.5, el: <Grass y={300} color="#a68c4a" xs={[14, 360]} /> }],
    }),
  },

  // ── Stadyum: uçan top ──
  stadium: {
    label: ['Futbol Sahası', 'Football Field'], clouds: true, motion: 'kick',
    build: (p) => {
      const r = rng(77)
      return {
        layers: [
          { depth: 1, el: (<g>
            <rect x="-10" y="60" width="420" height="100" fill={p.night ? '#2a2f45' : '#7f8aa6'} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x="-10" y={66 + i * 24} width="420" height="4" fill="#ffffff" opacity="0.18" />)}
          </g>) },
          { depth: 0.6, el: (<g>
            {['#4ea1ff', '#f4b740', '#3ddc84', '#ff6f91', '#b07bff'].map((c, i) => (
              <rect key={i} x={-10 + i * 86} y="160" width="86" height="18" fill={c} stroke={OUT} strokeWidth="1" />
            ))}
            <rect x="-10" y="178" width="420" height="130" fill={p.ground[0]} />
            <g stroke="#ffffff" strokeWidth="4" fill="none"><path d="M262 232 L262 188 L380 188 L380 232" /></g>
            <g stroke="#ffffff" strokeWidth="1" opacity="0.5">
              {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={268 + i * 20} y1="188" x2={268 + i * 20} y2="232" />)}
            </g>
          </g>) },
          { depth: 0.3, el: (<g>
            {[0, 1, 2, 3].map((i) => <rect key={i} x="-10" y={235 + i * 18} width="420" height="9" fill={p.ground[1]} opacity="0.55" />)}
            <path d="M-10 262 Q200 248 410 262" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.8" />
          </g>) },
        ],
        lights: Array.from({ length: 34 }, () => ({
          x: r() * 400, y: 70 + r() * 84, r: 2.4, depth: 1,
          color: ['#ff6f91', '#ffd34d', '#ffffff', '#4ea1ff', '#3ddc84'][(r() * 5) | 0],
        })),
        subject: <g transform="translate(110,176)"><Ball s={1.25} /></g>,
        fg: [],
      }
    },
  },

  // ── Şehir gecesi: bankta kedi ──
  city: {
    label: ['Gece Şehri', 'City at Night'], clouds: false,
    build: (p) => {
      const r = rng(55)
      const lights = []
      const far = [[0, 70, 60], [62, 46, 80], [112, 90, 54], [170, 30, 70], [244, 60, 64], [310, 40, 92], [360, 76, 50]]
      const farEls = far.map(([x, top, w], i) => {
        for (let wy = top + 10; wy < 168; wy += 14) for (let wx = x + 7; wx < x + w - 6; wx += 12) {
          if (r() < (p.night ? 0.45 : 0)) lights.push({ x: wx + 2, y: wy + 3, r: 2.3, depth: 1, color: ['#ffd56b', '#ffeaa8', '#9fd3ff'][(r() * 3) | 0] })
        }
        return <rect key={i} x={x} y={top} width={w} height={180 - top} fill={p.night ? '#1b2440' : '#8d97b3'} />
      })
      const mid = [[20, 120, 70], [250, 110, 90]]
      const midEls = mid.map(([x, top, w], i) => {
        for (let wy = top + 12; wy < 200; wy += 18) for (let wx = x + 10; wx < x + w - 8; wx += 18) {
          if (r() < (p.night ? 0.55 : 0)) lights.push({ x: wx + 3, y: wy + 4, r: 3, depth: 0.6, color: '#ffcf70' })
        }
        return <rect key={i} x={x} y={top} width={w} height={210 - top} fill={p.night ? '#141b33' : '#6f7a97'} stroke={OUT} strokeWidth="1" />
      })
      return {
        layers: [
          { depth: 1, el: <g>{farEls}</g> },
          { depth: 0.6, el: <g>{midEls}</g> },
          { depth: 0.3, el: (<g>
            <rect x="-10" y="210" width="420" height="100" fill={p.night ? '#262a3a' : '#9aa0ad'} />
            <rect x="-10" y="210" width="420" height="6" fill="#ffffff" opacity="0.12" />
          </g>) },
        ],
        lights,
        subject: (<g>
          <Lamp x={108} y={272} s={1.1} on={p.night} />
          <Bench x={238} y={276} s={1.35} />
          <Cat x={232} y={237} s={1.3} color="#e8955a" />
        </g>),
        subjectLights: p.night ? [{ x: 108, y: 126, r: 24, color: 'rgba(255,233,160,0.35)' }, { x: 160, y: 250, r: 90, color: 'rgba(255,220,140,0.10)' }] : [],
        fg: [],
      }
    },
  },

  // ── Göl: yelkenli ──
  lake: {
    label: ['Göl Kıyısı', 'Lakeside'], clouds: true,
    build: (p) => ({
      layers: [
        { depth: 1, el: <Mountains p={p} y={168} snow={false} /> },
        { depth: 0.75, el: (<g>
          {[20, 50, 80, 300, 330, 362, 392].map((x, i) => <Pine key={i} x={x} y={170} s={0.48 + (i % 3) * 0.08} fill={p.treeDark} trunk={p.trunk} />)}
          <rect x="-10" y="168" width="420" height="140" fill={p.water[0]} />
          <rect x="-10" y="215" width="420" height="100" fill={p.water[1]} opacity="0.55" />
          <g stroke="#ffffff" strokeWidth="1.5" opacity="0.35">
            <line x1="60" y1="190" x2="120" y2="190" /><line x1="250" y1="202" x2="330" y2="202" /><line x1="120" y1="250" x2="190" y2="250" />
          </g>
        </g>) },
      ],
      lights: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ x: 150 + i * 14, y: 178 + (i % 3) * 6, r: 2, depth: 0.75, color: '#ffe0a6' })),
      subject: (<g>
        <Boat x={212} y={214} s={1.15} />
        <g opacity="0.25" transform="translate(212,262) scale(1.15,-0.5)"><Boat x={0} y={0} /></g>
      </g>),
      fg: [{ depth: -0.45, el: (<g>
        <g fill="#7a5130" stroke={OUT} strokeWidth="1">
          {[0, 1, 2, 3].map((i) => <rect key={i} x={300 + i * 26} y={268} width="24" height="40" />)}
        </g>
        <Grass y={300} color="#36622a" xs={[12, 40]} />
      </g>) }],
    }),
  },

  // ── Gece portresi: ışık zinciri önünde ──
  fairy: {
    label: ['Işıklı Gece Portresi', 'Night Lights Portrait'], clouds: false,
    build: (p) => {
      const lights = []
      const strands = [[40, 70, 34], [110, 120, 26]]
      const strandEls = strands.map(([y0, sag, step], si) => {
        let d = `M-10 ${y0}`
        for (let x = -10; x <= 410; x += step) {
          const t = (x + 10) / 420
          const y = y0 + Math.sin(t * Math.PI * 2) * 10 + sag * 4 * t * (1 - t) * 0.6
          d += ` L${x} ${y}`
          lights.push({ x, y: y + 5, r: 3.4, depth: 0.85, color: ['#ffd56b', '#ff9a6b', '#ffe9b8', '#ff7fae'][(x / step + si) % 4 | 0] })
        }
        return <path key={si} d={d} stroke="#2a2f3e" strokeWidth="1.5" fill="none" />
      })
      return {
        layers: [
          { depth: 1, el: (<g>
            {[30, 90, 150, 260, 330, 390].map((x, i) => <Pine key={i} x={x} y={200} s={1.1 + (i % 2) * 0.25} fill={p.treeDark} trunk={p.trunk} />)}
          </g>) },
          { depth: 0.85, el: <g>{strandEls}</g> },
          { depth: 0.5, el: (<g>
            <rect x="-10" y="210" width="420" height="100" fill={p.ground[1]} />
            <path d="M286 232 L330 170 L374 232 Z" fill={p.night ? '#d89a4a' : '#e6b061'} stroke={OUT} strokeWidth="1.5" />
            <path d="M318 232 L330 196 L342 232 Z" fill={p.night ? '#ffe2a0' : '#7a5130'} />
          </g>) },
        ],
        lights,
        subject: <Kid x={180} y={182} s={1.22} hair="#2a1a12" shirt="#b07bff" style="long" />,
        fg: [],
      }
    },
  },
  // ── Zum: dalda küçük kuş ──
  birdtree: {
    label: ['Daldaki Kuş', 'Bird on a Branch'], clouds: true, focus: [258, 112],
    build: (p) => ({
      layers: [
        { depth: 1, el: <Mountains p={p} y={176} snow={false} /> },
        { depth: 0.6, el: (<g>
          <Hills y={172} fill={p.mid} amp={10} seed={60} />
          <Tree x={60} y={150} s={0.8} p={p} dark /><Tree x={150} y={160} s={0.6} p={p} />
        </g>) },
        { depth: 0.3, el: (<g>
          <rect x="-10" y="215" width="420" height="100" fill={p.ground[0]} />
          {flowerField(9, 12, 222, 280, 0.6, 0.9)}
        </g>) },
      ],
      lights: [],
      subject: (<g>
        <path d="M330 310 Q326 200 340 120 Q350 60 330 -10 L370 -10 Q380 80 372 150 Q364 230 370 310 Z" fill={p.trunk} stroke={OUT} strokeWidth="2" />
        <path d="M338 128 Q300 118 236 122" stroke={p.trunk} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M290 121 Q284 108 270 104" stroke={p.trunk} strokeWidth="3" fill="none" strokeLinecap="round" />
        {[[236, 120], [252, 128], [276, 104], [300, 116]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="9" ry="5" fill={p.tree} transform={`rotate(${i * 35 - 20} ${x} ${y})`} />
        ))}
        <circle cx="370" cy="30" r="46" fill={p.tree} /><circle cx="330" cy="10" r="34" fill={p.treeDark} />
        <g transform="translate(258,111)"><Bird s={1} /></g>
      </g>),
      fg: [],
    }),
  },

  // ── Beyaz dengesi: gölgeli orman ──
  forest: {
    label: ['Gölgeli Orman', 'Shady Forest'], clouds: false, focus: [200, 200],
    build: (p) => {
      const r = rng(33)
      return {
        layers: [
          { depth: 1, el: (<g>
            {[10, 60, 110, 170, 230, 290, 350, 400].map((x, i) => (
              <Pine key={i} x={x} y={190} s={1.3 + (i % 3) * 0.2} fill={i % 2 ? p.treeDark : p.tree} trunk={p.trunk} />
            ))}
          </g>) },
          { depth: 0.6, el: (<g>
            <rect x="-10" y="186" width="420" height="120" fill={p.ground[1]} />
            {[40, 120, 300, 370].map((x, i) => (
              <rect key={i} x={x - 9} y={-10} width="18" height={214} fill={p.trunk} opacity="0.9" />
            ))}
            <path d="M120 300 Q180 220 200 196 Q220 220 290 300 Z" fill="#c9b48a" opacity="0.7" />
          </g>) },
          { depth: 0.3, el: (<g>
            <Mushroom x={92} y={258} s={1.1} /><Mushroom x={312} y={266} s={0.9} cap="#f0a83a" />
            {[30, 70, 330, 372].map((x, i) => <ellipse key={i} cx={x} cy={262} rx="26" ry="12" fill={p.tree} />)}
          </g>) },
        ],
        lights: Array.from({ length: 14 }, () => ({
          x: r() * 400, y: 20 + r() * 150, r: 3, depth: 1, color: ['#fff6c9', '#e9ffd0'][(r() * 2) | 0],
        })),
        subject: <Fox x={200} y={232} s={1.05} />,
        fg: [{ depth: -0.55, el: <Grass y={300} color="#2c5f2c" xs={[8, 34, 352, 378]} /> }],
      }
    },
  },

  // ── Beyaz dengesi: ampul ışığında oda ──
  room: {
    label: ['Kitap Köşesi', 'Reading Corner'], clouds: false, focus: [196, 176],
    build: (p) => ({
      layers: [
        { depth: 1, el: (<g>
          <rect x="-10" y="-10" width="420" height="320" fill={p.wall} />
          <rect x="250" y="34" width="110" height="96" rx="4" fill="#1d2a4f" stroke="#a08f73" strokeWidth="6" />
          <line x1="305" y1="34" x2="305" y2="130" stroke="#a08f73" strokeWidth="4" />
          <g fill="#ffffff"><circle cx="270" cy="56" r="1.4" /><circle cx="330" cy="70" r="1.2" /><circle cx="290" cy="100" r="1.1" /></g>
          <circle cx="340" cy="54" r="10" fill="#eef3ff" />
          <rect x="40" y="46" width="64" height="48" fill="#ffffff" stroke="#7a5232" strokeWidth="5" />
          <polygon points="46,88 66,64 80,78 90,70 98,88" fill="#7cbf62" />
        </g>) },
        { depth: 0.6, el: (<g>
          <rect x="16" y="110" width="90" height="140" fill="#9a6b44" stroke={OUT} strokeWidth="1.5" />
          {[0, 1, 2].map((r) => (
            <g key={r}>
              <rect x="20" y={150 + r * 34} width="82" height="4" fill="#7a5232" />
              {[0, 1, 2, 3, 4, 5].map((b) => (
                <rect key={b} x={24 + b * 13} y={124 + r * 34} width="10" height="26" fill={['#e2393b', '#4ea1ff', '#f4b740', '#3ddc84', '#b07bff', '#ff8c42'][(b + r) % 6]} />
              ))}
            </g>
          ))}
          <rect x="-10" y="250" width="420" height="60" fill={p.ground[0]} />
        </g>) },
        { depth: 0.35, el: (<g>
          <rect x="300" y="190" width="70" height="8" fill="#7a5232" />
          <rect x="312" y="198" width="6" height="56" fill="#7a5232" /><rect x="352" y="198" width="6" height="56" fill="#7a5232" />
          <rect x="330" y="160" width="10" height="30" fill="#c9bba2" />
          <path d="M314 162 L356 162 L346 132 L324 132 Z" fill="#f6efe0" stroke={OUT} strokeWidth="1.2" />
          <ellipse cx="200" cy="286" rx="150" ry="18" fill="#d76b5a" opacity="0.6" />
        </g>) },
      ],
      lights: [{ x: 335, y: 160, r: 6, depth: 0.35, color: '#ffffff' }],
      subject: (<g>
        <Kid x={196} y={166} s={1.15} hair="#6b3d1f" shirt="#3ddc84" style="short" />
        <Book x={196} y={268} s={1.2} />
      </g>),
      fg: [],
    }),
  },
}

Object.values(SETS).forEach((x) => localize(x, ['label']))
export const ART_LIST = Object.keys(SETS).map((id) => ({ id, get label() { return SETS[id].label } }))
