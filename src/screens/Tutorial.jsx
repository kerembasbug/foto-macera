import { useState } from 'react'
import Mascot from '../components/Mascot.jsx'

const SLIDES = [
  {
    emoji: '📸',
    title: 'Foto Macera\'ya\nHoş Geldin!',
    body: 'Fotoğrafçılığı oynayarak öğren. Her bölümde bir görev var — doğru ayarı bul, deklanşöre bas, yıldız kazan!',
    visual: 'mascot',
  },
  {
    emoji: '🎯',
    title: 'Görevi Oku',
    body: 'Her bölümde ne yapman gerektiği yazar. Yeşil hedef rozetlerine dikkat et — hepsini karşılarsan tam puan!',
    visual: 'goals',
  },
  {
    emoji: '🎛️',
    title: '3 Kontrol, Sonsuz Olasılık',
    body: '📷 Diyafram (f/) → arka planı erit ya da netleştir\n⏱ Perde hızı → hareketi dondur ya da iz bırak\n☀️ ISO → karanlıkta ışık topla (ama grenli olur!)',
    visual: 'controls',
  },
  {
    emoji: '⭐',
    title: 'ÇEK ve Puan Kazan',
    body: 'Pozlama doğruysa + hedefleri tutturduysan 3 yıldız! Her gün yeni bir Günün Görevi seni bekliyor. Hadi başla!',
    visual: 'stars',
  },
]

export default function Tutorial({ onDone }) {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  const isLast = idx === SLIDES.length - 1

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-visual">
          {slide.visual === 'mascot' && <Mascot size={90} />}
          {slide.visual === 'goals' && (
            <div className="tut-goals">
              <span className="tut-chip">🎯 Doğru pozlama</span>
              <span className="tut-chip">😍 Eriyen arka plan</span>
              <span className="tut-chip">❄️ Hareketi dondur</span>
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
          {SLIDES.map((_, i) => (
            <span key={i} className={`tut-dot ${i === idx ? 'on' : ''}`} />
          ))}
        </div>

        <div className="tutorial-actions">
          {idx > 0 && (
            <button className="ghost-btn" onClick={() => setIdx(idx - 1)}>← Geri</button>
          )}
          <button className="tutorial-next" onClick={isLast ? onDone : () => setIdx(idx + 1)}>
            {isLast ? 'Oynamaya Başla 🚀' : 'İleri →'}
          </button>
        </div>

        <button className="tut-skip" onClick={onDone}>Atla</button>
      </div>
    </div>
  )
}
