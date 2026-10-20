import { useProgress } from './useProgress.js'
import { getLevel } from './game.js'
import { useEffect, useRef, useState } from 'react'
import { m as motion, AnimatePresence } from 'motion/react'
import Home from './screens/Home.jsx'
import Play from './screens/Play.jsx'
import FreePlay from './screens/FreePlay.jsx'
import Album from './screens/Album.jsx'
import Parents from './screens/Parents.jsx'
import Tutorial from './screens/Tutorial.jsx'
import WorldComplete from './components/WorldComplete.jsx'

export default function App() {
  const progress = useProgress()
  const [route, setRoute] = useState({ name: 'home' })

  const goHome = () => setRoute({ name: 'home' })
  const goPlay = (levelId, daily = false) => setRoute({ name: 'play', levelId, daily })
  const goFree = () => setRoute({ name: 'free' })
  const goAlbum = () => setRoute({ name: 'album' })
  const goParents = () => setRoute({ name: 'parents' })

  // Telefon uygulamasında (Capacitor) Android geri tuşu: önce haritaya dön, haritadaysa çık.
  const routeRef = useRef(route)
  routeRef.current = route
  useEffect(() => {
    if (!window.Capacitor?.isNativePlatform?.()) return
    let handle
    import('@capacitor/app').then(({ App: CapApp }) => {
      CapApp.addListener('backButton', () => {
        if (routeRef.current.name !== 'home') setRoute({ name: 'home' })
        else CapApp.exitApp()
      }).then((h) => { handle = h })
    })
    return () => handle?.remove()
  }, [])

  const showTutorial = !progress.tutorialSeen
  const worldDone = progress.worldJustCompleted

  return (
    <div className="app">
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={route.name + (route.levelId ?? '') + (route.daily ? 'd' : '')}
          className="screen"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          {route.name === 'home' && (
            <Home progress={progress} onPlay={goPlay} onFree={goFree} onAlbum={goAlbum} onParents={goParents} />
          )}
          {route.name === 'play' && (
            <Play
              level={getLevel(route.levelId)}
              isDaily={route.daily}
              progress={progress}
              onHome={goHome}
              onPlay={goPlay}
            />
          )}
          {route.name === 'free' && <FreePlay progress={progress} onHome={goHome} onAlbum={goAlbum} />}
          {route.name === 'album' && <Album progress={progress} onHome={goHome} />}
          {route.name === 'parents' && <Parents progress={progress} onHome={goHome} />}
        </motion.div>
      </AnimatePresence>

      {showTutorial && (
        <Tutorial onDone={progress.markTutorialSeen} />
      )}

      {!showTutorial && worldDone && route.name === 'home' && (
        <WorldComplete
          worldId={worldDone}
          starsOf={progress.starsOf}
          onContinue={() => progress.ackWorld(worldDone)}
        />
      )}
    </div>
  )
}
