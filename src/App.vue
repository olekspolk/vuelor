<script lang="ts" setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'

const color = ref<string>('#ff0000ff')
provide('color', color)

const menuItems = [
  { name: 'Mini', path: '/mini' },
  { name: 'Regular', path: '/' },
  { name: 'Pro', path: '/pro' },
  { name: 'Max', path: '/max' },
]

const route = useRoute()
</script>

<template>
  <div>
    <header class="p-4 flex gap-6 items-center justify-center border-b border-neutral-300">
      <router-link v-for="item in menuItems" class="hover:text-green-800" :class="{ 'text-green-800': route.path === item.path }" :to="item.path">{{ item.name }}</router-link>
    </header>
    <div class="h-[calc(100vh-57px)] flex flex-col gap-8 items-center justify-center">
      <div
        :style="{
          background: [
            `linear-gradient(to bottom, ${color} 0%, ${color} 100%)`,
            'repeating-conic-gradient(#ddd 0% 25%, transparent 0% 50%) 50% / 8px 8px'
          ].join(',')
        }"
        class="h-12 w-12 rounded-xl shadow"
      />
      <router-view />
    </div>
  </div>
</template>
