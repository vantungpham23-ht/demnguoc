import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

/** Deterministic pseudo-random in [0, 1) */
function hash01(n: number, salt: number): number {
  const x = Math.sin(n * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

type StarSpec = {
  x: number
  y: number
  size: number
  delay: number
  duration: number
  glow: number
}

/** Chi chít toàn khung nhìn (kể cả phía dưới đồng hồ); lệch pha giữa các lớp xoay */
function buildDenseField(
  cols: number,
  rows: number,
  salt: number,
  sizeRange: [number, number],
  phaseCellX = 0,
  phaseCellY = 0,
): StarSpec[] {
  const out: StarSpec[] = []
  let i = 0
  const cellW = 100 / cols
  const cellH = 100 / rows
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jx = (hash01(i, salt) - 0.5) * cellW * 0.88
      const jy = (hash01(i, salt + 1) - 0.5) * cellH * 0.88
      let x = (col + phaseCellX + 0.5) * cellW + jx
      let y = (row + phaseCellY + 0.5) * cellH + jy
      x = ((x % 100) + 100) % 100
      y = ((y % 100) + 100) % 100
      out.push({
        x: Math.min(99.2, Math.max(0.8, x)),
        y: Math.min(99.2, Math.max(0.8, y)),
        size: sizeRange[0] + hash01(i, salt + 2) * (sizeRange[1] - sizeRange[0]),
        delay: hash01(i, salt + 3) * -16,
        duration: 2 + hash01(i, salt + 4) * 3.6,
        glow: 0.48 + hash01(i, salt + 5) * 0.52,
      })
      i++
    }
  }
  return out
}

/** Thêm lớp bụi sao nhỏ chỉ phủ nửa dưới — xoay rõ dưới khu đồng hồ */
function buildLowerDust(
  count: number,
  salt: number,
  sizeRange: [number, number],
): StarSpec[] {
  return Array.from({ length: count }, (_, i) => ({
    x: 4 + hash01(i, salt) * 92,
    y: 52 + hash01(i, salt + 1) * 46,
    size: sizeRange[0] + hash01(i, salt + 2) * (sizeRange[1] - sizeRange[0]),
    delay: hash01(i, salt + 3) * -14,
    duration: 1.8 + hash01(i, salt + 4) * 2.8,
    glow: 0.4 + hash01(i, salt + 5) * 0.45,
  }))
}

const COLS = 22
const ROWS = 17

const STARS_FAR = buildDenseField(COLS, ROWS, 2, [1, 2.2], 0, 0)
const STARS_MID = buildDenseField(COLS, ROWS, 17, [1.1, 2.5], 0.5, 0.33)
const STARS_NEAR = buildDenseField(COLS, ROWS, 31, [1.4, 3.2], 0.33, 0.5)
const STARS_DUST_FAR = buildLowerDust(140, 71, [0.9, 1.6])
const STARS_DUST_NEAR = buildLowerDust(120, 89, [1.1, 2])

const hearts = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: (i * 73) % 100,
  delay: i * 0.45,
  duration: 14 + (i % 5) * 2.2,
  scale: 0.35 + (i % 4) * 0.12,
}))

