<template>
  <InnerPageLayout
    v-if="program"
    :breadcrumb="program.name"
    :title="program.name"
    :description="program.summary"
  >
    <section class="content-section">
      <div class="container">
        <div class="program-detail-hero">
          <div v-if="program.image" class="program-detail-media">
            <img :src="program.image" :alt="program.name" />
          </div>

          <div class="program-detail-side">
            <span class="program-detail-tag">{{ program.tag }}</span>
            <h2>{{ program.agency }}</h2>
            <p>{{ program.description }}</p>
            <a href="#contact" class="primary-action-link">კონსულტაციის მოთხოვნა</a>
          </div>
        </div>

        <div class="program-detail-grid">
          <article class="detail-card wide">
            <h3>ვინ უნდა დაინტერესდეს</h3>
            <p>{{ program.eligibility }}</p>
          </article>

          <article class="detail-card">
            <h3>ძირითადი სარგებელი</h3>
            <ul class="detail-list">
              <li v-for="benefit in program.benefits" :key="benefit">{{ benefit }}</li>
            </ul>
          </article>

          <article class="detail-card">
            <h3>როგორ იწყება პროცესი</h3>
            <p>{{ program.application }}</p>
          </article>
        </div>

        <div class="detail-bottom-nav">
          <a href="#programs" class="back-link">ყველა პროგრამაზე დაბრუნება</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else
    breadcrumb="პროგრამა ვერ მოიძებნა"
    title="პროგრამა ვერ მოიძებნა"
    description="მითითებული პროგრამის ჩანაწერი ამ mock ვერსიაში არ არსებობს."
  >
    <section class="content-section">
      <div class="container narrow-copy">
        <div class="rich-card">
          <h3>შეამოწმე ბმული</h3>
          <p>დეტალური გვერდი ვერ მოიძებნა. დაბრუნდი პროგრამების საერთო სიაში და აირჩიე ჩანაწერი თავიდან.</p>
          <a href="#programs" class="primary-action-link">პროგრამების გახსნა</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { findProgramBySlug } from '../../data/programs'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const program = computed(() => findProgramBySlug(props.slug))
</script>
