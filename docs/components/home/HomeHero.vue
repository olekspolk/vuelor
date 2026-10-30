<script setup>
import { ref, onMounted, watch } from 'vue'
import ColorPicker from '../examples/ColorPickerWithGradient.vue'
import HeroAurora from './HeroAurora.vue'
import PillLink from './PillLink.vue'

// Seeded with ember so the first paint glows on-brand; after that the visitor drives it.
const color = ref('#EE3C4BFF')

onMounted(() => {
  color.value = document.documentElement.style.getPropertyValue('--vuelor-selected-value') || '#EE3C4BFF'
})

// The picked value feeds the glow behind the picker (and anything else reading the var).
watch(color, (value) => {
  document.documentElement.style.setProperty('--vuelor-selected-value', value)
})
</script>

<template>
  <!-- Pulled up under the transparent header, so the aurora runs to the top edge. -->
  <section class="relative mt-[calc(-1*var(--vp-nav-height,64px))] overflow-hidden bg-dots">
    <HeroAurora :color="color" />
    <div
      class="vuelor-container relative grid min-h-[max(46rem,100svh)] items-center gap-14 pt-[calc(var(--vp-nav-height,64px)+2rem)] pb-16 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:gap-12"
    >
      <div class="animate-vuelor-rise" style="animation-delay: 150ms">
        <p class="font-display text-[0.7rem] font-bold tracking-[0.3em] text-ash uppercase sm:text-xs">
          Vue 3 · Reka UI · Tailwind
        </p>
        <h1
          class="mt-5 font-display text-[clamp(2.3rem,8vw,3.4rem)] leading-[1.02] font-extrabold tracking-[0.01em] text-balance text-bone lg:text-[clamp(2.8rem,4.3vw,4rem)]"
        >
          The <span class="text-ember">composable</span> color&nbsp;picker for Vue&nbsp;3
        </h1>
        <p
          class="mt-6 max-w-[38ch] font-display text-[clamp(1.05rem,1.8vw,1.5rem)] leading-[1.3] font-bold text-balance text-ash"
        >
          Build exactly the picker your design needs — no overrides, no fighting the defaults.
        </p>
        <div class="mt-9 flex flex-wrap gap-2.5 sm:gap-3">
          <PillLink href="/guide/getting-started">Get started</PillLink>
          <PillLink href="/examples/" variant="outline">View examples</PillLink>
        </div>
      </div>

      <div
        class="relative flex items-center justify-center animate-vuelor-rise lg:justify-end lg:pr-6"
        style="animation-delay: 300ms"
      >
        <div data-vuelor-docs class="relative">
          <ColorPicker v-model="color" format="hexa" />
        </div>
      </div>
    </div>
  </section>
</template>