function StarLayer({
  stars,
  durationSec,
  blurPx,
  subtleGlow,
}: {
  stars: StarSpec[]
  durationSec: number
  blurPx: number
  subtleGlow?: boolean
}) {
  return (
    <div
      className="galaxy-rotate absolute"
      style={
        {
          ['--galaxy-spin' as string]: `${durationSec}s`,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
        } as CSSProperties
      }
    >
      {stars.map((s, i) => {
        const glow = subtleGlow
          ? `0 0 ${s.size * 2}px ${s.size * 0.4}px rgba(255,255,255,${0.65 * s.glow}), 0 0 1px rgba(255,255,255,0.85)`
          : `0 0 ${s.size * 2.8}px ${s.size * 0.75}px rgba(255,255,255,${0.85 * s.glow}), 0 0 ${s.size * 5}px ${s.size * 1.2}px rgba(255,248,252,${0.55 * s.glow}), 0 0 1px rgba(255,255,255,0.9)`
        return (
          <span
            key={i}
            className="star-dot absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
              opacity: subtleGlow ? 0.78 : 0.88,
              boxShadow: glow,
              animation: `star-twinkle ${s.duration}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export function AnimatedMeshBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Deep nebula base */}
      <div className="nebula-base absolute inset-0" aria-hidden />

      {/* Slow drifting pastel clouds */}
      <div className="nebula-drift absolute inset-[-30%] opacity-[0.92]" aria-hidden />
      <div
        className="nebula-drift nebula-drift--b absolute inset-[-35%] opacity-80"
        aria-hidden
      />

      {/* Soft vignette (under mesh so colour stays soft) */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_0%,rgba(255,240,248,0.1)_55%,rgba(245,220,232,0.28)_100%)]"
        aria-hidden
      />

      {/* Pastel wash — below stars so dots stay visible */}
      <div className="mesh-gradient absolute inset-[-15%] opacity-[0.42]" aria-hidden />

      {/* Rotating star fields (clockwise, parallax) — on top of wash */}
      <div className="absolute inset-0">
        <StarLayer stars={STARS_FAR} durationSec={110} blurPx={0.45} />
        <StarLayer stars={STARS_DUST_FAR} durationSec={125} blurPx={0.35} subtleGlow />
        <StarLayer stars={STARS_MID} durationSec={72} blurPx={0} />
        <StarLayer stars={STARS_NEAR} durationSec={46} blurPx={0} />
        <StarLayer stars={STARS_DUST_NEAR} durationSec={52} blurPx={0} subtleGlow />
      </div>

      {/* Light veil: keeps UI readable without hiding stars */}
      <div className="mesh-veil absolute inset-0" aria-hidden />

      {/* Floating hearts — non-rotating */}
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-[#ffd1dc]/30"
          style={{
            left: `${h.x}%`,
            bottom: '-8%',
            fontSize: `${1.15 * h.scale}rem`,
          }}
          initial={{ y: 0, opacity: 0.15, rotate: 0 }}
          animate={{
            y: ['0vh', '-120vh'],
            opacity: [0.12, 0.38, 0.15],
            rotate: [0, 10, -6, 0],
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
        .nebula-base {
          background:
            radial-gradient(ellipse 100% 82% at 50% 100%, #f8d8e8 0%, #efd4e8 26%, #e8d4ee 50%, #f2e6f5 72%, #fff7fb 100%),
            radial-gradient(ellipse 90% 68% at 50% 0%, #fff5fb 0%, transparent 58%),
            linear-gradient(168deg, #4a3048 0%, #5c3d52 16%, #7a4a62 38%, #a0687a 62%, #d898ae 82%, #ffd6e5 100%);
          animation: nebula-breathe 16s ease-in-out infinite alternate;
        }

        .nebula-drift {
          background:
            radial-gradient(ellipse 55% 45% at 25% 35%, rgba(255, 182, 210, 0.55) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 78% 25%, rgba(255, 209, 220, 0.5) 0%, transparent 52%),
            radial-gradient(ellipse 45% 50% at 60% 75%, rgba(237, 200, 230, 0.45) 0%, transparent 50%),
            radial-gradient(ellipse 40% 35% at 15% 70%, rgba(255, 228, 235, 0.4) 0%, transparent 48%);
          animation: drift-a 22s ease-in-out infinite alternate;
        }

        .nebula-drift--b {
          background:
            radial-gradient(ellipse 50% 42% at 70% 40%, rgba(255, 200, 220, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 30% 60%, rgba(230, 190, 235, 0.35) 0%, transparent 55%),
            radial-gradient(ellipse 35% 40% at 85% 80%, rgba(255, 240, 250, 0.35) 0%, transparent 45%);
          animation: drift-b 28s ease-in-out infinite alternate;
        }

        @keyframes nebula-breathe {
          0% { filter: hue-rotate(-8deg) saturate(1.05) brightness(0.98); transform: scale(1) translate(0, 0); }
          100% { filter: hue-rotate(10deg) saturate(1.2) brightness(1.08); transform: scale(1.06) translate(1%, -1%); }
        }

        @keyframes drift-a {
          0% { transform: translate(-6%, 2%) rotate(-2deg); }
          100% { transform: translate(8%, -6%) rotate(6deg); }
        }

        @keyframes drift-b {
          0% { transform: translate(4%, -4%) rotate(1deg) scale(1); }
          100% { transform: translate(-9%, 7%) rotate(-5deg) scale(1.1); }
        }

        .mesh-veil {
          background: linear-gradient(
            165deg,
            rgba(255, 250, 252, 0.22) 0%,
            rgba(255, 242, 248, 0.12) 45%,
            rgba(255, 236, 244, 0.2) 100%
          );
          pointer-events: none;
        }

        .galaxy-rotate {
          left: -55%;
          top: -55%;
          width: 210%;
          height: 210%;
          transform-origin: 50% 50%;
          animation: galaxy-spin-cw var(--galaxy-spin, 200s) linear infinite;
          will-change: transform;
        }

        @keyframes galaxy-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes star-twinkle {
          0%, 100% {
            opacity: 0.55;
            transform: scale(1);
            filter: brightness(1);
          }
          35% {
            opacity: 1;
            transform: scale(1.4);
            filter: brightness(1.25);
          }
          55% {
            opacity: 0.72;
            transform: scale(1.12);
            filter: brightness(1.1);
          }
        }

        .mesh-gradient {
          background:
            radial-gradient(ellipse 80% 60% at 20% 30%, #ffd1dc 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 80% 20%, #ffe4e1 0%, transparent 50%),
            radial-gradient(ellipse 60% 70% at 50% 80%, #fadadd 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 70% 70%, #fff0f5 0%, transparent 45%),
            linear-gradient(160deg, rgba(255, 240, 250, 0.92) 0%, rgba(255, 232, 239, 0.88) 40%, rgba(255, 214, 224, 0.9) 100%);
          animation: mesh-shift 18s ease-in-out infinite alternate;
        }

        @keyframes mesh-shift {
          0% { transform: translate(-1.5%, 1%) scale(1) rotate(0deg); }
          100% { transform: translate(4%, -3.5%) scale(1.07) rotate(1.5deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .galaxy-rotate { animation: none; }
          .nebula-base, .nebula-drift, .nebula-drift--b, .mesh-gradient { animation: none; }
          .star-dot { animation: none !important; opacity: 0.85 !important; }
        }
      `}</style>
    </div>
  )
}
