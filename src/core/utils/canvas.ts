export function fillCanvas(ctx: CanvasRenderingContext2D, hue: number) {
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
