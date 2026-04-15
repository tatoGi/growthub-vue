<template>
  <InnerPageLayout
    v-if="loading"
    breadcrumb="პროგრამები"
    title=""
    description=""
  >
    <section class="content-section">
      <div class="container">
        <p class="page-loading">იტვირთება...</p>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else-if="program"
    :breadcrumb="program.title || program.name"
    :title="program.title || program.name"
    :description="program.description || program.summary || ''"
    :cover="program.cover || program.image || ''"
  >
    <section class="content-section">
      <div class="container">
        <div class="program-detail-hero">
          <div v-if="program.cover || program.image" class="program-detail-media">
            <img :src="program.cover || program.image" :alt="program.title || program.name" />
          </div>

          <div class="program-detail-side">
            <span v-if="program.tag" class="program-detail-tag">{{ program.tag }}</span>
            <h2 v-if="program.agency">{{ program.agency }}</h2>
            <p>{{ program.description || program.summary }}</p>
            <a href="#contact" class="primary-action-link">კონსულტაციის მოთხოვნა</a>
          </div>
        </div>

        <div v-if="program.body_html" class="program-detail-grid">
          <article class="detail-card wide">
            <div class="rich-text" v-html="program.body_html" />
          </article>
        </div>

        <div v-else class="program-detail-grid">
          <article v-if="program.eligibility" class="detail-card wide">
            <h3>ვინ უნდა დაინტერესდეს</h3>
            <p>{{ program.eligibility }}</p>
          </article>

          <article v-if="program.benefits?.length" class="detail-card">
            <h3>ძირითადი სარგებელი</h3>
            <ul class="detail-list">
              <li v-for="benefit in program.benefits" :key="benefit">{{ benefit }}</li>
            </ul>
          </article>

          <article v-if="program.application" class="detail-card">
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
    description="მითითებული პროგრამა ვერ მოიძებნა."
  >
    <section class="content-section">
      <div class="container narrow-copy">
        <div class="rich-card">
          <h3>შეამოწმე ბმული</h3>
          <p>დეტალური გვერდი ვერ მოიძებნა. დაბრუნდი პროგრამების საერთო სიაში.</p>
          <a href="#programs" class="primary-action-link">პროგრამების გახსნა</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const program = ref(null)
const loading = ref(false)

async function loadProgram(slug) {
  if (!slug) return
  loading.value = true
  program.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    program.value = {
      title: 'Mock Program',
      tag: 'სტატიკური',
      summary: 'აღწერა დროებითია, რადგან სისტემა ლოკალურ mock mode-ზეა გადასული.',
      benefits: ['Mock benefit 1', 'Mock benefit 2'],
      eligibility: 'ვისაც აინტერესებს mock data.'
    }
  } catch {
    program.value = null
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, loadProgram, { immediate: true })
</script>
