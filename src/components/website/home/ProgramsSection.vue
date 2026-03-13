<script setup>
import { programs } from '../../../data/programs'
</script>

<template>
  <section class="programs-section">
    <div class="container">
      <div class="section-head">
        <div class="title-group">
          <span class="top-tag">აქტიური შესაძლებლობები</span>
          <h2>მიმდინარე პროგრამები</h2>
          <p class="subtitle">სახელმწიფოს მხარდაჭერით შენი ბიზნესის ზრდისთვის</p>
        </div>
        <a href="#programs" class="view-all">ყველას ნახვა <span class="arrow">→</span></a>
      </div>

      <div class="grid">
        <article v-for="program in programs" :key="program.id" class="program-card">
          <div class="card-image-wrapper">
            <div class="card-image">
              <img :src="program.image" :alt="program.name" loading="lazy" />
              <div class="image-overlay"></div>
            </div>
            <div class="card-tag">{{ program.tag }}</div>
          </div>
          <div class="card-content">
            <h3>{{ program.name }}</h3>
            <p>{{ program.summary }}</p>
            <div class="card-footer">
              <a :href="`#programs/${program.slug}`" class="read-more">
                გაიგე მეტი
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
