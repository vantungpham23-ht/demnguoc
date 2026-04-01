import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  CLOCK_ZONES,
  formatDateInZone,
  formatTimeInZone,
  isDaytimeInZone,
} from '../lib/time'

export function DualClocks() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      {CLOCK_ZONES.map((z, i) => {
        const day = isDaytimeInZone(now, z.timeZone)
        const Icon = day ? Sun : Moon
        return (
          <motion.div
            key={z.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
            className="flex flex-col gap-3 rounded-2xl border border-white/55 bg-white/30 p-5 shadow-[0_14px_40px_-14px_rgba(232,180,188,0.45)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-display text-sm font-semibold text-[#5c3d48] sm:text-base">
                {z.label}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/50 text-[#c97b8a]">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
            </div>
            <p className="font-mono text-2xl font-semibold tabular-nums text-[#3a2a32] sm:text-3xl">
              {formatTimeInZone(now, z.timeZone)}
            </p>
            <p className="text-xs capitalize text-[#8b6b75] sm:text-sm">
              {formatDateInZone(now, z.timeZone)}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
