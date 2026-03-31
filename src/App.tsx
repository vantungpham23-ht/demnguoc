import { AnimatePresence } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { AnimatedMeshBackground } from './components/AnimatedMeshBackground'
import { Dashboard } from './components/Dashboard'
import { LoadingScreen } from './components/LoadingScreen'
import { LockScreen } from './components/LockScreen'

type Phase = 'loading' | 'auth' | 'dashboard'

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')
  const musicRef = useRef<HTMLAudioElement>(null)

  const finishLoading = useCallback(() => setPhase('auth'), [])
  const unlock = useCallback(() => setPhase('dashboard'), [])

  return (
    <div className="relative min-h-svh font-sans">
      <audio
        ref={musicRef}
        src={`${import.meta.env.BASE_URL}music.mp3`}
        loop
        preload="auto"
        className="sr-only"
        aria-hidden
      />
      <AnimatedMeshBackground />

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="load" onComplete={finishLoading} durationMs={2500} />
        )}
      </AnimatePresence>

      {phase !== 'loading' && (
        <AnimatePresence mode="wait">
          {phase === 'auth' && (
            <LockScreen key="lock" musicRef={musicRef} onUnlock={unlock} />
          )}
          {phase === 'dashboard' && <Dashboard key="dash" />}
        </AnimatePresence>
      )}
    </div>
  )
}
