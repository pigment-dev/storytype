// A tiny two-note "ding" via Web Audio — no asset to load. Must be triggered
// from a user gesture (copy/save button), which satisfies iOS autoplay rules.
let ctx: AudioContext | null = null

export function playDing(): void {
  try {
    type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }
    const Ctor = window.AudioContext || (window as WebkitWindow).webkitAudioContext
    if (!Ctor) return
    ctx = ctx || new Ctor()
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime
    const notes: Array<[number, number]> = [
      [880, 0], // A5
      [1318.5, 0.08] // E6
    ]
    for (const [freq, at] of notes) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      gain.connect(ctx.destination)
      const start = now + at
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.16, start + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22)
      osc.start(start)
      osc.stop(start + 0.24)
    }
  } catch {
    /* audio unavailable — silently skip */
  }
}
