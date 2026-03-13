<template>
  <InnerPageLayout
    :breadcrumb="video ? video.title : 'ვიდეო დეტალი'"
    :title="video ? video.title : 'ვიდეო ვერ მოიძებნა'"
    :description="video ? video.description : 'მითითებული ვიდეო ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="video" class="video-detail-shell">
          <div class="video-player-card">
            <iframe
              :src="video.embedUrl"
              :title="video.title"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>

          <div class="video-detail-aside">
            <article class="detail-card">
              <span class="program-detail-tag">{{ video.category }}</span>
              <h3>ვიდეოს შესახებ</h3>
              <p>{{ video.description }}</p>
            </article>

            <article class="detail-card">
              <h3>მთავარი თემები</h3>
              <ul class="detail-list">
                <li v-for="point in video.highlights" :key="point">{{ point }}</li>
              </ul>
            </article>

            <article class="detail-card">
              <h3>ინფორმაცია</h3>
              <div class="meta-stack">
                <div class="meta-row">
                  <span>ხანგრძლივობა</span>
                  <strong>{{ video.duration }}</strong>
                </div>
                <div class="meta-row">
                  <span>კატეგორია</span>
                  <strong>{{ video.category }}</strong>
                </div>
                <div class="meta-row">
                  <span>განახლება</span>
                  <strong>{{ formattedDate }}</strong>
                </div>
              </div>
              <a href="#animations" class="back-link">ყველა ვიდეო</a>
            </article>
          </div>
        </div>

        <div v-else class="empty-state-card">
          <h3>ვიდეო ვერ მოიძებნა</h3>
          <p>შესაძლოა ბმული შეიცვალა ან ვიდეო ჯერ არ არის დამატებული.</p>
          <a href="#animations" class="back-link">გალერეაში დაბრუნება</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { videos } from '../../data/videos'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const video = computed(() => videos.find((item) => item.slug === props.slug))

const formattedDate = computed(() => {
  if (!video.value?.date) {
    return ''
  }

  return new Date(video.value.date).toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
