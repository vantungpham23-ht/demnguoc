import { motion } from 'framer-motion'

type Props = {
  value: number
  label: string
  pad?: number
}

export function CountdownUnit({ value, label, pad = 2 }: Props) {
  const str = String(Math.max(0, value)).padStart(pad, '0')

  return (
    <motion.div
      className="group relative flex min-w-[4.5rem] flex-col items-center rounded-2xl border border-white/60 bg-white/35 px-4 py-4 shadow-[0_12px_40px_-12px_rgba(232,180,188,0.5)] backdrop-blur-md sm:min-w-[5.5rem] sm:px-5 sm:py-5"
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-transparent opacity-70" />
      <span className="relative font-mono text-3xl font-semibold tabular-nums tracking-tight text-[#4a3540] drop-shadow-sm sm:text-4xl md:text-5xl">
        {str}
      </span>
      <span className="relative mt-1 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a7a85] sm:text-xs">
        {label}
      </span>
    </motion.div>
  )
}
