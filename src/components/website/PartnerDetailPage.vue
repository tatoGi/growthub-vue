<template>
  <InnerPageLayout
    :breadcrumb="partner ? partner.name : 'პარტნიორი'"
    :title="partner ? partner.name : 'პარტნიორი ვერ მოიძებნა'"
    :description="partner ? partner.description : 'მითითებული პარტნიორი ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="partner" class="project-story-layout">
          <article v-if="partner.photo" class="project-story-media">
            <img :src="partner.photo" :alt="partner.name" />
          </article>
          <article class="project-story-copy">
            <span class="eyebrow">Partner Profile</span>
            <h2>{{ partner.name }}</h2>
            <p>{{ partner.description }}</p>
            <p>{{ partner.text }}</p>
          </article>
        </div>

        <div v-if="partner" class="partner-gallery-grid">
          <article v-for="image in partner.gallery.filter(Boolean)" :key="image" class="rich-card">
            <img class="gallery-thumb" :src="image" :alt="partner.name" />
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { partners } from '../../data/partners'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const partner = computed(() => partners.find((item) => item.slug === props.slug))
</script>
