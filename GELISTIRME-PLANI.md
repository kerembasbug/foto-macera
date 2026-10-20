# Foto Macera — Geliştirme Yol Haritası

*Hazırlanma tarihi: 20 Ekim 2026 · Mevcut sürüm: 1.0.0 (Play Store incelemesinde)*

---

## 1. Durum Tespiti — Elimizde Ne Var?

Projeyi baştan sona okudum. Dürüst bir özet:

### 💪 Güçlü yanlar (buna dokunma)

| Parça | Neden iyi |
|---|---|
| **Kamera beyni** (`camera.js`) | Gerçek fotoğrafçılık fiziğiyle çalışıyor: her ayar ışığı "kademe" cinsinden değiştiriyor. Çocuk öğrenirken yanlış bir şey öğrenmiyor. Bu, oyunun en değerli parçası. |
| **Puanlama** (`game.js`) | Her görev için ayrı ölçüm (pozlama, bulanıklık, hareket, gren). Yıldız sistemi adil. |
| **İlerleme & rozetler** | 8 rozet, günlük görev, seri (streak), albüm — bağlılık mekanikleri hazır. |
| **Ses** | Dosya gerektirmeden "çıt" sesi ve yıldız zili üretiyor. Hafif ve akıllı. |

### 🩹 Zayıf yanlar (planın odağı)

| Parça | Sorun |
|---|---|
| **Tek sahne** (`Scene.jsx`) | 9 bölümün **hepsi aynı resmi** kullanıyor: çiçek + kelebek + tepe. Sadece gökyüzü rengi değişiyor. Çocuk 3. bölümde "yine mi bu?" der. **En büyük eksik bu.** |
| **Her şey emoji** | Dünya ikonları, bölüm ikonları, rozetler, hedef çipleri — hepsi emoji. Telefona göre farklı görünür, "oyun" değil "sohbet" hissi verir. |
| **Hareketsiz maskot** | Çıt (maskot) tek bir sabit resim. Kazanınca sevinmiyor, kaybedince üzülmüyor. Çocuk oyunlarında maskot = duygu bağı. |
| **Animasyon yok** | Ekran geçişleri anlık, yıldızlar pat diye çıkıyor, fotoğraf "gelişmiyor". Her şey çalışıyor ama hissiz. |
| **Sadece Türkçe** | 176 ülkede yayındayız ama mağaza sayfası ve oyun sadece Türkçe. Potansiyel kitlenin %95'i oyunu anlamıyor. |
| **İnternet şart** | TWA (web sayfasını saran kabuk) ilk açılışta siteye bağlanıyor. Reddin bir sebebi buydu. |

---

## 2. Yol Haritası — 4 Faz

Mantık: **önce hissiyat, sonra görsel, sonra içerik, en son altyapı.** Çünkü çocuk oyunu önce "canlı" hissettirmeli; sonra "güzel"; sonra "uzun".

Zorluk ölçeği: 🟢 küçük (1–2 gün) · 🟡 orta (3–5 gün) · 🔴 büyük (1–2 hafta)

---

### FAZ 1 — "Can Gelsin" · Hissiyat
*Hedef: aynı oyun, ama dokunduğunda tepki veren, yaşayan bir oyun.*

