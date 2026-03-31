import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'
import { AnimatedMeshBackground } from './components/AnimatedMeshBackground'
import { Dashboard } from './components/Dashboard'
import { LoadingScreen } from './components/LoadingScreen'
import { LockScreen } from './components/LockScreen'

type Phase = 'loading' | 'auth' | 'dashboard'

export default function App() {
  const [phase, setPhase] = useState<Phase>('loading')

  const finishLoading = useCallback(() => setPhase('auth'), [])
  const unlock = useCallback(() => setPhase('dashboard'), [])

  return (
    <div className="relative min-h-svh font-sans">
      <AnimatedMeshBackground />

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <LoadingScreen key="load" onComplete={finishLoading} durationMs={2500} />
        )}
      </AnimatePresence>

      {phase !== 'loading' && (
        <AnimatePresence mode="wait">
          {phase === 'auth' && <LockScreen key="lock" onUnlock={unlock} />}
          {phase === 'dashboard' && <Dashboard key="dash" />}
        </AnimatePresence>
      )}
    </div>
  )
}
