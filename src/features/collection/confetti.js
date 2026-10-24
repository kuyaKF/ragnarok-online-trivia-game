/*
 * Confetti when a box opens, using canvas-confetti. The library is loaded the first time
 * it is needed (see preloadConfetti) so it stays out of the main bundle. Rarer rewards
 * get a bigger celebration. Confetti is decoration, so any failure is ignored.
 */
let loading = null

export function preloadConfetti() {
  loading ??= import('canvas-confetti').then((m) => m.default)
  return loading
}

const COLORS = {
  common: ['#e5e7eb', '#9ca3af', '#ffffff'],
  uncommon: ['#22c55e', '#86efac', '#ffffff'],
  rare: ['#3b82f6', '#93c5fd', '#ffffff'],
  epic: ['#a855f7', '#d8b4fe', '#f0abfc', '#ffffff'],
  legendary: ['#fbbf24', '#f59e0b', '#fde68a', '#f97316', '#ffffff'],
}

// How big each tier's celebration is
const BURSTS = {
  common: [{ particleCount: 40, spread: 60, startVelocity: 30 }],
  uncommon: [{ particleCount: 70, spread: 80, startVelocity: 35 }],
  rare: [{ particleCount: 110, spread: 100, startVelocity: 40 }],
  epic: [
    { particleCount: 90, spread: 70, startVelocity: 45, angle: 60, origin: { x: 0.1, y: 0.7 } },
    { particleCount: 90, spread: 70, startVelocity: 45, angle: 120, origin: { x: 0.9, y: 0.7 } },
    { particleCount: 80, spread: 110, startVelocity: 35 },
  ],
  legendary: [
    { particleCount: 160, spread: 120, startVelocity: 50 },
    { particleCount: 100, spread: 70, startVelocity: 55, angle: 60, origin: { x: 0.1, y: 0.7 }, delay: 250 },
    { particleCount: 100, spread: 70, startVelocity: 55, angle: 120, origin: { x: 0.9, y: 0.7 }, delay: 250 },
    { particleCount: 140, spread: 160, startVelocity: 40, scalar: 1.2, delay: 600 },
    { particleCount: 140, spread: 160, startVelocity: 40, scalar: 1.2, delay: 1000 },
  ],
}

export async function celebrate(tier) {
  try {
    const confetti = await preloadConfetti()
    const key = BURSTS[tier] ? tier : 'common' // unknown tier: treat as common
    for (const { delay = 0, ...burst } of BURSTS[key]) {
      const fire = () =>
        confetti({
          origin: { x: 0.5, y: 0.5 },
          colors: COLORS[key],
          disableForReducedMotion: true,
          zIndex: 100, // above the modal
          ...burst,
        })
      if (delay === 0) fire()
      else setTimeout(fire, delay)
    }
  } catch {
    // no canvas, blocked, or the chunk failed to load: skip the confetti
  }
}
