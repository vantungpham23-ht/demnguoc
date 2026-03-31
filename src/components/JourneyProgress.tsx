import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Plane } from 'lucide-react'
import { useEffect, useState } from 'react'
import { JOURNEY_START_MS, REUNION_TARGET_MS } from '../lib/constants'

function computeProgress() {
  const now = Date.now()
  const span = REUNION_TARGET_MS - JOURNEY_START_MS
  if (span <= 0) return 1
  return Math.min(1, Math.max(0, (now - JOURNEY_START_MS) / span))
}

export function JourneyProgress() {
  const progress = useMotionValue(computeProgress())
  const spring = useSpring(progress, { stiffness: 55, damping: 20 })
  const [pctLabel, setPctLabel] = useState(() =>
    Math.round(computeProgress() * 100),
  )

  useEffect(() => {
    const tick = () => {
      const p = computeProgress()
      progress.set(p)
      setPctLabel(Math.round(p * 100))
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [progress])

  const widthPct = useTransform(spring, (p) => `${p * 100}%`)
  const planeLeft = useTransform(spring, (p) => `${p * 100}%`)

  return (
    <div className="w-full max-w-3xl space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="font-display text-sm font-semibold text-[#6b5560]">
          Hành trình về em
        </span>
        <span className="text-xs font-medium text-[#9a7a85]">{pctLabel}%</span>
      </div>
      <div className="relative h-4 overflow-visible rounded-full border border-white/50 bg-white/35 py-0 shadow-inner backdrop-blur-sm">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#ffd1dc] via-[#f5b8c8] to-[#e8b4bc]"
          style={{ width: widthPct }}
        />
        <motion.div
          className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/95 text-[#c97b8a] shadow-lg"
          style={{ left: planeLeft }}
        >
          <Plane className="h-4 w-4" strokeWidth={2.4} />
        </motion.div>
      </div>
      <p className="px-1 text-center text-xs text-[#8b6b75]">
        Từ đầu năm 2026 đến ngày gặp Hằng · 18 tháng 9, 2026
      </p>
    </div>
  )
}