| # | İş | Ne demek | Araç/Skill | Zorluk | Etki |
|---|---|---|---|---|---|
| 1.1 | **Maskot duyguları** | Çıt'ın 5 hali: normal, düşünüyor, sevindi, şaşırdı, üzüldü. Yıldıza göre tepki verir. | fal.ai ile 5 poz üret → Motion ile zıplama/sallanma | 🟡 | ⭐⭐⭐⭐⭐ |
| 1.2 | **"Fotoğraf gelişiyor" efekti** | ÇEK'e basınca fotoğraf eski usul banyodan çıkar gibi yavaşça belirir, sonra yıldızlar tek tek patlar. | GSAP timeline (zincirleme animasyon) | 🟢 | ⭐⭐⭐⭐⭐ |
| 1.3 | **Ekran geçişleri** | Harita→bölüm→sonuç arası kaydırma/büyüme. Pat diye değişmez. | Motion (framer) `AnimatePresence` | 🟢 | ⭐⭐⭐ |
| 1.4 | **Slider canlı tepkisi** | Diyaframı açınca vizördeki bulanıklık yumuşak geçişle değişir; sayılar "tık tık" döner. | Motion `useSpring` | 🟢 | ⭐⭐⭐⭐ |
| 1.5 | **Konfeti & parçacık** | 3 yıldızda konfeti, rozette ışıltı patlaması, mükemmel pozlamada "✨" yağmuru. | Basit canvas parçacık (ileride PixiJS) | 🟢 | ⭐⭐⭐⭐ |
| 1.6 | **Gerçek ses** | Beep yerine: yumuşak deklanşör, "tıng" yıldız sesi, kısa neşeli arka plan müziği (sessize alınabilir). | Ücretsiz ses paketleri (freesound/kenney) | 🟡 | ⭐⭐⭐⭐ |

**Faz 1 toplam: ~2 hafta.** Kod yapısı değişmez, sadece üzerine "kıyafet" giydiriyoruz.

---

### FAZ 2 — "Her Dünya Farklı Görünsün" · Görsel
*Hedef: 9 bölüm = 9 farklı manzara. Oyunun "grafik" sıçraması burada.*

| # | İş | Ne demek | Araç/Skill | Zorluk | Etki |
|---|---|---|---|---|---|
| 2.1 | **Katmanlı sahneler** | Her sahne 3 katman: arka (dağ/gökyüzü), orta (ağaç/bina), ön (konu). Diyafram açılınca **sadece arka ve orta bulanır**, konu net kalır. Gerçek fotoğraf gibi derinlik. | fal.ai ile 3 katman ayrı üret + CSS blur per katman | 🔴 | ⭐⭐⭐⭐⭐ |
| 2.2 | **9 benzersiz konu** | Portre→çocuk yüzü, Spor→top, Makro→böcek, Gece→şehir ışıkları, Kelebek→kelebek… Her bölümün kendi "modeli". | fal.ai (mevcut pipeline) | 🟡 | ⭐⭐⭐⭐⭐ |
| 2.3 | **Bokeh ışık toplari** | Gece/akşam sahnelerinde geniş diyaframda arka plan ışıkları **yumuşak daireler** olur. Fotoğrafçılığın en sevilen efekti ve **öğretici**: "diyafram açıldıkça daireler büyür". | PixiJS parçacık sistemi | 🟡 | ⭐⭐⭐⭐⭐ |
| 2.4 | **Emoji → çizim ikonlar** | Dünya, bölüm, rozet, hedef çipleri için tutarlı bir ikon seti. Her telefonda aynı görünür. | fal.ai tek stilde 30 ikon VEYA ücretsiz ikon seti | 🟡 | ⭐⭐⭐ |
| 2.5 | **Dünya haritası** | Ana ekrandaki düz liste yerine kıvrımlı bir yol üzerinde bölümler (Candy Crush tarzı). Kilitli bölümler sisli. | SVG yol + Motion | 🟡 | ⭐⭐⭐⭐ |
| 2.6 | **Gerçek hareket bulanıklığı** | Kelebek uçarken yavaş perdede **iz bırakır** (şu an sadece bulanıyor). Hız bölümlerini görsel olarak anlaşılır yapar. | PixiJS trail efekti | 🟡 | ⭐⭐⭐⭐ |

**Faz 2 toplam: ~3–4 hafta.** En maliyetli ama en çok fark yaratan faz. 2.1 + 2.2 birlikte yapılır.

> ⚠️ **Not:** Görsel ne kadar gerçekçi olursa olsun, **kamera fiziği değişmez**. `camera.js` sahneyi değil, sahne `camera.js`'i takip eder. Böylece ders bozulmaz.

---

### FAZ 3 — "Daha Çok Oynansın" · İçerik
*Hedef: 9 bölüm → 20+ bölüm, tek dil → çok dil.*

