import { motion } from 'framer-motion'

const hearts = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: (i * 73) % 100,
  delay: i * 0.4,
  duration: 12 + (i % 5) * 2,
  scale: 0.4 + (i % 4) * 0.15,
}))

export function AnimatedMeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="mesh-gradient absolute inset-[-20%] opacity-90"
        aria-hidden
      />
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-[#ffd1dc]/35"
          style={{
            left: `${h.x}%`,
            bottom: '-8%',
            fontSize: `${1.25 * h.scale}rem`,
          }}
          initial={{ y: 0, opacity: 0.2, rotate: 0 }}
          animate={{
            y: ['0vh', '-120vh'],
            opacity: [0.15, 0.45, 0.2],
            rotate: [0, 12, -8, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: h.delay,
          }}
        >
          ❤
        </motion.span>
      ))}
      <style>{`
        .mesh-gradient {
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, #ffd1dc 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 80% 20%, #ffe4e1 0%, transparent 50%),
            radial-gradient(ellipse 60% 70% at 50% 80%, #fadadd 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 70% 70%, #fff0f5 0%, transparent 45%),
            linear-gradient(160deg, #fff0f5 0%, #ffe8ef 40%, #ffd6e0 100%);
          animation: mesh-shift 18s ease-in-out infinite alternate;
        }
        @keyframes mesh-shift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(2%, -2%) scale(1.05); }
        }
      `}</style>
    </div>
  )
}
