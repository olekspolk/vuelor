export type GradientType = 'linear' | 'radial' | 'conic'

export type GradientStop = {
  /** Canonical #RRGGBBAA hex color. */
  color: string,
  /** Integer percentage, 0–100. */
  position: number
}

export type ParsedGradient = {
  type: GradientType,
  /** Degrees, normalized to 0–359. Linear and conic only. */
  angle?: number,
  stops: GradientStop[]
}
