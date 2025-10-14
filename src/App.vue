<script lang="ts" setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'

const color = ref<string>('#ffffffff')
provide('color', color)

const menuItems = [
  { name: 'Regular', path: '/' },
  { name: 'Mini', path: '/mini' },
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
      <div :style="{ backgroundColor: color }" class="h-12 w-12 rounded-xl shadow" />
      <router-view />
    </div>
  </div>
</template>
