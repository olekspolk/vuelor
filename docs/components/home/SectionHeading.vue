<script setup>
defineProps({
  index: { type: String, required: true }
})
</script>

<template>
  <h2
    data-reveal
    class="flex items-start gap-4 font-display text-[clamp(2.25rem,9vw,3rem)] leading-[0.92] font-extrabold tracking-[0.04em] text-ember sm:text-[clamp(3rem,7vw,5.75rem)]"
  >
    <slot />
    <span class="mt-[0.5em] text-xs font-bold tracking-[0.3em] text-ash">{{ index }}</span>
  </h2>
</template>
