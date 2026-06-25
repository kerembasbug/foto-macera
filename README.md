# 📸 Foto Macera — Fotoğraf Makinesi Oyunu

Çocuklar ve fotoğrafçılığa yeni başlayanlar için eğlenceli, Türkçe bir **fotoğraf oyunu + SLR simülatörü**.
Her bölümde bir **fotoğraf görevi** verilir; diyafram, enstantane ve ISO'yu ayarlayıp **deklanşöre**
basarsın, çekilen kare puanlanır ve ⭐ kazanırsın. İlerleme telefonda kayıtlı kalır.
Web'de çalışır, telefona **uygulama gibi (PWA)** kurulabilir.

## Oyun

- **3 Dünya, 9 bölüm:** 🔵 Diyafram (bokeh/derinlik) · ⏱️ Hız (donma/iz) · ✨ Işık (gece/ISO).
- **Puanlama:** Doğru pozlama + göreve özel hedef (eriyen arka plan, donmuş hareket, temiz görüntü…) → 0–3 ⭐.
- **İlerleme:** Yıldızlar `localStorage`'a kaydedilir; bir sonraki bölüm açılır.
- **📅 Günlük Görev:** Her gün değişen (deterministik) görev + ardışık gün **serisi (🔥 streak)**.
- **🎞️ Albüm:** Her bölümün en iyi karesi polaroid kart olarak birikir (ayar + yıldız bilgisiyle).
- **Rozetler:** 7 başarım (İlk Kare, Mükemmeliyetçi, dünya ustalıkları, Yıldız Kralı…) — kazanınca sonuç ekranında belirir.
- **Ses & titreşim:** Deklanşör "çıt" sesi, yıldız zili ve rozet arpeji **Web Audio** ile sentezlenir (asset yok). 🔊 düğmesiyle kapatılabilir.
- **Serbest Mod:** Puansız, istediğin gibi denediğin klasik simülatör.

## Çalıştırma

```bash
npm install
npm run dev      # geliştirme — http://localhost:5173
npm run build    # üretim derlemesi (dist/)
npm run preview  # derlemeyi önizle
```

## Ne öğretiyor?

| Ayar | Etki |
|------|------|
| **Diyafram** (f/1.4 → f/16) | Küçük f = büyük delik = çok ışık + bulanık arka plan (alan derinliği) |
| **Enstantane** (1/1000 → 1 sn) | Yavaş perde = çok ışık + hareket bulanıklığı |
| **ISO** (100 → 3200) | Yüksek ISO = karanlıkta yardımcı ama grenli (kumlu) görüntü |
| **Pozlama göstergesi** | Üç ayarın birleşik etkisi: fotoğraf karanlık mı, parlak mı, tam kıvamında mı? |

Çocuk dostu dokunuşlar: büyük renkli kaydırıcılar, emoji ipuçları, uçan kelebek
(hareket bulanıklığını göstermek için) ve **hazır ayarlar** (Portre, Spor, Manzara, Gece).

## Mimari

- **Vite + React** — tek sayfa uygulama, `vite-plugin-pwa` ile PWA. Tüm grafikler **SVG** (çevrimdışı, sıfır maliyet, ölçeklenebilir).
- `src/camera.js` — pozlama matematiği (kademe/stop hesapları, sahneler, presetler).
- `src/game.js` — dünyalar, bölümler ve **puanlama** mantığı.
- `src/useProgress.js` — yıldız/kilit ilerlemesi (`localStorage`).
- `src/Scene.jsx` — SVG sahne; efektler canlı uygulanır (bulanıklık, parlaklık, gren, hareket) + sahne paletleri.
- `src/App.jsx` — ekran yönlendirici. `src/screens/` — Home (harita), Play (görev), Result (sonuç), FreePlay.
- `src/components/` — Scene/Sliders/Control/CameraStage/Mascot/ExposureMeter.

## Mobil uygulama olarak

1. **PWA (en kolay):** Siteyi yayınla, telefonda tarayıcıda aç → "Ana ekrana ekle".
   Tam ekran, çevrimdışı çalışır.
2. **App Store / Play (isteğe bağlı):** Aynı kod tabanı [Capacitor](https://capacitorjs.com/)
   ile native pakete sarılabilir:
   ```bash
   npm i @capacitor/core @capacitor/cli && npx cap init
   npx cap add ios && npx cap add android
   npm run build && npx cap sync
   ```
