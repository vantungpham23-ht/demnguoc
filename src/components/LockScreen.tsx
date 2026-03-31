import { AnimatePresence, motion } from 'framer-motion'
import { Lock, LockOpen } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { PASSCODE, PIN_DIGIT_COUNT } from '../lib/constants'

type Props = {
  onUnlock: () => void
}

const shake = {
  x: [0, -12, 12, -10, 10, -6, 6, 0],
  transition: { duration: 0.45 },
}

export function LockScreen({ onUnlock }: Props) {
  const [digits, setDigits] = useState<string[]>(() =>
    Array(PIN_DIGIT_COUNT).fill(''),
  )
  const [error, setError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const checkComplete = useCallback(
    (next: string[]) => {
      const code = next.join('')
      if (code.length !== PIN_DIGIT_COUNT) return
      if (code === PASSCODE) {
        setUnlocked(true)
        window.setTimeout(onUnlock, 700)
      } else {
        setError(true)
        setDigits(Array(PIN_DIGIT_COUNT).fill(''))
        inputsRef.current[0]?.focus()
        window.setTimeout(() => setError(false), 600)
      }
    },
    [onUnlock],
  )

  const handleChange = (index: number, raw: string) => {
    const v = raw.replace(/\D/g, '').slice(-1)
    setDigits((prev) => {
      const next = [...prev]
      next[index] = v
      if (v && index < PIN_DIGIT_COUNT - 1) {
        window.requestAnimationFrame(() => inputsRef.current[index + 1]?.focus())
      }
      if (next.every((d) => d !== '')) checkComplete(next)
      return next
    })
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, PIN_DIGIT_COUNT)
    if (!text) return
    const next = [...Array(PIN_DIGIT_COUNT)].map((_, i) => text[i] ?? '')
    setDigits(next)
    const last = Math.min(text.length, PIN_DIGIT_COUNT - 1)
    inputsRef.current[last]?.focus()
    if (text.length === PIN_DIGIT_COUNT) checkComplete(next)
  }

  return (
    <motion.div
      className="flex min-h-svh items-center justify-center px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        layout
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/50 bg-white/25 p-8 shadow-[0_25px_60px_-15px_rgba(232,180,188,0.45)] backdrop-blur-xl"
        animate={unlocked ? { opacity: 0, scale: 0.92, filter: 'blur(12px)' } : {}}
        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-[#ffd1dc]/20" />

        <div className="relative flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="open"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffd1dc]/50 text-[#c45c6f]"
              >
                <LockOpen className="h-8 w-8" strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="locked"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/50 text-[#b87a87] shadow-inner"
              >
                <Lock className="h-8 w-8" strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2 text-center">
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#5c3d48] sm:text-2xl">
              Nhập mật mã để mở khóa kỷ niệm…
            </h1>
            <p className="text-sm text-[#8b6b75]">Mã gồm 6 chữ số</p>
          </div>

          <motion.div
            className="grid w-full grid-cols-6 gap-2 sm:gap-3"
            animate={error ? shake : {}}
          >
            {digits.map((d, i) => (
              <input
                key={`pin-${i}`}
                ref={(el) => {
                  inputsRef.current[i] = el
                }}
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                aria-label={`Chữ số ${i + 1}`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`h-11 w-full min-w-0 rounded-xl border-2 bg-white/55 text-center font-mono text-base font-semibold text-[#4a3540] shadow-inner outline-none transition-colors sm:h-14 sm:text-lg ${
                  error
                    ? 'border-[#f0a8b0] ring-2 ring-[#f5b8c0]/60'
                    : 'border-white/70 focus:border-[#e8b4bc] focus:ring-2 focus:ring-[#ffd1dc]/80'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