| # | İş | Ne demek | Araç/Skill | Zorluk | Etki |
|---|---|---|---|---|---|
| 3.1 | **İngilizce** | Tüm oyun metni + mağaza sayfası İngilizce. **176 ülkenin kapısını açar.** En yüksek getiri/maliyet oranı. | i18n dosyası + Play Console çeviri | 🟡 | ⭐⭐⭐⭐⭐ |
| 3.2 | **Dünya 4: Zum (Odak Uzaklığı)** | Yeni ayar: lens yakınlaştırma. Hem kadrajı hem bulanıklığı etkiler. Kamera modeline doğal eklenti. | `camera.js` genişlet + 3 bölüm | 🟡 | ⭐⭐⭐⭐ |
| 3.3 | **Dünya 5: Beyaz Dengesi** | "Fotoğraf neden sarımsı/mavimsi?" Renk sıcaklığı ayarı. Çocuk için görsel ve eğlenceli. | `camera.js` + 3 bölüm | 🟡 | ⭐⭐⭐ |
| 3.4 | **Serbest Mod zenginleşsin** | Sahne seç + tüm ayarlar + "kaydet"→ albüme. Çocuk kendi fotoğrafını oluşturur. | Mevcut FreePlay genişlet | 🟢 | ⭐⭐⭐ |
| 3.5 | **Ebeveyn köşesi** | "Çocuğunuz ne öğreniyor?" sayfası. Teacher Approved jürisi bunu çok sever. | Statik sayfa | 🟢 | ⭐⭐⭐ |
| 3.6 | **Zorluk seviyeleri** | Her bölüm için "Kolay / Usta" modu. Usta modda ipucu yok, tolerans dar. | `game.js` toleransı parametreleştir | 🟢 | ⭐⭐⭐ |

**Faz 3 toplam: ~3 hafta.** 3.1 (İngilizce) Faz 1 ile paralel bile yapılabilir.

---

### FAZ 4 — "Teknik Sağlamlık" · Altyapı
*Hedef: her yerde, her koşulda çalışsın.*

| # | İş | Ne demek | Zorluk | Etki |
|---|---|---|---|---|
| 4.1 | **Tam çevrimdışı** | İlk açılıştan sonra internet olmadan çalışsın. Service worker (arka planda çalışan "depo bekçisi") tüm sahneleri önceden indirir. Rejeksiyon sebebini kökten çözer, "çevrimdışı" iddiasını geri koyabiliriz. | 🟡 | ⭐⭐⭐⭐ |
| 4.2 | **Performans** | Düşük telefonlarda 60 fps. Görseller WebP, tembel yükleme. | 🟢 | ⭐⭐⭐ |
| 4.3 | **iOS / App Store** | Şu an PWA olarak iPhone'da çalışıyor ama App Store'da yok. Capacitor (web→native kabuk) ile iOS paketi. Ayrı yayın süreci. | 🔴 | ⭐⭐⭐⭐ |
| 4.4 | **Tanıtım videosu** | Play Store sayfası için 30 sn'lik oyun videosu. Yükleme oranını ciddi artırır. | Remotion (kodla video) | 🟡 | ⭐⭐⭐ |
| 4.5 | **Otomatik deploy** | `git push` → site + AAB otomatik güncellensin. Şu an elle. | 🟢 | ⭐⭐ |

---

## 3. Öncelik Sıralaması — İlk 5 Hamle

Bütün tabloyu okumak yerine buradan başla:

1. **🥇 İngilizce** (3.1) — en ucuz, en büyük pazar etkisi. İnceleme sonucunu beklerken yapılır.
2. **🥈 Maskot duyguları + fotoğraf gelişme efekti** (1.1 + 1.2) — oyunun "ruhu" buraya gelir.
3. **🥉 Katmanlı sahneler + 9 benzersiz konu** (2.1 + 2.2) — "tek sahne" sorununu bitirir.
4. **Bokeh ışık topları** (2.3) — en "vay be" dedirten ve en öğretici görsel.
5. **Tam çevrimdışı** (4.1) — Play Store'la bir daha "yanıltıcı iddia" tartışması yaşanmaz.

---

## 4. Teknik Kararlar (neden şunu seçtim)

