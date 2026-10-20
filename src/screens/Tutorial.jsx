import { useState } from 'react'
import Mascot from '../components/Mascot.jsx'
import { tx, getLang, setLang } from '../i18n.js'

const SLIDES = () => [
  {
    emoji: '📸',
    title: tx('Foto Macera\'ya\nHoş Geldin!', 'Welcome to\nPhoto Quest!'),
    body: tx('Fotoğrafçılığı oynayarak öğren. Her bölümde bir görev var — doğru ayarı bul, deklanşöre bas, yıldız kazan!', 'Learn photography by playing. Every level has a mission: find the right settings, press the shutter, earn stars!'),
    visual: 'mascot',
  },
  {
    emoji: '🎯',
    title: tx('Görevi Oku', 'Read the Mission'),
    body: tx('Her bölümde ne yapman gerektiği yazar. Yeşil hedef rozetlerine dikkat et — hepsini karşılarsan tam puan!', 'Each level tells you what to do. Watch the goal chips: hit them all for a perfect score!'),
    visual: 'goals',
  },
  {
    emoji: '🎛️',
    title: tx('3 Kontrol, Sonsuz Olasılık', '3 Controls, Endless Possibilities'),
    body: tx('📷 Diyafram (f/) → arka planı erit ya da netleştir\n⏱ Perde hızı → hareketi dondur ya da iz bırak\n☀️ ISO → karanlıkta ışık topla (ama grenli olur!)', '📷 Aperture (f/) → melt the background or make it sharp\n⏱ Shutter speed → freeze motion or leave a trail\n☀️ ISO → gather light in the dark (but it gets grainy!)'),
    visual: 'controls',
  },
  {
    emoji: '⭐',
    title: tx('ÇEK ve Puan Kazan', 'SNAP and Score'),
    body: tx('Pozlama doğruysa + hedefleri tutturduysan 3 yıldız! Her gün yeni bir Günün Görevi seni bekliyor. Hadi başla!', 'Get the exposure right and hit the goals for 3 stars! A new Daily Mission waits for you every day. Let’s go!'),
    visual: 'stars',
  },
]

export default function Tutorial({ onDone }) {
  const [idx, setIdx] = useState(0)
  const slides = SLIDES()
  const slide = slides[idx]
  const isLast = idx === slides.length - 1

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-visual">
          {slide.visual === 'mascot' && <Mascot size={100} mood="happy" />}
          {slide.visual === 'goals' && (
            <div className="tut-goals">
              <span className="tut-chip">🎯 {tx('Doğru pozlama', 'Right exposure')}</span>
              <span className="tut-chip">😍 {tx('Eriyen arka plan', 'Melted background')}</span>
              <span className="tut-chip">❄️ {tx('Hareketi dondur', 'Freeze the motion')}</span>
            </div>
          )}
          {slide.visual === 'controls' && (
            <div className="tut-controls">
              <div className="tut-ctrl"><span>📷</span><strong>f/2</strong></div>
              <div className="tut-ctrl"><span>⏱</span><strong>1/500</strong></div>
              <div className="tut-ctrl"><span>☀️</span><strong>ISO 100</strong></div>
            </div>
          )}
          {slide.visual === 'stars' && (
            <div className="tut-stars">
              <span className="tut-star">★</span>
              <span className="tut-star">★</span>
              <span className="tut-star">★</span>
            </div>
          )}
        </div>

        <div className="tutorial-emoji">{slide.emoji}</div>
        <h2 className="tutorial-title">{slide.title}</h2>
        <p className="tutorial-body">{slide.body}</p>

        <div className="tutorial-dots">
          {slides.map((_, i) => (
            <span key={i} className={`tut-dot ${i === idx ? 'on' : ''}`} />
          ))}
        </div>

        <div className="tutorial-actions">
          {idx > 0 && (
            <button className="ghost-btn" onClick={() => setIdx(idx - 1)}>← {tx('Geri', 'Back')}</button>
          )}
          <button className="tutorial-next" onClick={isLast ? onDone : () => setIdx(idx + 1)}>
            {isLast ? tx('Oynamaya Başla 🚀', 'Start Playing 🚀') : tx('İleri →', 'Next →')}
          </button>
        </div>

        <button className="tut-lang" onClick={() => setLang(getLang() === 'tr' ? 'en' : 'tr')}>
          {getLang() === 'tr' ? '🌐 English' : '🌐 Türkçe'}
        </button>
        <button className="tut-skip" onClick={onDone}>{tx('Atla', 'Skip')}</button>
      </div>
    </div>
  )
}
