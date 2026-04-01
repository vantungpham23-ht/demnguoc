import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { AnimatedMeshBackground } from './components/AnimatedMeshBackground'
import { LoadingScreen } from './components/LoadingScreen'

const LockScreen = lazy(() =>
  import('./components/LockScreen').then((m) => ({ default: m.LockScreen })),
)
const Dashboard = lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard })),
)

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
        preload="metadata"
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
        <Suspense
          fallback={<div className="min-h-svh w-full" aria-hidden />}
        >
          <AnimatePresence mode="wait">
            {phase === 'auth' && (
              <LockScreen key="lock" musicRef={musicRef} onUnlock={unlock} />
            )}
            {phase === 'dashboard' && <Dashboard key="dash" />}
          </AnimatePresence>
        </Suspense>
      )}
    </div>
  )
}
