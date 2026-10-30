<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Aurora curtains behind the hero, drawn by a fragment shader on a bare WebGL
 * canvas (no library). The palette follows the color picker: a solid pick
 * becomes the rim color with two hue-shifted companions, and a gradient pick
 * contributes its first three stops. The pointer leans the curtains a little.
 */

const props = defineProps({
  color: { type: String, default: '#EE3C4BFF' }
})

const host = ref(null)
const canvas = ref(null)

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_colorC;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(13.7, 7.3);
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.05;
  // The pointer leans the curtains sideways and lifts their hem a touch.
  p.x -= u_pointer.x * 0.12;
  float lift = u_pointer.y * 0.035;

  vec3 glow = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float layer = fi / 3.0;
    float speed = mix(1.5, 0.55, layer);
    float scale = mix(1.8, 0.75, layer);

    // Each curtain's hem: slow large waves with finer folds on top.
    float edge = mix(0.56, 0.84, layer) + lift
      + 0.30 * (fbm(vec2(p.x * scale * 0.7 + fi * 7.31 + t * speed, fi * 3.17 + t * 0.4)) - 0.5);
    float d = uv.y - edge;

    // Vertical light: a bright rim at the hem fading upward, broken into rays with dark sky
    // between; the brighter a ray, the higher it reaches.
    float rays = fbm(vec2(p.x * scale * 3.8 - t * speed * 1.9 + fi * 11.7, fi * 5.73 + t * 0.6));
    rays = 0.15 + 0.85 * smoothstep(0.28, 0.8, rays);
    float reach = mix(5.5, 2.9, layer) / (0.4 + rays);
    float body = exp(-max(d, 0.0) * reach) * smoothstep(-0.02, 0.06, d);
    float rim = 0.7 * exp(-abs(d) * 26.0);
    float light = (body + rim) * rays * rays * mix(1.0, 0.5, layer);

    // Rim keeps the picked color; higher up it drifts through the companions.
    float up = clamp(d * mix(4.5, 2.2, layer), 0.0, 1.0);
    vec3 tint = mix(mix(u_colorA, u_colorB, up), u_colorC, up * up * 0.55 + layer * 0.2);
    glow += light * tint;
  }

  // Keep the lower half of the hero quiet; a soft tonemap holds the glow short of a wash.
  glow *= 1.25 * smoothstep(0.2, 0.5, uv.y);
  glow = 1.0 - exp(-glow * 1.5);
  glow += (hash(gl_FragCoord.xy) - 0.5) / 255.0;

  float alpha = clamp(max(glow.r, max(glow.g, glow.b)), 0.0, 0.85);
  gl_FragColor = vec4(glow, alpha);
}
`

/** '#rgb' / '#rgba' / '#rrggbb' / '#rrggbbaa' → [r, g, b] in 0..1. */
function hexToRgb(hex) {
  let digits = hex.slice(1)
  if (digits.length < 6) digits = digits.split('').map((d) => d + d).join('')
  return [0, 1, 2].map((i) => parseInt(digits.slice(i * 2, i * 2 + 2), 16) / 255)
}

function rgbToHsl([r, g, b]) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 :
    max === g ? ((b - r) / d + 2) / 6 :
    ((r - g) / d + 4) / 6
  return [h, s, l]
}

function hslToRgb([h, s, l]) {
  if (s === 0) return [l, l, l]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const channel = (t) => {
    t = ((t % 1) + 1) % 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)]
}

/** A companion color: the same pick with its hue turned and kept luminous. */
function hueShift(rgb, turns) {
  const [h, s, l] = rgbToHsl(rgb)
  return hslToRgb([h + turns, Math.min(1, s * 0.95 + 0.05), Math.min(0.72, l * 0.9 + 0.16)])
}

/**
 * The aurora's three tints from the picker value: a gradient contributes its
 * first stops, a solid color brings hue-shifted companions.
 */
function palette(value) {
  const stops = (value.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []).map(hexToRgb)
  if (!stops.length) {
    for (const fn of value.match(/rgba?\(([^)]+)\)/g) ?? []) {
      const [r, g, b] = fn.match(/[\d.]+/g).map(Number)
      stops.push([r / 255, g / 255, b / 255])
    }
  }
  const a = stops[0] ?? hexToRgb('#EE3C4B')
  const b = stops[1] ?? hueShift(a, 0.12)
  const c = stops[2] ?? hueShift(a, -0.14)
  return [a, b, c]
}

let applyColor
let cleanup

onMounted(() => {
  const element = host.value
  const gl = canvas.value?.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false
  })
  if (!element || !gl) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
    }
    return shader
  }

  const program = gl.createProgram()
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
  gl.linkProgram(program)
  gl.useProgram(program)

  // One triangle that covers the viewport.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniforms = Object.fromEntries(
    ['u_resolution', 'u_time', 'u_pointer', 'u_colorA', 'u_colorB', 'u_colorC'].map((name) => [
      name,
      gl.getUniformLocation(program, name)
    ])
  )

  applyColor = (value) => {
    const [a, b, c] = palette(value)
    gl.uniform3fv(uniforms.u_colorA, a)
    gl.uniform3fv(uniforms.u_colorB, b)
    gl.uniform3fv(uniforms.u_colorC, c)
  }
  applyColor(props.color)

  // The aurora is soft, so it tolerates a modest resolution.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const resize = () => {
    const width = Math.max(1, Math.round(element.clientWidth * dpr))
    const height = Math.max(1, Math.round(element.clientHeight * dpr))
    if (gl.canvas.width === width && gl.canvas.height === height) return
    gl.canvas.width = width
    gl.canvas.height = height
    gl.viewport(0, 0, width, height)
    gl.uniform2f(uniforms.u_resolution, width, height)
  }

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
  const onPointerMove = (event) => {
    pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1
    pointer.targetY = -((event.clientY / window.innerHeight) * 2 - 1)
  }

  const start = performance.now()
  let last = start
  const render = (now) => {
    const delta = Math.min((now - last) / 1000, 0.1)
    last = now
    const ease = 1 - Math.exp(-2.5 * delta)
    pointer.x += (pointer.targetX - pointer.x) * ease
    pointer.y += (pointer.targetY - pointer.y) * ease
    gl.uniform2f(uniforms.u_pointer, pointer.x, pointer.y)
    gl.uniform1f(uniforms.u_time, reducedMotion ? 40 : (now - start) / 1000)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  let frame = 0
  let inView = true
  const tick = (now) => {
    frame = 0
    render(now)
    if (inView) frame = requestAnimationFrame(tick)
  }
  const startLoop = () => {
    if (reducedMotion || frame) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const stopLoop = () => {
    cancelAnimationFrame(frame)
    frame = 0
  }

  // With motion off the curtains hold still but still follow the picker.
  const renderOnce = () => render(performance.now())

  const viewObserver = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      if (inView) startLoop()
      else stopLoop()
    },
    { rootMargin: '120px' }
  )
  viewObserver.observe(element)

  const resizeObserver = new ResizeObserver(() => {
    resize()
    if (!frame) renderOnce()
  })
  resizeObserver.observe(element)

  const onContextLost = (event) => event.preventDefault()
  gl.canvas.addEventListener('webglcontextlost', onContextLost)

  resize()
  renderOnce()
  if (!reducedMotion) window.addEventListener('pointermove', onPointerMove, { passive: true })

  cleanup = () => {
    stopLoop()
    viewObserver.disconnect()
    resizeObserver.disconnect()
    window.removeEventListener('pointermove', onPointerMove)
    gl.canvas.removeEventListener('webglcontextlost', onContextLost)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    applyColor = undefined
  }

  watch(
    () => props.color,
    (value) => {
      applyColor?.(value)
      if (!frame) renderOnce()
    }
  )
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="host" class="animate-vuelor-fade pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <canvas ref="canvas" class="absolute inset-0 size-full"></canvas>
  </div>
</template>
