<script setup>
import { ref, onMounted } from 'vue'

const REPO = 'olekspolk/vuelor'
const CACHE_KEY = 'vuelor:gh-stars'
const TTL = 60 * 60 * 1000 // 1 hour — avoid hammering the unauthenticated API (60 req/hr/IP)

const stars = ref(null)

function format(n) {
  if (n < 1000) return String(n)
  const k = n / 1000
  return (k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')) + 'k'
}

onMounted(async () => {
  // Serve a fresh-enough cached value first.
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (cached && typeof cached.n === 'number' && Date.now() - cached.t < TTL) {
      stars.value = cached.n
      return
    }
  } catch {}

  // Otherwise fetch live; fail silently (button still works, just without a count).
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}`)
    if (!res.ok) return
    const data = await res.json()
    if (typeof data.stargazers_count === 'number') {
      stars.value = data.stargazers_count
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ n: stars.value, t: Date.now() }))
      } catch {}
    }
  } catch {}
})
</script>

<template>
  <a
    class="gh-star"
    :href="`https://github.com/${REPO}`"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Star Vuelor on GitHub"
  >
    <span class="gh-star__label">
      <svg class="gh-star__mark" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
      </svg>
      <span>Star</span>
    </span>

    <Transition name="gh-star-fade">
      <span v-if="stars !== null" class="gh-star__count" aria-hidden="true">
        <svg class="gh-star__icon" viewBox="0 0 16 16" width="14" height="14">
          <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
        </svg>
        <span class="gh-star__num">{{ format(stars) }}</span>
      </span>
    </Transition>
  </a>
</template>

<style scoped>
.gh-star {
  display: inline-flex;
  align-items: stretch;
  height: 32px;
  border: 1px solid var(--vp-c-border);
  border-radius: 16px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.25s, background-color 0.25s;
  /* space from the appearance toggle that precedes it in the nav */
  margin-left: 12px;
}
.gh-star:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.gh-star__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
}
.gh-star__mark {
  flex-shrink: 0;
}
.gh-star__count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0 12px;
  border-left: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}
.gh-star:hover .gh-star__count {
  border-color: var(--vp-c-brand-1);
}
.gh-star__icon {
  color: #e3b341;
  flex-shrink: 0;
}
.gh-star__num {
  font-variant-numeric: tabular-nums;
}

.gh-star-fade-enter-active {
  transition: opacity 0.4s ease;
}
.gh-star-fade-enter-from {
  opacity: 0;
}
</style>
