<template>
  <!-- Rotated label in the left gutter, marking the section. -->
  <p
    aria-hidden="true"
    class="absolute top-36 left-[calc(max(1.25rem,5.5vw)+1.85rem)] hidden -translate-x-1/2 rotate-180 font-display text-[0.7rem] font-extrabold tracking-[0.35em] text-bone/60 uppercase [writing-mode:vertical-rl] min-[1420px]:block"
  >
    <slot />
  </p>
</template>
