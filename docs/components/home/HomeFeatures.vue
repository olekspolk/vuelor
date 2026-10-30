<script setup>
import ArrowUpRight from './ArrowUpRight.vue'
import SectionHeading from './SectionHeading.vue'
import SideLabel from './SideLabel.vue'

const features = [
  {
    title: 'Composable building blocks',
    details:
      'Instead of one rigid drop-in, you get focused primitives — Canvas, Sliders, Inputs, Swatches — that you compose yourself. Use only what you need.',
    link: '/guide/getting-started',
    linkText: 'Get started'
  },
  {
    title: 'Tailwind-native, CSS-optional',
    details:
      'Every slot ships with Tailwind classes out of the box. Prefer plain CSS? Switch to vanillacss mode. Want full control? Go unstyled and bring your own classes.',
    link: '/guide/customization',
    linkText: 'Customization guide'
  },
  {
    title: 'Accessible out of the box',
    details:
      'Keyboard navigation, ARIA attributes, and focus management are built in from the start — following the WAI-ARIA color picker pattern so you don’t have to think about it.',
    link: '/guide/api-reference',
    linkText: 'API reference'
  },
  {
    title: 'Flexible output formats',
    details:
      'Emit color as hexa, rgb, hsl, hsv, or a plain object with every representation at once. The alpha channel comes along automatically when the format supports it.',
    link: '/guide/api-reference#format',
    linkText: 'Format table'
  },
  {
    title: 'Gradient editor included',
    details:
      '@vuelor/gradient builds on the same primitives: linear, radial, and conic gradients with draggable stops, angle control, and CSS output ready to paste.',
    link: '/gradient/',
    linkText: 'Gradient overview'
  },
  {
    title: 'Install with the shadcn-vue CLI',
    details:
      'Copy a complete, editable picker into your project with one shadcn-vue add command — you own the source, no black-box dependency.',
    link: '/guide/cli',
    linkText: 'CLI guide'
  }
]
</script>

<template>
  <section class="relative bg-dots py-24 sm:py-36">
    <SideLabel>01 — Why Vuelor</SideLabel>
    <div class="vuelor-container">
      <SectionHeading index="01">Why Vuelor</SectionHeading>
      <p data-reveal class="mt-6 max-w-lg text-lg leading-relaxed text-ash">
        Focused primitives with accessibility and Tailwind built in — everything you need to ship a
        picker that looks like your product, not like a library.
      </p>

      <ul class="mt-14 grid gap-4 sm:mt-20 sm:grid-cols-2 sm:gap-5">
        <li
          v-for="(feature, i) in features"
          :key="feature.title"
          data-reveal
          class="flex flex-col rounded-2xl border border-line bg-ink-raised/70 p-6 sm:p-8"
        >
          <p class="font-display text-xs font-bold tracking-[0.1em] text-ember">
            {{ String(i + 1).padStart(2, '0') }}
          </p>
          <h3 class="mt-4 font-display text-xl leading-tight font-extrabold tracking-[0.01em] text-bone sm:text-2xl">
            {{ feature.title }}
          </h3>
          <p class="mt-3 flex-1 leading-relaxed text-ash">{{ feature.details }}</p>
          <a
            :href="feature.link"
            class="group mt-6 inline-flex w-fit items-center gap-2 font-display text-sm font-bold tracking-[0.04em] text-bone uppercase transition-colors hover:text-ember"
          >
            {{ feature.linkText }}
            <ArrowUpRight
              class="size-2.5 text-ember transition-transform duration-300 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
