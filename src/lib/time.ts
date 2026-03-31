import { TZ_SK, TZ_VN } from './constants'

export function getHourInTimeZone(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const hour = parts.find((p) => p.type === 'hour')?.value
  return parseInt(hour ?? '0', 10)
}

export function isDaytimeInZone(date: Date, timeZone: string): boolean {
  const h = getHourInTimeZone(date, timeZone)
  return h >= 6 && h < 18
}

export function formatTimeInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatDateInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

export type ClockZone = { id: string; label: string; timeZone: string }

export const CLOCK_ZONES: ClockZone[] = [
  { id: 'sk', label: 'Slovakia Time', timeZone: TZ_SK },
  { id: 'vn', label: 'Việt Nam Time', timeZone: TZ_VN },
]
