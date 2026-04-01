<template>
  <InnerPageLayout
    :breadcrumb="page?.title || 'ვიდეო ანიმაციები'"
    :title="page?.title || ''"
    :description="page?.description || ''"
    :cover="page?.cover || ''"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="loading" class="page-loading">იტვირთება...</div>
        <div v-else class="video-gallery-grid">
          <article v-for="video in items" :key="video.id" class="video-card video-card-modern">
            <a v-if="video.thumb || video.cover" :href="`#${slug}/${video.slug}`" class="video-preview-wrapper">
              <img :src="video.thumb || video.cover" :alt="video.title" />
              <div class="play-overlay">
                <div class="play-button">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </a>
            <div class="video-info">
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
              <a :href="`#${slug}/${video.slug}`" class="feature-link">დეტალურად</a>
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
    default: 'animations',
  },
})

const { page, loading, load } = usePage()

onMounted(() => load(props.slug))

const items = computed(() => page.value?.items ?? [])
</script>
