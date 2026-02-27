<template>
  <div class="site-shell">
    <WebsiteHeader />
    <main class="main-content">
      <HeroSearch />
      <ProgramsSection />
      <AboutSection />
      <InfoSection />
    </main>
    <WebsiteFooter />
  </div>
</template>

<script setup>
import HeroSearch from './home/HeroSearch.vue'
import InfoSection from './home/InfoSection.vue'
import ProgramsSection from './home/ProgramsSection.vue'
import AboutSection from './home/AboutSection.vue'
import WebsiteFooter from './home/WebsiteFooter.vue'
import WebsiteHeader from './home/WebsiteHeader.vue'
</script>


