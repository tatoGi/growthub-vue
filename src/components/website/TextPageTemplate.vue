<template>
  <InnerPageLayout
    :breadcrumb="page ? page.title : 'ტექსტური გვერდი'"
    :title="page ? page.title : 'გვერდი ვერ მოიძებნა'"
    :description="page ? page.description : 'მითითებული გვერდი ამ დროისთვის ხელმისაწვდომი არ არის.'"
    :cover="page?.cover || ''"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="page" class="project-story-layout">
          <article class="project-story-copy">
            <span class="eyebrow">Text Page</span>
            <h2>{{ page.title }}</h2>
            <div class="text-page-html" v-html="page.body_html"></div>
          </article>
        </div>

        <div v-else class="empty-state-copy">
          <p>მითითებული გვერდი ამ დროისთვის ხელმისაწვდომი არ არის.</p>
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

const page = computed(() => {
  const item = pages[props.slug]
  return item?.kind === 'text_page' ? item : null
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
