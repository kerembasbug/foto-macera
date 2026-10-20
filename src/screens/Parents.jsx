import { useMemo, useState } from 'react'
import { WORLDS, LEVELS, BADGES, levelsByWorld } from '../game.js'
import { tx, getLang } from '../i18n.js'

// Ebeveyn Köşesi: çocuğun ne öğrendiği, ilerlemesi ve gizlilik bilgisi.
// Girişte "ebeveyn kapısı" var: yazıyla verilen sayıyı rakamla yazmak gerekir.

const LEARN = () => ({
  w1: {
    what: tx('Diyafram: objektifteki ışık deliğinin büyüklüğü.', 'Aperture: the size of the light opening in the lens.'),
    why: tx('Büyük delik arka planı bulanıklaştırır (portre), küçük delik her şeyi net yapar (manzara). Telefonlardaki "Portre modu" bunu taklit eder.', 'A big opening blurs the background (portraits), a small one keeps everything sharp (landscapes). Phone "Portrait mode" imitates this.'),
  },
  w2: {
    what: tx('Enstantane: perdenin ne kadar süre açık kaldığı.', 'Shutter speed: how long the shutter stays open.'),
    why: tx('Hızlı perde koşan bir çocuğu dondurur, yavaş perde hareketi iz olarak çizer. Neden-sonuç ilişkisi kurmayı öğretir.', 'A fast shutter freezes a running child, a slow one draws motion as a trail. It teaches cause and effect.'),
  },
  w3: {
    what: tx('ISO: makinenin ışığa duyarlılığı.', 'ISO: how sensitive the camera is to light.'),
    why: tx('Karanlıkta yardımcı olur ama görüntüyü grenli yapar. Her kararın bir bedeli olduğunu (ödünleşim) sezdirir.', 'It helps in the dark but makes the image grainy. It shows that every choice has a cost (a trade-off).'),
  },
  w4: {
    what: tx('Odak uzaklığı (zum): uzaktakini yaklaştırmak ya da geniş açıyla her şeyi sığdırmak.', 'Focal length (zoom): bringing faraway things close, or fitting everything in with a wide angle.'),
    why: tx('Uzun lensin titremeye karşı daha hızlı perde istediğini keşfeder: iki ayarı birlikte düşünmeyi öğrenir.', 'Kids discover that a long lens needs a faster shutter to avoid shake, so they learn to think about two settings at once.'),
  },
  w5: {
    what: tx('Beyaz dengesi: ışığın rengi (ampul turuncu, gölge mavimsi).', 'White balance: the color of light (bulbs are orange, shade is bluish).'),
    why: tx('Işığın her yerde aynı renkte olmadığını fark eder; renkleri ve gözlemi bilinçli kullanmayı öğrenir.', 'Kids notice that light is not the same color everywhere and learn to use color and observation on purpose.'),
  },
})

const NUM_WORDS = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan']
const EN_ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const EN_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
function toWords(n) {
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), o = n % 10
  if (getLang() === 'en') {
    const r = n % 100
    const rest = r < 20 ? EN_ONES[r] : [EN_TENS[t], EN_ONES[o]].filter(Boolean).join('-')
    return [h ? `${EN_ONES[h]} hundred` : '', rest].filter(Boolean).join(' ')
  }
  return [h === 1 ? 'yüz' : h ? `${NUM_WORDS[h]} yüz` : '', TENS[t], NUM_WORDS[o]].filter(Boolean).join(' ')
}

function Gate({ onPass, onBack }) {
  const [n] = useState(() => 120 + Math.floor(Math.random() * 870))
  const [val, setVal] = useState('')
  const [wrong, setWrong] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    if (Number(val) === n) onPass()
    else { setWrong(true); setVal('') }
  }
  return (
    <div className="play">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onBack}>← {tx('Harita', 'Map')}</button>
        <span className="play-title">👪 {tx('Ebeveyn Köşesi', 'Parents’ Corner')}</span>
        <span style={{ width: 64 }} />
      </div>
      <form className="gate block" onSubmit={submit}>
        <p className="gate-title">{tx('Bu bölüm yetişkinler içindir.', 'This section is for grown-ups.')}</p>
        <p>{tx('Devam etmek için bu sayıyı rakamla yazın:', 'To continue, type this number in digits:')}</p>
        <p className="gate-words">{toWords(n)}</p>
        <input
          className="gate-input" inputMode="numeric" pattern="[0-9]*" maxLength={3} autoComplete="off"
          value={val} onChange={(e) => { setVal(e.target.value.replace(/\D/g, '')); setWrong(false) }}
          aria-label={tx('Sayıyı rakamla yazın', 'Type the number in digits')}
        />
        {wrong && <p className="gate-wrong">{tx('Olmadı, tekrar deneyin.', 'Not quite, please try again.')}</p>}
        <button className="gate-btn" type="submit" disabled={val.length < 3}>{tx('Devam', 'Continue')}</button>
      </form>
    </div>
  )
}

