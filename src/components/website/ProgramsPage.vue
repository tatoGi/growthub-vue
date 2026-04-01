<template>
  <InnerPageLayout
    :breadcrumb="page?.title || 'მიმდინარე პროგრამები'"
    :title="page?.title || ''"
    :description="page?.description || ''"
    :cover="page?.cover || ''"
  >
    <section class="programs-grid-section">
      <div class="container">
        <div v-if="loading" class="page-loading">იტვირთება...</div>
        <div v-else class="grid">
          <article v-for="program in items" :key="program.id" class="program-card">
            <div v-if="program.thumb || program.cover" class="card-image-wrapper">
              <div class="card-image">
                <img :src="program.thumb || program.cover" :alt="program.title" loading="lazy" />
                <div class="image-overlay"></div>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ program.title }}</h3>
              <p class="agency-name">{{ program.description }}</p>
              <div class="card-footer">
                <a :href="`#${slug}/${program.slug}`" class="read-more">
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
import { computed, onMounted } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { usePage } from '../../composables/usePage'

const props = defineProps({
  slug: {
    type: String,
    default: 'programs',
  },
})

const { page, loading, load } = usePage()

onMounted(() => load(props.slug))

const items = computed(() => page.value?.items ?? [])
</script>
