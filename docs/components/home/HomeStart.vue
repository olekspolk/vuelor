<script setup>
import PillLink from './PillLink.vue'
import SectionHeading from './SectionHeading.vue'
import SideLabel from './SideLabel.vue'
</script>

<template>
  <section class="relative bg-dots py-24 sm:py-36">
    <SideLabel>03 — Start</SideLabel>
    <div class="vuelor-container">
      <div class="border-t border-line pt-14 sm:pt-20">
        <SectionHeading index="03">Start building</SectionHeading>
        <p data-reveal class="mt-6 max-w-lg text-lg leading-relaxed text-ash">
          Install the package, or copy a finished picker with the CLI — either way you own the code
          and it's MIT licensed.
        </p>
        <div data-reveal class="mt-10 flex flex-wrap gap-2.5 sm:gap-3">
          <PillLink href="/guide/getting-started">Get started</PillLink>
          <PillLink href="https://github.com/olekspolk/vuelor" variant="outline" external>GitHub</PillLink>
        </div>
      </div>
    </div>
  </section>
</template>
