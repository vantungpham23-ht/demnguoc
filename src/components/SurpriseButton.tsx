import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'

type Heart = { id: number; x: number; delay: number; duration: number; rotate: number }

async function burst() {
  const { default: confetti } = await import('canvas-confetti')
  const pink = ['#ffd1dc', '#ff8fa3', '#e8b4bc', '#fff0f5', '#fadadd']
  const count = 120
  const defaults = { spread: 70, ticks: 200, gravity: 0.65, decay: 0.92 }

  const fire = (x: number, y: number, angle: number) => {
    confetti({
      ...defaults,
      particleCount: Math.floor(count / 3),
      origin: { x, y },
      angle,
      colors: pink,
      scalar: 0.9,
    })
  }

  fire(0.15, 0.65, 60)
  fire(0.85, 0.55, 120)
  fire(0.5, 0.2, 90)
  window.setTimeout(() => fire(0.5, 0.85, 90), 180)
}

function randomHearts(n: number): Heart[] {
  return Array.from({ length: n }, (_, i) => ({
    id: Date.now() + i,
    x: Math.random() * 92 + 4,
    delay: Math.random() * 0.35,
    duration: 2.8 + Math.random() * 2,
    rotate: Math.random() * 40 - 20,
  }))
}

export function SurpriseButton() {
  const [hearts, setHearts] = useState<Heart[]>([])

  const handleClick = useCallback(() => {
    void burst()
    setHearts((h) => [...h, ...randomHearts(28)])
    window.setTimeout(() => {
      setHearts([])
    }, 5200)
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            className="absolute text-2xl text-[#ff8fa3]/90 drop-shadow-md sm:text-3xl"
            style={{ left: `${h.x}%`, bottom: '-5%' }}
            initial={{ y: 0, opacity: 0.85, scale: 0.6, rotate: h.rotate }}
            animate={{
              y: ['0vh', '-115vh'],
              opacity: [0.9, 1, 0.4],
              rotate: [h.rotate, h.rotate + 25],
              scale: [0.7, 1.1, 0.95],
            }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              ease: 'easeOut',
            }}
          >
            ❤
          </motion.span>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={handleClick}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-[#ffd1dc] to-[#e8b4bc] text-white shadow-[0_12px_40px_-8px_rgba(232,120,140,0.65)] backdrop-blur-sm sm:bottom-8 sm:right-8 sm:h-16 sm:w-16"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Bất ngờ dành cho em"
      >
        <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
      </motion.button>
    </>
  )
}
