<template>
  <section class="history-section">
    <div class="bg-pattern"></div>
    <div class="container">
      <div class="content">
        <div class="history-label fade-in-up">{{ about.label }}</div>
        <h2 class="fade-in-up">{{ about.title }}</h2>
        <p class="fade-in-up">{{ about.body }}</p>
        <div class="stats fade-in-up">
          <div v-for="stat in about.stats" :key="stat.label" class="stat-item">
            <span class="stat-number">{{ stat.number }}</span>
            <span class="stat-text">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="image-box fade-in-up">
        <img src="/assets/images/unsplash.png" alt="აწარმოე საქართველოში" class="main-img" />
        <div class="experience-card">
          <span class="exp-years">10+</span>
          <span class="exp-text">წლის გამოცდილება</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useHome } from '../../../composables/useHome'

const { about } = useHome()
</script>
