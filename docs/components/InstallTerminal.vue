<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const COMMAND = 'npx shadcn-vue@latest add @vuelor/color-picker'

// Sequential install output, mirroring the real CLI.
const STEPS = [
  { text: 'Checking registry.', after: 650 },
  { text: 'Updating CSS variables in src/assets/index.css', after: 600 },
  { text: 'Installing dependencies.', note: 'added 23 packages', after: 1100 },
  { text: 'Created 1 file:', file: 'src/components/color-picker/ColorPicker.vue', after: 500 }
]

const typed = ref('')
const typing = ref(true)
const lines = ref([])
const done = ref(false)

let active = true
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function run() {
  while (active) {
    typed.value = ''
    typing.value = true
    lines.value = []
    done.value = false
    await delay(700)
    if (!active) return

    for (const char of COMMAND) {
      if (!active) return
      typed.value += char
      await delay(40 + Math.random() * 45)
    }
    typing.value = false
    await delay(550)
    if (!active) return

    for (const step of STEPS) {
      if (!active) return
      lines.value = [...lines.value, step]
      await delay(step.after)
    }
    done.value = true
    await delay(4200)
  }
}

onMounted(() => {
  active = true
  run()
})
onUnmounted(() => {
  active = false
})
</script>

<template>
  <div class="vuelor-term" role="img" aria-label="Terminal running: npx shadcn-vue add @vuelor/color-picker">
    <div class="vuelor-term__bar" aria-hidden="true">
      <span class="vuelor-term__dot vuelor-term__dot--red"></span>
      <span class="vuelor-term__dot vuelor-term__dot--amber"></span>
      <span class="vuelor-term__dot vuelor-term__dot--green"></span>
      <span class="vuelor-term__title">bash — ~/my-app</span>
    </div>

    <div class="vuelor-term__body" aria-hidden="true">
      <div class="vuelor-term__cmd">
        <span class="vuelor-term__prompt">❯</span>
        <span>{{ typed }}</span><span v-if="typing" class="vuelor-term__caret"></span>
      </div>

      <div v-for="(line, i) in lines" :key="i" class="vuelor-term__row">
        <div class="vuelor-term__out">
          <span class="vuelor-term__check">✔</span>
          <span>{{ line.text }}</span>
          <span v-if="line.note" class="vuelor-term__note">{{ line.note }}</span>
        </div>
        <div v-if="line.file" class="vuelor-term__file">- {{ line.file }}</div>
      </div>

      <div v-if="done" class="vuelor-term__done">
        Done. You own the code — edit it however you like.
      </div>
    </div>
  </div>
</template>

<style scoped>
.vuelor-term {
  max-width: 640px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  background: #0d1117;
  border: 1px solid #30363d;
  box-shadow: 0 16px 40px -12px rgba(0, 0, 0, 0.45);
  font-family: var(--vp-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  text-align: left;
}

.vuelor-term__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}
.vuelor-term__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.vuelor-term__dot--red { background: #ff5f56; }
.vuelor-term__dot--amber { background: #ffbd2e; }
.vuelor-term__dot--green { background: #27c93f; }
.vuelor-term__title {
  margin-left: 8px;
  font-size: 12px;
  color: #768390;
}

.vuelor-term__body {
  padding: 18px 20px;
  min-height: 210px;
  font-size: 13.5px;
  line-height: 1.85;
  color: #adbac7;
}
.vuelor-term__cmd { color: #e6edf3; white-space: pre-wrap; word-break: break-all; }
.vuelor-term__prompt { color: #2f81f7; margin-right: 8px; font-weight: 600; }
.vuelor-term__caret {
  display: inline-block;
  width: 8px;
  height: 1.05em;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: #e6edf3;
  animation: vuelor-blink 1s steps(1) infinite;
}
@keyframes vuelor-blink { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }

.vuelor-term__row { animation: vuelor-rise 0.28s ease both; }
@keyframes vuelor-rise { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
.vuelor-term__out { display: flex; align-items: baseline; gap: 8px; }
.vuelor-term__check { color: #3fb950; }
.vuelor-term__note { color: #636e7b; }
.vuelor-term__file { color: #768390; padding-left: 22px; }

.vuelor-term__done {
  margin-top: 10px;
  color: #3fb950;
  animation: vuelor-rise 0.28s ease both;
}

@media (max-width: 640px) {
  .vuelor-term__body { font-size: 12px; min-height: 200px; }
}
@media (prefers-reduced-motion: reduce) {
  .vuelor-term__caret, .vuelor-term__row, .vuelor-term__done { animation: none; }
}
</style>
