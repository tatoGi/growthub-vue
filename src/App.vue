<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import WebsiteHome from './components/website/WebsiteHome.vue'
import ProgramsPage from './components/website/ProgramsPage.vue'
import EventsPage from './components/website/EventsPage.vue'
import AnimationsPage from './components/website/AnimationsPage.vue'
import ContactPage from './components/website/ContactPage.vue'

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
  <WebsiteHome v-if="currentPath === '#/' || currentPath === ''" />
  <ProgramsPage v-else-if="currentPath === '#programs'" />
  <EventsPage v-else-if="currentPath === '#events'" />
  <AnimationsPage v-else-if="currentPath === '#animations'" />
  <ContactPage v-else-if="currentPath === '#contact'" />
  <WebsiteHome v-else />
</template>
