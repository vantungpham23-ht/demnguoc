import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  onComplete: () => void
  durationMs?: number
}

function quadBezier(t: number, p0: number, p1: number, p2: number) {
  const u = 1 - t
  return u * u * p0 + 2 * u * t * p1 + t * t * p2
}

function flightKeyframes(steps: number) {
  const leftPct: string[] = []
  const topPct: string[] = []
  const times: number[] = []
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    times.push(t)
    const x = quadBezier(t, 48, 200, 352)
    const y = quadBezier(t, 100, 40, 100)
    leftPct.push(`${(x / 400) * 100}%`)
    topPct.push(`${(y / 200) * 100}%`)
  }
  return { leftPct, topPct, times }
}

export function LoadingScreen({ onComplete, durationMs = 2500 }: Props) {
  const [exit, setExit] = useState(false)
  const finished = useRef(false)
  const { leftPct, topPct, times } = useMemo(() => flightKeyframes(32), [])

  useEffect(() => {
    const t = window.setTimeout(() => setExit(true), durationMs - 500)
    return () => window.clearTimeout(t)
  }, [durationMs])

  const handleExitDone = () => {
    if (!exit) return
    if (finished.current) return
    finished.current = true
    onComplete()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#fff0f5] via-[#ffe8ef] to-[#ffd1dc]"
      initial={{ opacity: 1 }}
      animate={exit ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      onAnimationComplete={handleExitDone}
    >
      <div className="relative mx-auto w-full max-w-md px-6">
        <div className="relative aspect-[2/1] w-full">
          <svg
            viewBox="0 0 400 200"
            className="absolute inset-0 h-full w-full drop-shadow-sm"
            aria-hidden
          >
            <defs>
              <linearGradient id="trail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd1dc" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#e8b4bc" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <motion.path
              d="M 48 100 Q 200 40 352 100"
              fill="none"
              stroke="url(#trail)"
              strokeWidth="3"
              strokeDasharray="8 10"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 0.85 }}
              transition={{ duration: 2.2, ease: 'easeInOut' }}
            />

            <text
              x="48"
              y="150"
              textAnchor="middle"
              className="fill-[#8b6b75] text-[11px] font-semibold"
              style={{ fontFamily: 'Nunito, Inter, sans-serif' }}
            >
              Slovakia
            </text>
            <text
              x="352"
              y="150"
              textAnchor="middle"
              className="fill-[#8b6b75] text-[11px] font-semibold"
              style={{ fontFamily: 'Nunito, Inter, sans-serif' }}
            >
              Việt Nam
            </text>

            <motion.g
              style={{ transformOrigin: '352px 100px' }}
              initial={{ scale: 0.85 }}
              animate={{ scale: [0.85, 1.1, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 0.5 }}
            >
              <circle cx="352" cy="100" r="18" fill="#ff8fa3" opacity={0.95} />
              <text
                x="352"
                y="106"
                textAnchor="middle"
                className="fill-white text-[14px]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                ♥
              </text>
            </motion.g>
          </svg>

          <motion.div
            className="pointer-events-none absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-white/95 text-[#c97b8a] shadow-md ring-1 ring-[#ffd1dc]/60 sm:h-8 sm:w-8"
            initial={{ left: leftPct[0], top: topPct[0] }}
            animate={{ left: leftPct, top: topPct }}
            transition={{
              duration: 2.2,
              times,
              ease: 'easeInOut',
            }}
          >
            <Plane className="h-4 w-4" strokeWidth={2.2} />
          </motion.div>
        </div>

        <p className="mt-6 text-center font-display text-sm font-medium tracking-wide text-[#7a5f68]">
          Đang bay về phía em…
        </p>
      </div>
    </motion.div>
  )
}
