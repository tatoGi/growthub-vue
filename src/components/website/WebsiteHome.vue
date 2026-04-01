<template>
  <div class="site-shell">
    <WebsiteHeader />
    <main class="main-content">
      <HeroSearch />
      <ProgramsSection />
      <InfoSection />
    </main>
    <WebsiteFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HeroSearch from './home/HeroSearch.vue'
import InfoSection from './home/InfoSection.vue'
import ProgramsSection from './home/ProgramsSection.vue'
import WebsiteFooter from './home/WebsiteFooter.vue'
import WebsiteHeader from './home/WebsiteHeader.vue'
import { useHome } from '../../composables/useHome'

const { loadHome } = useHome()

onMounted(() => {
  loadHome()
})
</script>


