import Control from './Control.jsx'
import { APERTURES, SHUTTERS, ISOS, FOCALS, WBS } from '../camera.js'
import { tx } from '../i18n.js'

// Kamera ayarı kaydırıcıları. Zum ve beyaz dengesi sadece verildiyse görünür.
export default function Sliders({
  aperture, shutter, iso, setAperture, setShutter, setIso, fx,
  focal, setFocal, wb, setWb,
}) {
  return (
    <section className="controls">
      {setFocal && (
        <Control
          icon="🔭" title={tx('Zum', 'Zoom')} sub={tx('Odak uzaklığı (lens)', 'Focal length (lens)')}
          value={`${FOCALS[focal].mm} mm`} max={FOCALS.length - 1} index={focal} onChange={setFocal}
          leftLabel={tx('24 mm · geniş açı', '24 mm · wide angle')} rightLabel={tx('200 mm · yakınlaştır', '200 mm · zoom in')}
          hint={focal <= 1 ? tx('➜ Her şey kareye sığıyor 🏔️', '➜ Everything fits in the frame 🏔️') : focal >= 4 ? tx('➜ Uzaktakini büyütüyor — titremeye dikkat! 🔭', '➜ Brings faraway things close. Watch out for shake! 🔭') : tx('➜ Doğal görüş', '➜ Natural view')}
        />
      )}
      <Control
        icon="🔵" title={tx('Diyafram', 'Aperture')} sub={tx('Işık deliğinin büyüklüğü', 'Size of the light hole')}
        value={`f/${fx.a.f}`} max={APERTURES.length - 1} index={aperture} onChange={setAperture}
        leftLabel={tx('f/1.4 · büyük delik', 'f/1.4 · big hole')} rightLabel={tx('f/16 · küçük delik', 'f/16 · small hole')}
        hint={aperture <= 2 ? tx('➜ Arka plan eriyor 😍', '➜ The background melts 😍') : aperture >= 6 ? tx('➜ Her şey net 🔍', '➜ Everything is sharp 🔍') : tx('➜ Orta bulanıklık', '➜ Some blur')}
      />
      <Control
        icon="⏱️" title={tx('Enstantane', 'Shutter speed')} sub={tx('Perdenin açık kaldığı süre', 'How long the shutter stays open')}
        value={fx.s.label} max={SHUTTERS.length - 1} index={shutter} onChange={setShutter}
        leftLabel={tx('1/1000 · çok hızlı', '1/1000 · very fast')} rightLabel={tx('1 sn · çok yavaş', '1 s · very slow')}
        hint={shutter <= 2 ? tx('➜ Hareketi donduruyor ❄️', '➜ Freezes motion ❄️') : shutter >= 6 ? tx('➜ Hareket bulanıklaşıyor 💨', '➜ Motion turns blurry 💨') : tx('➜ Orta hız', '➜ Medium speed')}
      />
      <Control
        icon="✨" title="ISO" sub={tx('Işığa duyarlılık', 'Sensitivity to light')}
        value={`${fx.i.iso}`} max={ISOS.length - 1} index={iso} onChange={setIso}
        leftLabel={tx('100 · temiz', '100 · clean')} rightLabel={tx('3200 · grenli', '3200 · grainy')}
        hint={iso <= 1 ? tx('➜ Temiz görüntü ✨', '➜ Clean image ✨') : iso >= 4 ? tx('➜ Karanlıkta yardımcı ama grenli 🌑', '➜ Helps in the dark, but grainy 🌑') : tx('➜ Orta duyarlılık', '➜ Medium sensitivity')}
      />
      {setWb && (
        <Control
          icon="⚪" title={tx('Beyaz Dengesi', 'White Balance')} sub={tx('Makineye ışığın rengini söyle', 'Tell the camera the color of the light')}
          value={`${WBS[wb].emoji} ${WBS[wb].label}`} max={WBS.length - 1} index={wb} onChange={setWb}
          leftLabel={tx('💡 2800 K · ampul', '💡 2800 K · bulb')} rightLabel={tx('🌳 8000 K · gölge', '🌳 8000 K · shade')}
          hint={Math.abs(fx.cast) < 40 ? tx('➜ Renkler doğal ⚪', '➜ Natural colors ⚪') : fx.cast > 0 ? tx('➜ Fotoğraf turuncu kaçıyor 🟠', '➜ The photo looks orange 🟠') : tx('➜ Fotoğraf mavi kaçıyor 🔵', '➜ The photo looks blue 🔵')}
        />
      )}
    </section>
  )
}
