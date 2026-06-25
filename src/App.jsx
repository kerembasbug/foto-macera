import { useProgress } from './useProgress.js'
import { getLevel } from './game.js'
import { useState } from 'react'
import Home from './screens/Home.jsx'
import Play from './screens/Play.jsx'
import FreePlay from './screens/FreePlay.jsx'
import Album from './screens/Album.jsx'
import Tutorial from './screens/Tutorial.jsx'
import WorldComplete from './components/WorldComplete.jsx'

export default function App() {
  const progress = useProgress()
  const [route, setRoute] = useState({ name: 'home' })

  const goHome = () => setRoute({ name: 'home' })
  const goPlay = (levelId, daily = false) => setRoute({ name: 'play', levelId, daily })
  const goFree = () => setRoute({ name: 'free' })
  const goAlbum = () => setRoute({ name: 'album' })

  const showTutorial = !progress.tutorialSeen
  const worldDone = progress.worldJustCompleted

  return (
    <div className="app">
      {route.name === 'home' && (
        <Home progress={progress} onPlay={goPlay} onFree={goFree} onAlbum={goAlbum} />
      )}
      {route.name === 'play' && (
        <Play
          key={route.levelId + (route.daily ? '-daily' : '')}
          level={getLevel(route.levelId)}
          isDaily={route.daily}
          progress={progress}
          onHome={goHome}
          onPlay={goPlay}
        />
      )}
      {route.name === 'free' && <FreePlay onHome={goHome} />}
      {route.name === 'album' && <Album progress={progress} onHome={goHome} />}

      {showTutorial && (
        <Tutorial onDone={progress.markTutorialSeen} />
      )}

      {!showTutorial && worldDone && (
        <WorldComplete
          worldId={worldDone}
          starsOf={progress.starsOf}
          onContinue={() => progress.ackWorld(worldDone)}
        />
      )}
    </div>
  )
}
