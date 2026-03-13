<template>
  <InnerPageLayout
    breadcrumb="მიმდინარე პროგრამები"
    title="მიმდინარე პროგრამები"
    description="სახელმწიფოს მხარდაჭერით მიმდინარე პროგრამები და შესაძლებლობები, რომელთა გაცნობაც შეგიძლია ერთიან სიაში."
  >
    <section class="programs-grid-section">
      <div class="container">
        <div class="grid">
          <article v-for="program in programs" :key="program.id" class="program-card">
            <div class="card-image-wrapper">
              <div class="card-image">
                <img :src="program.image" :alt="program.name" loading="lazy" />
                <div class="image-overlay"></div>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ program.name }}</h3>
              <p class="agency-name">{{ program.agency }}</p>
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
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { programs } from '../../data/programs'
</script>
