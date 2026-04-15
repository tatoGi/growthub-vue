<template>
  <InnerPageLayout
    v-if="loading"
    breadcrumb="ვიდეო ანიმაციები"
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
    v-else-if="video"
    :breadcrumb="video.title"
    :title="video.title"
    :description="video.description || ''"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="video-detail-shell">
          <div v-if="video.embed_url || video.embedUrl" class="video-player-card">
            <iframe
              :src="video.embed_url || video.embedUrl"
              :title="video.title"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>

          <div class="video-detail-aside">
            <article class="detail-card">
              <span v-if="video.category" class="program-detail-tag">{{ video.category }}</span>
              <h3>ვიდეოს შესახებ</h3>
              <p>{{ video.description }}</p>
            </article>

            <article v-if="video.highlights?.length" class="detail-card">
              <h3>მთავარი თემები</h3>
              <ul class="detail-list">
                <li v-for="point in video.highlights" :key="point">{{ point }}</li>
              </ul>
            </article>

            <article class="detail-card">
              <h3>ინფორმაცია</h3>
              <div class="meta-stack">
                <div v-if="video.duration" class="meta-row">
                  <span>ხანგრძლივობა</span>
                  <strong>{{ video.duration }}</strong>
                </div>
                <div v-if="video.category" class="meta-row">
                  <span>კატეგორია</span>
                  <strong>{{ video.category }}</strong>
                </div>
              </div>
              <a href="#animations" class="back-link">ყველა ვიდეო</a>
            </article>
          </div>
        </div>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else
    breadcrumb="ვიდეო ვერ მოიძებნა"
    title="ვიდეო ვერ მოიძებნა"
    description=""
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="empty-state-card">
          <h3>ვიდეო ვერ მოიძებნა</h3>
          <p>შესაძლოა ბმული შეიცვალა ან ვიდეო ჯერ არ არის დამატებული.</p>
          <a href="#animations" class="back-link">გალერეაში დაბრუნება</a>
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

const video = ref(null)
const loading = ref(false)

async function loadVideo(slug) {
  if (!slug) return
  loading.value = true
  video.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    video.value = {
      title: 'Mock Video',
      description: 'ეს ვიდეო დროებით ლოკალურ რეჟიმშია.',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      category: 'Mock Category',
      duration: '02:30',
      highlights: ['Point 1', 'Point 2']
    }
  } catch {
    video.value = null
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, loadVideo, { immediate: true })
</script>
