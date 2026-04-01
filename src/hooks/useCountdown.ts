import { useEffect, useMemo, useState } from 'react'

export type CountdownParts = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

function split(remainingMs: number): CountdownParts {
  if (remainingMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const totalMs = remainingMs
  let ms = remainingMs
  const days = Math.floor(ms / 86_400_000)
  ms -= days * 86_400_000
  const hours = Math.floor(ms / 3_600_000)
  ms -= hours * 3_600_000
  const minutes = Math.floor(ms / 60_000)
  ms -= minutes * 60_000
  const seconds = Math.floor(ms / 1000)
  return { totalMs, days, hours, minutes, seconds }
}

export function useCountdown(targetMs: number): CountdownParts {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const msIntoSecond = Date.now() % 1000
    const msToNextSecond = msIntoSecond === 0 ? 0 : 1000 - msIntoSecond
    let intervalId: ReturnType<typeof setInterval> | undefined
    const timeoutId = window.setTimeout(() => {
      tick()
      intervalId = window.setInterval(tick, 1000)
    }, msToNextSecond)
    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [])

  return useMemo(() => split(targetMs - now), [targetMs, now])
}
