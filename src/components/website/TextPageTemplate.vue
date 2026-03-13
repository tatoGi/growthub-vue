<template>
  <InnerPageLayout
    :breadcrumb="page ? page.title : 'ტექსტური გვერდი'"
    :title="page ? page.title : 'გვერდი ვერ მოიძებნა'"
    :description="page ? page.summary : 'მითითებული გვერდი ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="page" class="project-story-layout">
          <article class="project-story-media">
            <img :src="page.cover" :alt="page.title" />
          </article>
          <article class="project-story-copy">
            <span class="eyebrow">Text Page</span>
            <h2>{{ page.title }}</h2>
            <p v-for="paragraph in page.body" :key="paragraph">{{ paragraph }}</p>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { textPages } from '../../data/pages'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const page = computed(() => textPages.find((item) => item.slug === props.slug))
</script>
