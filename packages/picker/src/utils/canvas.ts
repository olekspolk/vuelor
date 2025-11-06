import { HSLtoHSV, HSVtoRGB } from './color.ts'

export function drawHsvGradient(ctx: CanvasRenderingContext2D, hue: number) {
  const WIDTH = ctx.canvas.width
  const HEIGHT = ctx.canvas.height
  const color = `hsl(${hue},100%,50%)`
  ctx.rect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = color
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const grdWhite = ctx.createLinearGradient(0, 0, WIDTH, 0)
  grdWhite.addColorStop(0, 'rgba(255,255,255,1)')
  grdWhite.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grdWhite
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  const grdBlack = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  grdBlack.addColorStop(0, 'rgba(0,0,0,0)')
  grdBlack.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.fillStyle = grdBlack
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
}

export function drawHslGradient(ctx: CanvasRenderingContext2D, hue: number) {
  const WIDTH = ctx.canvas.width
  const HEIGHT = ctx.canvas.height

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  // 1) Base horizontal gradient at L=0.5 with increasing S
  const grad = ctx.createLinearGradient(0, 0, WIDTH, 0)
  const stops = 12 // more stops → smoother
  for (let i = 0; i <= stops; i++) {
    const t = i / stops // S
    const { r, g, b } = HSVtoRGB(HSLtoHSV({ h: hue, s: t, l: 0.5 }))
    grad.addColorStop(t, `rgb(${r} ${g} ${b})`)
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 2a) Lighten toward white at the top (screen)
  ctx.globalCompositeOperation = 'screen'
  let gTop = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gTop.addColorStop(0,   'white')
  gTop.addColorStop(0.5, 'rgba(255,255,255,0)')
  ctx.fillStyle = gTop
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // 2b) Darken toward black at the bottom (multiply)
  ctx.globalCompositeOperation = 'multiply'
  let gBot = ctx.createLinearGradient(0, 0, 0, HEIGHT)
  gBot.addColorStop(0.5, 'rgba(0,0,0,0)')
  gBot.addColorStop(1,   'black')
  ctx.fillStyle = gBot
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // reset mode
  ctx.globalCompositeOperation = 'source-over'
}
