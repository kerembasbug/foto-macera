import Control from './Control.jsx'
import { APERTURES, SHUTTERS, ISOS } from '../camera.js'

// Üç kamera ayarı kaydırıcısı (diyafram / enstantane / ISO) bir arada.
export default function Sliders({ aperture, shutter, iso, setAperture, setShutter, setIso, fx }) {
  return (
    <section className="controls">
      <Control
        icon="🔵" title="Diyafram" sub="Işık deliğinin büyüklüğü"
        value={`f/${fx.a.f}`} max={APERTURES.length - 1} index={aperture} onChange={setAperture}
        leftLabel="f/1.4 · büyük delik" rightLabel="f/16 · küçük delik"
        hint={aperture <= 2 ? '➜ Arka plan eriyor 😍' : aperture >= 6 ? '➜ Her şey net 🔍' : '➜ Orta bulanıklık'}
      />
      <Control
        icon="⏱️" title="Enstantane" sub="Perdenin açık kaldığı süre"
        value={fx.s.label} max={SHUTTERS.length - 1} index={shutter} onChange={setShutter}
        leftLabel="1/1000 · çok hızlı" rightLabel="1 sn · çok yavaş"
        hint={shutter <= 2 ? '➜ Hareketi donduruyor ❄️' : shutter >= 6 ? '➜ Hareket bulanıklaşıyor 💨' : '➜ Orta hız'}
      />
      <Control
        icon="✨" title="ISO" sub="Işığa duyarlılık"
        value={`${fx.i.iso}`} max={ISOS.length - 1} index={iso} onChange={setIso}
        leftLabel="100 · temiz" rightLabel="3200 · grenli"
        hint={iso <= 1 ? '➜ Temiz görüntü ✨' : iso >= 4 ? '➜ Karanlıkta yardımcı ama grenli 🌑' : '➜ Orta duyarlılık'}
      />
    </section>
  )
}
