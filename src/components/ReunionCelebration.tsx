import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { REUNION_TARGET_MS, TZ_VN } from '../lib/constants'
import { formatDateInZone } from '../lib/time'

function fireCelebrationConfetti() {
  const pink = ['#ffd1dc', '#ff8fa3', '#e8b4bc', '#fff0f5', '#fadadd']
  const defaults = { spread: 82, ticks: 260, gravity: 0.52, decay: 0.91, startVelocity: 38 }
  const burst = (x: number, y: number, angle: number, count: number) => {
    confetti({
      ...defaults,
      particleCount: count,
      origin: { x, y },
      angle,
      colors: pink,
      scalar: 0.95,
    })
  }
  burst(0.08, 0.62, 52, 70)
  burst(0.92, 0.58, 128, 70)
  burst(0.5, 0.12, 90, 85)
  window.setTimeout(() => burst(0.5, 0.9, 90, 60), 220)
  window.setTimeout(() => {
    burst(0.22, 0.32, 68, 45)
    burst(0.78, 0.32, 112, 45)
  }, 450)
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

const rise = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const floatHearts = [
  { left: '8%', top: '12%', delay: 0, scale: 0.85 },
  { left: '88%', top: '18%', delay: 0.25, scale: 0.7 },
  { left: '12%', top: '78%', delay: 0.45, scale: 0.65 },
  { left: '86%', top: '72%', delay: 0.15, scale: 0.75 },
  { left: '50%', top: '4%', delay: 0.35, scale: 0.55 },
]

export function ReunionCelebration() {
  const confettiFired = useRef(false)
  const reunionDate = new Date(REUNION_TARGET_MS)
  const dateLine = formatDateInZone(reunionDate, TZ_VN)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true
    fireCelebrationConfetti()
  }, [])

  return (
    <div className="relative w-full max-w-lg px-1">
      {floatHearts.map((h, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-lg text-[#ff8fa3]/50 drop-shadow-sm sm:text-xl"
          style={{ left: h.left, top: h.top }}
          initial={{ opacity: 0, scale: 0.5, y: 8 }}
          animate={{
            opacity: [0.35, 0.65, 0.4],
            y: [0, -6, 0],
            scale: [h.scale, h.scale * 1.08, h.scale],
          }}
          transition={{
            duration: 4.5,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden
        >
          ♥
        </motion.span>
      ))}

      <div className="pointer-events-none absolute -inset-10 rounded-[2.75rem] bg-gradient-to-br from-[#ffd1dc]/45 via-[#fff0f5]/20 to-[#e8b4bc]/40 blur-3xl" />

      <motion.div
        className="relative overflow-hidden rounded-[1.85rem] border border-white/60 bg-white/32 p-8 shadow-[0_32px_80px_-22px_rgba(232,130,150,0.55)] backdrop-blur-xl sm:p-11"
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-[#fffafc]/25 to-[#ffd1dc]/18" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#ffd1dc]/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-[#e8b4bc]/30 blur-2xl" />

        <motion.div
          className="relative flex flex-col items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div
            variants={rise}
            className="relative mb-2 flex justify-center"
            aria-hidden
          >
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/70 bg-gradient-to-br from-[#ffd1dc]/80 to-[#e8b4bc]/70 text-[#c45c6f] shadow-[0_16px_40px_-12px_rgba(200,90,110,0.45)]"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="h-10 w-10" fill="currentColor" strokeWidth={1.5} />
              <motion.span
                className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#e8a0b0] shadow-md"
                initial={{ rotate: -12, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              </motion.span>
            </motion.div>
          </motion.div>

          <motion.h2
            variants={rise}
            className="relative text-center font-display text-[1.35rem] font-bold leading-snug tracking-tight text-[#4a3540] drop-shadow-[0_0_20px_rgba(255,209,220,0.6)] sm:text-2xl md:text-[1.65rem]"
          >
            Chúc mừng ngày hai đứa gặp nhau
          </motion.h2>

          <motion.p
            variants={rise}
            className="relative mt-3 text-center text-sm font-medium capitalize text-[#8b6b75] sm:text-base"
          >
            {dateLine}
          </motion.p>

          <motion.div
            variants={rise}
            className="relative mx-auto mt-6 h-px max-w-[12rem] bg-gradient-to-r from-transparent via-[#e8b4bc]/80 to-transparent"
          />

          <motion.p
            variants={rise}
            className="relative mt-6 text-center font-display text-base leading-relaxed text-[#6b4a58] sm:text-lg"
          >
            Hết đếm ngược rồi — giờ là lúc{' '}
            <span className="font-semibold text-[#c45c6f]">ở bên nhau</span>, trò chuyện,
            ôm thật chặt và tận hưởng từng giây.
          </motion.p>

          <motion.p
            variants={rise}
            className="relative mt-4 text-center text-sm italic text-[#9a7a85] sm:text-[0.95rem]"
          >
            Chúc hai đứa một ngày thật ấm và thật nhớ.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
