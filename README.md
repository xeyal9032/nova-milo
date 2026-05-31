<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1f3c,50:3b60c4,100:00ff9d&height=200&section=header&text=Nova%20%26%20Milo&fontSize=42&fontColor=fff&animation=twinkling" width="100%"/>

### 🤖 Sci-Fi AI Giriş Portalı & Akıllı Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=00FF9D&center=true&vCenter=true&width=600&lines=Giriş+%7C+Kayıt+%7C+Milo+AI+%7C+Canlı+HUD;5+Dil+%7C+Sesli+Asistan+%7C+Kripto+Radar;Nova+Terminal+%7C+NASA+APOD+%7C+Masaüstü+App" alt="Typing SVG" />

<br/>

**Profesyonel giriş ekranı · Supabase kimlik doğrulama · Gemini destekli Milo asistan · Sci-fi kontrol paneli**

[🚀 Kurulum](#-kurulum) · [✨ Özellikler](#-özellikler) · [📸 Önizleme](#-uygulama-önizlemesi) · [🛠️ Teknoloji](#️-teknoloji-yığını) · [👤 Geliştirici](https://github.com/xeyal9032)

</div>

---

## 🎬 Canlı Demo Hissi

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3RqZ3N0aGJ0Z3B0Z3B0Z3B0/3o7abKhMDpvcCzxEk/giphy.gif" width="280" alt="AI animasyon"/>
  <img src="docs/assets/robot.png" width="220" alt="Milo Robot"/>
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExLWRhc2hib2FyZC1hbmlt/26BRuo6sBn2qhq7YQ/giphy.gif" width="280" alt="Dashboard animasyon"/>
</p>

---

## ✨ Özellikler

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Giriş & Kayıt
<img src="https://img.shields.io/badge/UI-Kaydırmalı_Panel-3b60c4?style=flat-square"/>

- Animasyonlu çift panelli giriş ekranı
- Supabase `signUp` / `signInWithPassword`
- **5 dil:** TR · EN · RU · DE · AZ
- Sosyal butonlar (UI hazır)

</td>
<td width="50%" valign="top">

### 🧠 Milo AI Asistan
<img src="https://img.shields.io/badge/Model-gemini--2.5--flash-00ff9d?style=flat-square"/>

- Google Gemini ile akıllı sohbet
- Dil bazlı yanıt (seçilen UI dili)
- Markdown mesaj desteği
- OpenAI TTS ile sesli yanıt (`nova` sesi)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛸 Nova Dashboard
<img src="https://img.shields.io/badge/Tema-Sci--Fi_HUD-00ffff?style=flat-square"/>

- Canlı hava & konum (Open-Meteo)
- Binance WebSocket kripto ticker
- NASA Günün Astronomi Fotoğrafı
- Pil, ağ, CPU/RAM, koordinat HUD

</td>
<td width="50%" valign="top">

### ⌨️ Nova Terminal
<img src="https://img.shields.io/badge/Komutlar-4+-00ff9d?style=flat-square"/>

```
/weather [şehir]
/crypto
/help
/clear
```

- Matrix tarzı sistem logları
- Acil durum & odak modu
- Web Speech ile sesli giriş

</td>
</tr>
</table>

---

## 📸 Uygulama Önizlemesi

<div align="center">

### Giriş Portalı
<img src="docs/assets/login-robot.png" alt="Giriş ekranı maskotu" width="120" align="left" style="margin-right:20px"/>

| | |
|:---:|:---:|
| <img src="https://img.shields.io/badge/Kayıt-Hesap_Oluştur-3b60c4?style=for-the-badge" /> | <img src="https://img.shields.io/badge/Giriş-Güvenli_OTP-2a4b9e?style=for-the-badge" /> |
| Kaydırmalı overlay panel | Supabase Auth entegrasyonu |

<br clear="left"/>

---

### Sci-Fi Dashboard — Nova & Milo

<table>
<tr>
<td align="center" width="50%">
<strong>🤖 Milo — Sohbet Merkezi</strong><br/><br/>
<img src="docs/assets/robot.png" width="320" alt="Milo Robot"/>
<br/><br/>
<em>Yüzen 3D maskot · Sesli asistan · Mikrofon desteği</em>
</td>
<td align="center" width="50%">
<strong>🛰️ Nova — Sistem HUD</strong><br/><br/>
<img src="docs/assets/nova.png" width="200" alt="Nova HUD"/>
<br/><br/>
<em>Hava · Kripto · NASA · Terminal · Ses radarı</em>
</td>
</tr>
</table>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=0,3b60c4,00ff9d&height=3&section=footer" width="100%"/>

</div>

---

## 🏗️ Proje Yapısı

```
giris/
├── 📄 index.html, dashboard.*     # Statik prototip (vanilla)
├── 🖼️ robot.png
└── nextjs-app/                    # ⭐ Ana uygulama
    ├── src/app/
    │   ├── page.js                # Giriş / kayıt
    │   ├── dashboard/page.js      # Nova + Milo dashboard
    │   └── api/chat · api/tts     # Gemini & OpenAI
    ├── src/components/
    ├── src/contexts/
    ├── electron/                  # Masaüstü paket
    └── public/
```

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoliler |
|--------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, CSS Modules |
| **Auth** | Supabase Auth |
| **AI** | Google Gemini 2.5 Flash, OpenAI TTS |
| **Canlı veri** | Open-Meteo, Nominatim, Binance WS, NASA APOD |
| **Masaüstü** | Electron 42 + electron-builder (Windows NSIS) |

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase projesi
- `GEMINI_API_KEY` (sohbet için)

### 1. Depoyu klonla

```bash
git clone https://github.com/xeyal9032/nova-milo.git
cd nova-milo/nextjs-app
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Ortam değişkenleri

`nextjs-app/.env.local` dosyası oluştur:

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Geliştirme sunucusu

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

### 5. Masaüstü uygulama (isteğe bağlı)

```bash
npm run electron-dev      # Geliştirme
npm run build:electron    # Windows kurulum paketi
```

---

## 📜 Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Next.js geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucu |
| `npm run electron-dev` | Electron ile masaüstü |
| `npm run build:electron` | Standalone + NSIS installer |

---

## 🗺️ Yol Haritası

- [ ] Route koruması (`middleware` + oturum kontrolü)
- [ ] `signOut` entegrasyonu
- [ ] Şifre sıfırlama (Supabase)
- [ ] API anahtarlarının tamamen env'e taşınması
- [ ] Gerçek ekran görüntüsü GIF'leri

---

## 👤 Geliştirici

<table>
<tr>
<td align="center">
<a href="https://github.com/xeyal9032">
<img src="https://github.com/xeyal9032.png" width="100" style="border-radius:50%"/>
</a>
<br/><br/>
<strong>Khayal (xeyal9032)</strong><br/>
Web Designer & Developer · OstWind Group
<br/><br/>
<a href="https://github.com/xeyal9032">
<img src="https://img.shields.io/badge/GitHub-xeyal9032-181717?style=for-the-badge&logo=github"/>
</a>
<a href="https://frontend.ostwind.az/">
<img src="https://img.shields.io/badge/Portfolio-OstWind-3b60c4?style=for-the-badge"/>
</a>
<a href="https://www.linkedin.com/in/khayaljamilli9032">
<img src="https://img.shields.io/badge/LinkedIn-Khayal-0A66C2?style=for-the-badge&logo=linkedin"/>
</a>
</td>
</tr>
</table>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1f3c,50:3b60c4,100:00ff9d&height=120&section=footer&text=Made%20with%20💙%20by%20xeyal9032&fontSize=20&fontColor=fff" width="100%"/>

⭐ Bu projeyi beğendiysen yıldız vermeyi unutma!

</div>
