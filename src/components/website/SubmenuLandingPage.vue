<template>
  <InnerPageLayout
    :breadcrumb="section ? section.title : 'სექცია'"
    :title="section ? section.title : 'სექცია ვერ მოიძებნა'"
    :description="section ? section.description : 'მითითებული სექცია ამ დროისთვის ხელმისაწვდომი არ არის.'"
    :cover="section?.cover || ''"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="section" class="feature-grid three-up">
          <a v-for="child in section.children" :key="child.slug || child.id" :href="child.link" class="feature-card feature-card-link">
            <div class="feature-icon">→</div>
            <h3>{{ child.title }}</h3>
            <p>{{ child.description }}</p>
            <span class="feature-link">გადასვლა</span>
          </a>
        </div>

        <div v-else class="empty-state-copy">
          <p>მითითებული სექცია ამ დროისთვის ხელმისაწვდომი არ არის.</p>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useSectionPage } from '../../composables/useSectionPage'
import InnerPageLayout from './shared/InnerPageLayout.vue'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const { pages, loadSectionPage } = useSectionPage()

const section = computed(() => {
  const item = pages[props.slug]
  return item?.kind === 'section' ? item : null
})

watch(
  () => props.slug,
  async (slug) => {
    if (!slug) {
      return
    }

    await loadSectionPage(slug)
  },
  { immediate: true },
)
</script>
