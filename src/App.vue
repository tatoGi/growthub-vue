<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WebsiteHome from './components/website/WebsiteHome.vue'
import ProgramsPage from './components/website/ProgramsPage.vue'

const currentPath = ref(window.location.hash)

const updatePath = () => {
  currentPath.value = window.location.hash
}

onMounted(() => {
  window.addEventListener('hashchange', updatePath)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updatePath)
})
</script>

<template>
  <component :is="currentPath === '#programs' ? ProgramsPage : WebsiteHome" />
</template>