| Karar | Seçim | Neden |
|---|---|---|
| Animasyon kütüphanesi | **Motion** (eski adı Framer Motion) | React ile doğal çalışır, öğrenmesi kolay, ekran geçişleri için en iyi. |
| Zincirleme animasyon | **GSAP** (sadece sonuç ekranı için) | "Fotoğraf gelişir → yıldızlar → maskot sevinir" sırasını saniye saniye kurmak için. |
| Parçacık/efekt | Önce **basit canvas**, ihtiyaç olursa **PixiJS** | Konfeti için PixiJS fazla; bokeh ve hareket izi için PixiJS doğru. |
| 3D (Three.js) | **Kullanmıyoruz** | Çocuk oyunu için fazla, telefonu yorar, ders anlatımına katkısı yok. |
| Görsel üretim | **fal.ai (mevcut)** | Pipeline hazır, tutarlı stil tutturabiliyoruz. Tek stil promptu sabitleyip tüm sahneleri aynı "elden" çıkarırız. |
| Maskot animasyonu | Önce **poz sprite + Motion**, sonra **Lottie** | Lottie (vektör animasyon) için animatör gerek. Şimdilik 5 poz resmi + yumuşak geçiş yeter. |
| Veri | **Yine sadece telefonda** (localStorage) | Families politikası. Sunucu/analitik ekleme = yeni inceleme riski. |

---

## 5. Yapmayacaklarımız (bilinçli)

- ❌ Reklam, uygulama içi satın alma — Families politikası + çocuk oyunu değeri.
- ❌ Sosyal paylaşım, fotoğrafı dışarı gönderme — çocuk verisi riski. Albüm telefonda kalır.
- ❌ Hesap/giriş sistemi — gereksiz, inceleme zorlaştırır.
- ❌ 3D grafik — maliyet/fayda yok.
- ❌ Fiziği "kolaylaştırmak" — yanlış öğretmektense zor öğretmek iyidir.

---

## 6. Sıradaki Adım

İnceleme sonucu gelene kadar **Faz 3.1 (İngilizce)** ile başlamayı öneririm — yayına hiç dokunmaz, kabul gelince anında ikinci dil eklenir. Onay verirsen başlıyorum.

---

## 6. Uygulama Durumu (20 Ekim 2026)

| Faz | Madde | Durum |
|---|---|---|
| 1 | Maskot duyguları, fotoğraf gelişme efekti, sesler + müzik, akıcı geçişler, konfeti | ✅ |
| 2 | Katmanlı sahneler, 12 benzersiz sahne, bokeh, hareket izi, dünya haritası | ✅ (yapay zekâ çizimleri yerine kodla çizim; fal.ai hesabı kilitli) |
| 3.1 | İngilizce (oyun + gizlilik sayfası + mağaza metni) | ✅ |
| 3.2–3.3 | Zum Dünyası ve Renk Dünyası (6 yeni görev) | ✅ |
| 3.4 | Serbest Mod: zum + beyaz dengesi + “Çek ve Kaydet” (12 kare) | ✅ |
| 3.5 | Ebeveyn Köşesi (ebeveyn kapısı, ilerleme, öğrenilenler, sıfırlama) | ✅ |
| 3.6 | Usta modu (ipucu ve ışık ölçer yok, sıkı eşik, taç, rozet) | ✅ |
| 4.1 | Tam çevrimdışı (web: tüm dosyalar önbellekte; telefon: Capacitor ile dosyalar uygulamanın içinde) | ✅ |
| 4.2 | Performans (WebP görseller, LazyMotion) | ✅ |
| 4.3 | Capacitor Android (versionCode 4, aynı imza) + iOS projesi | ✅ Android paketi hazır · iOS derlemesi için Xcode gerekli |
| 4.4 | 30 sn tanıtım videosu (TR + EN, Remotion) | ✅ `art/promo/` |
| 4.5 | `scripts/release.sh` (web + imzalı AAB tek komut) | ✅ |

**Yayına alınmadı.** Web yayını (main'e push) ve Play Console yüklemesi kullanıcı onayı bekliyor.
