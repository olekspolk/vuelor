import type { GradientStop, ParsedGradient } from './types.ts'

/** Serialize stops to the `#RRGGBBAA <position>%` comma list CSS expects. */
export function serializeGradientStops (stops: readonly GradientStop[]): string {
  return stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')
}

// Angle fallbacks only apply to hand-built ParsedGradient values: 90 keeps a
// linear gradient reading left-to-right (the editor default), 0 matches the
// CSS default for conic.
export function serializeGradient (gradient: ParsedGradient): string {
  const stops = serializeGradientStops(gradient.stops)
  switch (gradient.type) {
    case 'radial':
      return `radial-gradient(circle at center, ${stops})`
    case 'conic':
      return `conic-gradient(from ${gradient.angle ?? 0}deg, ${stops})`
    default:
      return `linear-gradient(${gradient.angle ?? 90}deg, ${stops})`
  }
}

/** Flat left-to-right strip of the stops, for slider tracks and previews. */
export function stopsToTrackCSS (stops: readonly GradientStop[], direction = 'to right'): string {
  return `linear-gradient(${direction}, ${serializeGradientStops(stops)})`
}
