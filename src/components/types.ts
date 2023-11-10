export type Position = {
    top: number,
    left: number
}

export type Point = {
    left: number,
    r: number,
    g: number,
    b: number,
    a: number
}

export type Gradient = {
    angle: number,
    points: Point[]
}

export type HSV = { h: number, s: number, v: number }
export type HSVA = HSV & { a: number }
export type RGB = { r: number, g: number, b: number }
export type RGBA = RGB & { a: number }
export type HSL = { h: number, s: number, l: number }
export type HSLA = HSL & { a: number }
export type Hex = string
export type Hexa = string

export interface Color {
    alpha: number
    hex: Hex
    hexa: Hexa
    hsla: HSLA
    hsva: HSVA
    hue: number
    rgba: RGBA
}