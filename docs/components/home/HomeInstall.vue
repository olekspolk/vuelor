<script setup>
import ArrowUpRight from './ArrowUpRight.vue'
import CopyCommand from '../CopyCommand.vue'
import InstallTerminal from '../InstallTerminal.vue'
import SectionHeading from './SectionHeading.vue'
import SideLabel from './SideLabel.vue'

const commands = [
  'npm install @vuelor/picker',
  'npx shadcn-vue@latest add @vuelor/color-picker'
]
</script>

<template>
  <section class="relative bg-dots py-24 sm:py-36">
    <SideLabel>02 — Install</SideLabel>
    <div class="vuelor-container">
      <SectionHeading index="02">One command</SectionHeading>
      <p data-reveal class="mt-6 max-w-lg text-lg leading-relaxed text-ash">
        Every example on this site is a
        <a
          href="https://www.shadcn-vue.com/docs/registry"
          target="_blank"
          rel="noreferrer"
          class="font-semibold text-bone underline decoration-ember decoration-2 underline-offset-4 transition-colors hover:text-ember"
          >shadcn-vue registry</a
        >
        item. Register the <code class="font-mono text-base text-bone">@vuelor</code> registry once,
        then drop a complete, editable picker straight into your project.
      </p>

      <div class="mt-14 grid items-start gap-10 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
        <div data-reveal class="rounded-2xl border border-line bg-ink-raised/70 p-4 sm:p-6">
          <p class="font-display text-[0.65rem] font-bold tracking-[0.3em] text-ash uppercase">Install</p>
          <div class="mt-3 space-y-1">
            <CopyCommand v-for="command in commands" :key="command" :command="command" class="rounded-lg" />
          </div>
          <a
            href="/guide/cli"
            class="group mt-6 inline-flex w-fit items-center gap-2 font-display text-sm font-bold tracking-[0.04em] text-bone uppercase transition-colors hover:text-ember"
          >
            Read the CLI guide
            <ArrowUpRight
              class="size-2.5 text-ember transition-transform duration-300 ease-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        <div data-reveal>
          <InstallTerminal />
        </div>
      </div>
    </div>
  </section>
</template>
