/** Reunion: 18 Sep 2026, 00:00:00 in Asia/Ho_Chi_Minh (UTC+7) */
export const REUNION_TARGET_MS = Date.parse('2026-09-17T17:00:00.000Z')

/** Journey bar: 1 Jan 2026 → reunion (Vietnam local midnight starts) */
export const JOURNEY_START_MS = Date.parse('2025-12-31T17:00:00.000Z')

/** Độ dài PIN trên UI (phải trùng số ký tự của PASSCODE) */
export const PIN_DIGIT_COUNT = 6

export const PASSCODE = '140226'

if (import.meta.env.DEV && PASSCODE.length !== PIN_DIGIT_COUNT) {
  throw new Error('PASSCODE phải đúng PIN_DIGIT_COUNT ký tự')
}

export const TZ_SK = 'Europe/Bratislava'
export const TZ_VN = 'Asia/Ho_Chi_Minh'
