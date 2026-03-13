<template>
  <InnerPageLayout
    breadcrumb="ვიდეო გალერეა"
    title="ვიდეო გალერეა"
    description="Laravel-ის video-gallery-ის იდეაზე აწყობილი უფრო თანამედროვე გვერდი, სადაც მომხმარებელი ჯერ თემებს ხედავს და შემდეგ შედის დეტალურ ვიდეო გვერდზე."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="video-gallery-hero">
          <article class="video-gallery-copy">
            <span class="eyebrow">Video Gallery</span>
            <h2>მოკლე ვიზუალური გზამკვლევები ბიზნესის სხვადასხვა ეტაპისთვის</h2>
            <p>
              აქ ვკრებთ თემატურ ვიდეოებს, რომლებიც Laravel-ის ძველი `video-gallery` ბლოკის ფუნქციას ინარჩუნებს,
              მაგრამ უკვე უფრო მკაფიო hierarchy-ით, კატეგორიებით და დეტალურ page flow-ით.
            </p>
            <div class="pill-list">
              <span v-for="category in categories" :key="category" class="pill-item">{{ category }}</span>
            </div>
          </article>

          <article class="video-gallery-featured">
            <img :src="featuredVideo.thumbnail" :alt="featuredVideo.title" />
            <div class="video-gallery-featured-overlay">
              <span>{{ featuredVideo.category }}</span>
              <strong>{{ featuredVideo.title }}</strong>
              <p>{{ featuredVideo.description }}</p>
              <a :href="`#animations/${featuredVideo.slug}`" class="primary-action-link">ვიდეოს ნახვა</a>
            </div>
          </article>
        </div>

        <div class="video-gallery-stats">
          <article class="stat-box">
            <strong>{{ videos.length }}</strong>
            <span>აქტიური ვიდეო</span>
          </article>
          <article class="stat-box">
            <strong>{{ categories.length }}</strong>
            <span>თემატური კატეგორია</span>
          </article>
          <article class="stat-box">
            <strong>{{ totalDuration }}</strong>
            <span>ჯამური ხანგრძლივობა</span>
          </article>
        </div>

        <div class="video-gallery-grid">
          <article v-for="video in videos" :key="video.id" class="video-card video-card-modern">
            <a :href="`#animations/${video.slug}`" class="video-preview-wrapper">
              <img :src="video.thumbnail" :alt="video.title" />
              <div class="play-overlay">
                <div class="play-button">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <span class="video-duration-chip">{{ video.duration }}</span>
            </a>

            <div class="video-info">
              <div class="video-card-meta">
                <span>{{ video.category }}</span>
                <span>{{ formatDate(video.date) }}</span>
              </div>
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
              <a :href="`#animations/${video.slug}`" class="feature-link">დეტალურად</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { videos } from '../../data/videos'

const featuredVideo = videos[0]

const categories = computed(() => [...new Set(videos.map((video) => video.category))])

const totalDuration = computed(() => {
  const totalMinutes = videos.reduce((sum, video) => {
    const [minutes, seconds] = video.duration.split(':').map(Number)
    return sum + minutes + (seconds >= 30 ? 1 : 0)
  }, 0)

  return `${totalMinutes} წთ`
})

const formatDate = (value) =>
  new Date(value).toLocaleDateString('ka-GE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
</script>
