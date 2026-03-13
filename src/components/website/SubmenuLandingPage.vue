<template>
  <InnerPageLayout
    :breadcrumb="section ? section.title : 'სექცია'"
    :title="section ? section.title : 'სექცია ვერ მოიძებნა'"
    :description="section ? section.summary : 'მითითებული სექცია ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="section" class="feature-grid three-up">
          <a v-for="child in section.children" :key="child.title" :href="child.link" class="feature-card feature-card-link">
            <div class="feature-icon">→</div>
            <h3>{{ child.title }}</h3>
            <p>{{ child.description }}</p>
            <span class="feature-link">გადასვლა</span>
          </a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { submenuSections } from '../../data/pages'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const section = computed(() => submenuSections.find((item) => item.slug === props.slug))
</script>
