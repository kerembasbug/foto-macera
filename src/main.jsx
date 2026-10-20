import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { useLang } from './i18n.js'
import { LazyMotion, domAnimation } from 'motion/react'
import './styles.css'

// Dil değişince tüm uygulama yeni dille yeniden kurulur (ilerleme kayıtlı kalır).
function LangApp() {
  const lang = useLang()
  return <App key={lang} />
}

let Root = LangApp
if (import.meta.env.DEV && location.hash === '#mascots') Root = (await import('./dev/MascotSheet.jsx')).default
if (import.meta.env.DEV && location.hash === '#scenes') Root = (await import('./dev/SceneSheet.jsx')).default
if (import.meta.env.DEV && location.hash === '#fx') Root = (await import('./dev/FxSheet.jsx')).default

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Animasyon motorunun sadece kullandığımız parçası yüklenir (daha küçük paket). */}
    <LazyMotion features={domAnimation} strict>
      <Root />
    </LazyMotion>
  </React.StrictMode>,
)
