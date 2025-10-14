import type { Gradient, RGBA } from "./types.ts"

export const DEFAULT_GRADIENT: Gradient = {
  angle: 135,
  points: [
    {
      left: 0,
      r: 179,
      g: 179,
      b: 179,
      a: 1
    },
    {
      left: 100,
      r: 237,
      g: 202,
      b: 202,
      a: 1
    }
  ]
};

export const DEFAULT_COLOR: RGBA = { r: 255, g: 0, b: 255, a: 1 }