export default function Parents({ progress, onHome }) {
  const [open, setOpen] = useState(false)
  const stats = useMemo(() => {
    const done = LEVELS.filter((l) => progress.starsOf(l.id) >= 1).length
    const badges = BADGES.filter((b) => progress.hasBadge(b.id)).length
    return { done, badges }
  }, [progress])

  if (!open) return <Gate onPass={() => setOpen(true)} onBack={onHome} />

  // Her zaman yayındaki adres: telefon uygulamasında da sistem tarayıcısında açılır.
  const privacyUrl = `https://kerembasbug.github.io/foto-macera/privacy.html${getLang() === 'en' ? '#en' : ''}`
  const reset = () => {
    if (window.confirm(tx('Tüm yıldızlar, rozetler ve albüm silinsin mi? Bu geri alınamaz.', 'Delete all stars, badges and album photos? This cannot be undone.'))) {
      progress.reset(); onHome()
    }
  }

  return (
    <div className="play parents">
      <div className="play-bar">
        <button className="ghost-btn" onClick={onHome}>← {tx('Harita', 'Map')}</button>
        <span className="play-title">👪 {tx('Ebeveyn Köşesi', 'Parents’ Corner')}</span>
        <span style={{ width: 64 }} />
      </div>

      <section className="block">
        <h2>{tx('Çocuğunuzun ilerlemesi', 'Your child’s progress')}</h2>
        <div className="p-stats">
          <div><b>{progress.totalStars}</b><span>/ {LEVELS.length * 3} {tx('yıldız', 'stars')}</span></div>
          <div><b>{stats.done}</b><span>/ {LEVELS.length} {tx('görev', 'missions')}</span></div>
          <div><b>{progress.shots}</b><span>{tx('fotoğraf', 'photos')}</span></div>
          <div><b>{stats.badges}</b><span>/ {BADGES.length} {tx('rozet', 'badges')}</span></div>
          <div><b>{progress.dailyBest}</b><span>{tx('gün en uzun seri', 'day best streak')}</span></div>
          <div><b>{progress.freeShots.length}</b><span>{tx('serbest kare', 'free shots')}</span></div>
        </div>
      </section>

      <section className="block">
        <h2>{tx('Ne öğreniyor?', 'What are they learning?')}</h2>
        <p className="p-intro">
          {tx('Foto Macera, gerçek bir fotoğraf makinesinin (DSLR) üç temel ayarını ve iki ileri konuyu oyunla öğretir. Her görevde çocuk bir hedefe ulaşmak için ayar dener, sonucu anında görür ve nedenini öğrenir.',
            'Photo Quest teaches the three basic settings of a real camera (DSLR) and two advanced topics through play. In every mission your child tries settings to reach a goal, sees the result instantly and learns why.')}
        </p>
        {WORLDS.map((w) => {
          const learn = LEARN()[w.id]
          const lv = levelsByWorld(w.id)
          const st = lv.reduce((a, l) => a + progress.starsOf(l.id), 0)
          const max = lv.length * 3
          return (
            <div className="p-world" key={w.id} style={{ '--wc': w.color }}>
              <div className="p-world-head">
                <span>{w.emoji} {w.name}</span>
                <span className="p-world-stars">{st}/{max} ★</span>
              </div>
              <div className="p-bar"><span style={{ width: `${(st / max) * 100}%` }} /></div>
              <p><b>{learn.what}</b> {learn.why}</p>
            </div>
          )
        })}
      </section>

      <section className="block">
        <h2>{tx('Birlikte deneyin', 'Try it together')}</h2>
        <ul className="p-list">
          <li>{tx('Telefonunuzun kamerasıyla "Portre modu"nu açıp kapatın; arka plan farkını birlikte konuşun.', 'Turn "Portrait mode" on and off on your phone camera and talk about the background difference together.')}</li>
          <li>{tx('Akşam ampul ışığında ve gündüz pencere önünde aynı oyuncağın fotoğrafını çekin; renkleri karşılaştırın.', 'Photograph the same toy under a light bulb in the evening and by a window during the day, then compare the colors.')}</li>
          <li>{tx('Albümdeki fotoğraflara bakıp "Bunu nasıl çektin?" diye sorun. Anlatmak öğrenmeyi pekiştirir.', 'Look at the album together and ask "How did you take this one?" Explaining helps learning stick.')}</li>
        </ul>
      </section>

      <section className="block">
        <h2>{tx('Gizlilik ve güvenlik', 'Privacy and safety')}</h2>
        <ul className="p-list">
          <li>{tx('Reklam yok, uygulama içi satın alma yok.', 'No ads and no in-app purchases.')}</li>
          <li>{tx('Hesap, isim, e-posta ya da fotoğraf istenmez. Kamera ve mikrofon kullanılmaz.', 'No account, name, email or photos are requested. The camera and microphone are not used.')}</li>
          <li>{tx('İlerleme yalnızca bu cihazda saklanır; hiçbir sunucuya gönderilmez.', 'Progress is stored only on this device and is never sent to a server.')}</li>
        </ul>
        <div className="p-actions">
          <a className="p-link" href={privacyUrl} target="_blank" rel="noopener">{tx('Gizlilik politikası', 'Privacy policy')}</a>
          <a className="p-link" href="mailto:info@revoba.net">{tx('İletişim', 'Contact')}</a>
        </div>
      </section>

      <section className="block">
        <h2>{tx('İlerlemeyi sıfırla', 'Reset progress')}</h2>
        <p className="p-intro">{tx('Yeni bir çocuk oynayacaksa ya da baştan başlamak isterseniz.', 'If a new child will play, or you want to start over.')}</p>
        <button className="p-danger" onClick={reset}>{tx('Tüm ilerlemeyi sil', 'Delete all progress')}</button>
      </section>
    </div>
  )
}
