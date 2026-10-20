import { useCallback, useEffect, useState } from 'react'
import { LEVELS, WORLDS, levelsByWorld, earnedBadgeIds, getBadge } from './game.js'

const KEY = 'foto-macera-v1'
export const FREE_MAX = 12

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { stars: {}, shots: 0 }
}

const pad = (n) => String(n).padStart(2, '0')
const dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const todayStr = () => dstr(new Date())
const yesterdayStr = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dstr(d) }

// İlerlemeyi yönetir: yıldızlar, kilit durumu, toplam.
export function useProgress() {
  const [data, setData] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
  }, [data])

  // Bir çekimi kaydet: yıldızları güncelle + albüme en iyi kareyi koy.
  // shot = { a, s, i, stars, total } (a/s/i = ayar indeksleri)
  const recordShot = useCallback((levelId, shot, { master = false } = {}) => {
    setData((d) => {
      const crowns = master && shot.stars === 3 ? { ...(d.crowns ?? {}), [levelId]: true } : d.crowns
      const album = { ...(d.album ?? {}) }
      const ex = album[levelId]
      if (!ex || shot.stars > ex.stars || (shot.stars === ex.stars && shot.total > ex.total)) {
        album[levelId] = { a: shot.a, s: shot.s, i: shot.i, f: shot.f ?? null, w: shot.w ?? null, stars: shot.stars, total: shot.total }
      }
      return {
        ...d,
        shots: (d.shots ?? 0) + 1,
        stars: { ...d.stars, [levelId]: Math.max(d.stars[levelId] ?? 0, shot.stars) },
        album,
        crowns,
      }
    })
  }, [])

  // Günlük görev tamamlandı: seriyi (streak) günceller.
  const recordDaily = useCallback((stars) => {
    setData((d) => {
      const today = todayStr()
      const dd = d.daily ?? { date: null, stars: 0, streak: 0, best: 0 }
      if (dd.date === today) {
        return { ...d, daily: { ...dd, stars: Math.max(dd.stars, stars) } }
      }
      const streak = (dd.date === yesterdayStr() ? dd.streak : 0) + 1
      return { ...d, daily: { date: today, stars, streak, best: Math.max(dd.best ?? 0, streak) } }
    })
  }, [])

  // Serbest mod kareleri: en yeni başta, en çok FREE_MAX kare.
  const saveFreeShot = useCallback((shot) => {
    setData((d) => ({
      ...d,
      shots: (d.shots ?? 0) + 1,
      freeShots: [{ ...shot, id: Date.now() }, ...(d.freeShots ?? [])].slice(0, FREE_MAX),
    }))
  }, [])
  const deleteFreeShot = useCallback((id) => {
    setData((d) => ({ ...d, freeShots: (d.freeShots ?? []).filter((x) => x.id !== id) }))
  }, [])

  const markTutorialSeen = useCallback(() => setData((d) => ({ ...d, tutorialSeen: true })), [])

  const reset = useCallback(() => setData({ stars: {}, shots: 0 }), [])

  const starsOf = (id) => data.stars[id] ?? 0
  const totalStars = LEVELS.reduce((a, l) => a + (data.stars[l.id] ?? 0), 0)

  // Rozetler: kazanılmış olanlar + henüz görülmemiş (yeni) olanlar.
  const albumCount = Object.keys(data.album ?? {}).length
  const crownCount = Object.keys(data.crowns ?? {}).length
  const crownOf = (id) => !!data.crowns?.[id]
  const earned = earnedBadgeIds({ stars: data.stars, shots: data.shots ?? 0, totalStars, albumCount, crownCount })
  const seen = data.seenBadges ?? []
  const newBadges = earned.filter((id) => !seen.includes(id)).map(getBadge)
  const hasBadge = (id) => earned.includes(id)
  const ackBadges = useCallback(() => {
    setData((d) => {
      const e = earnedBadgeIds({
        stars: d.stars, shots: d.shots ?? 0,
        totalStars: LEVELS.reduce((a, l) => a + (d.stars[l.id] ?? 0), 0),
        albumCount: Object.keys(d.album ?? {}).length,
        crownCount: Object.keys(d.crowns ?? {}).length,
      })
      return { ...d, seenBadges: e }
    })
  }, [])

  // Bir bölüm açık mı? İlki hep açık; diğeri bir öncekinden ≥1 yıldız alınınca açılır.
  const isUnlocked = (id) => {
    const i = LEVELS.findIndex((l) => l.id === id)
    if (i <= 0) return true
    const prev = LEVELS[i - 1]
    return (data.stars[prev.id] ?? 0) >= 1
  }

  // Hangi dünya henüz yeni tamamlandı (tüm bölümleri ≥1 yıldız, henüz görülmemiş)?
  const worldJustCompleted = WORLDS.find((w) => {
    const levels = levelsByWorld(w.id)
    const allDone = levels.every((l) => (data.stars[l.id] ?? 0) >= 1)
    const alreadySeen = (data.seenWorlds ?? []).includes(w.id)
    return allDone && !alreadySeen
  })?.id ?? null

  const ackWorld = useCallback((worldId) => {
    setData((d) => ({ ...d, seenWorlds: [...(d.seenWorlds ?? []), worldId] }))
  }, [])

  const daily = data.daily ?? { date: null, stars: 0, streak: 0, best: 0 }
  const dailyDoneToday = daily.date === todayStr()

  return {
    starsOf, totalStars, isUnlocked, recordShot, reset, shots: data.shots ?? 0,
    album: data.album ?? {}, albumCount, crownOf, crownCount,
    freeShots: data.freeShots ?? [], saveFreeShot, deleteFreeShot,
    newBadges, hasBadge, ackBadges,
    recordDaily, dailyDoneToday,
    dailyStreak: dailyDoneToday ? daily.streak : (daily.date === yesterdayStr() ? daily.streak : 0),
    dailyStarsToday: dailyDoneToday ? daily.stars : 0,
    dailyBest: daily.best ?? 0,
    tutorialSeen: data.tutorialSeen ?? false,
    markTutorialSeen,
    worldJustCompleted,
    ackWorld,
  }
}
