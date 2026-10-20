import { useSyncExternalStore } from 'react'

// Basit iki dilli sistem (i18n): Türkçe + İngilizce.
// tx('Türkçe', 'English') → o anki dile göre metni verir.
// Veri nesnelerinde ['Türkçe', 'English'] dizisi → localize() ile otomatik okunur.

const KEY = 'foto-macera-lang'
const listeners = new Set()

function detect() {
  try {
    const s = localStorage.getItem(KEY)
    if (s === 'tr' || s === 'en') return s
  } catch {}
  const nav = (typeof navigator !== 'undefined' && (navigator.languages?.[0] || navigator.language)) || 'tr'
  return nav.toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

let lang = detect()
const TITLES = { tr: 'Foto Macera 📷 Fotoğraf Oyunu', en: 'Photo Quest 📷 Camera Game for Kids' }
if (typeof document !== 'undefined') {
  document.documentElement.lang = lang
  document.title = TITLES[lang]
}

export const getLang = () => lang

export function setLang(l) {
  if (l === lang) return
  lang = l
  try { localStorage.setItem(KEY, l) } catch {}
  document.documentElement.lang = l
  document.title = TITLES[l]
  listeners.forEach((f) => f())
}

export function useLang() {
  return useSyncExternalStore((f) => { listeners.add(f); return () => listeners.delete(f) }, getLang, getLang)
}

export const tx = (tr, en) => (lang === 'en' ? en : tr)

// ['tr', 'en'] dizisi olan alanları dile göre okunan alanlara çevirir.
export function localize(obj, fields) {
  for (const f of fields) {
    const v = obj[f]
    if (Array.isArray(v)) {
      Object.defineProperty(obj, f, { get: () => (lang === 'en' ? v[1] : v[0]), enumerable: true, configurable: true })
    }
  }
  return obj
}
export const localizeAll = (list, fields) => { list.forEach((o) => localize(o, fields)); return list }
