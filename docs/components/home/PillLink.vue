<script setup>
import ArrowUpRight from './ArrowUpRight.vue'

defineProps({
  href: { type: String, required: true },
  variant: { type: String, default: 'solid' }, // 'solid' | 'outline'
  external: { type: Boolean, default: false }
})
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noreferrer' : undefined"
    class="group inline-flex items-center gap-2 rounded-full px-4 py-3.5 font-display text-xs font-bold tracking-[0.1em] text-bone uppercase transition sm:gap-2.5 sm:px-6 sm:tracking-[0.14em]"
    :class="variant === 'solid'
      ? 'bg-ember hover:bg-[#ff4a59] active:scale-[0.98]'
      : 'border border-white/15 hover:border-ember'"
  >
    <slot />
    <ArrowUpRight
      class="size-2.5 transition-transform duration-300 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      :class="variant === 'solid' ? 'text-bone' : 'text-ember'"
    />
  </a>
</template>
