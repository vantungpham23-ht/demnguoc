import { motion } from 'framer-motion'
import { CountdownUnit } from './CountdownUnit'
import { DualClocks } from './DualClocks'
import { JourneyProgress } from './JourneyProgress'
import { SurpriseButton } from './SurpriseButton'
import { useCountdown } from '../hooks/useCountdown'
import { REUNION_TARGET_MS } from '../lib/constants'

export function Dashboard() {
  const cd = useCountdown(REUNION_TARGET_MS)
  const arrived = cd.totalMs <= 0

  return (
    <motion.div
      className="relative flex min-h-svh flex-col items-center gap-10 px-4 pb-28 pt-10 sm:gap-12 sm:px-6 sm:pb-32 sm:pt-14"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.h1
        className="max-w-3xl text-center font-display text-2xl font-bold leading-tight tracking-tight text-[#4a3540] drop-shadow-[0_0_24px_rgba(255,209,220,0.85)] sm:text-4xl md:text-5xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Đếm ngược ngày về bên Hằng{' '}
        <span className="inline-block text-[#e85d75]" aria-hidden>
          ❤️
        </span>
      </motion.h1>

      {arrived ? (
        <motion.p
          className="font-display text-xl font-semibold text-[#c45c6f] sm:text-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          Đã đến ngày gặp nhau — chúc hai bạn một khoảnh khắc thật đẹp.
        </motion.p>
      ) : (
        <div className="flex w-full max-w-4xl flex-wrap items-stretch justify-center gap-3 sm:gap-4">
          <CountdownUnit value={cd.days} label="Ngày" pad={2} />
          <CountdownUnit value={cd.hours} label="Giờ" />
          <CountdownUnit value={cd.minutes} label="Phút" />
          <CountdownUnit value={cd.seconds} label="Giây" />
        </div>
      )}

      <DualClocks />
      <JourneyProgress />
      <SurpriseButton />
    </motion.div>
  )
}
