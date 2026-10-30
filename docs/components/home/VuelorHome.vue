<script setup>
import { onMounted, onUnmounted } from 'vue'
import HomeHero from './HomeHero.vue'
import HomeFeatures from './HomeFeatures.vue'
import HomeInstall from './HomeInstall.vue'
import HomeStart from './HomeStart.vue'

const STAGGER = 70
const MAX_STAGGERED = 6

let observer

/**
 * Fades and lifts every [data-reveal] block the first time it scrolls into view.
 * Blocks are hidden from here rather than in the markup, so without JavaScript
 * or with reduced motion they just show.
 */
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.documentElement.classList.add('vuelor-reveal')

  observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          const block = entry.target
          block.style.setProperty('--reveal-delay', `${Math.min(index, MAX_STAGGERED) * STAGGER}ms`)
          block.setAttribute('data-revealed', '')
          observer.unobserve(block)
        })
    },
    { rootMargin: '0px 0px -8% 0px' }
  )
  document.querySelectorAll('[data-reveal]').forEach((block) => observer.observe(block))
})

onUnmounted(() => {
  observer?.disconnect()
  document.documentElement.classList.remove('vuelor-reveal')
})
</script>

<template>
  <div class="vuelor-home font-sans text-bone">
    <HomeHero />
    <HomeFeatures />
    <HomeInstall />
    <HomeStart />
  </div>
</template>
