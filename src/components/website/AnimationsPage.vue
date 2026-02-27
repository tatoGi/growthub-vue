<template>
  <div class="site-shell">
    <WebsiteHeader />
    
    <main class="main-content">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs-bar">
        <div class="container">
          <ul class="breadcrumbs">
            <li><a href="#/">მთავარი</a></li>
            <li><span class="separator">/</span></li>
            <li class="active">ვიდეო ანიმაციები</li>
          </ul>
        </div>
      </div>

      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="title-wrapper">
            <div class="line"></div>
            <h1>ვიდეო ანიმაციები</h1>
            <div class="line"></div>
          </div>
        </div>
      </section>

      <!-- Videos Grid -->
      <section class="videos-grid-section">
        <div class="container">
          <div class="grid">
            <article v-for="video in allVideos" :key="video.id" class="video-card">
              <div class="video-preview-wrapper">
                <img :src="video.thumbnail" :alt="video.title" />
                <div class="play-overlay">
                  <div class="play-button">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="video-info">
                <h3>{{ video.title }}</h3>
                <p>{{ video.description }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <WebsiteFooter />
  </div>
</template>

<script setup>
import WebsiteHeader from './home/WebsiteHeader.vue'
import WebsiteFooter from './home/WebsiteFooter.vue'

const allVideos = [
  {
    id: 1,
    title: 'როგორ დავიწყოთ ბიზნესი?',
    description: 'ანიმაციური გზამკვლევი დამწყები მეწარმეებისთვის ბიზნესის რეგისტრაციის ეტაპებზე.',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: 'სახელმწიფო პროგრამები 2024',
    description: 'მოკლე მიმოხილვა ყველა იმ აქტიური პროგრამის შესახებ, რომელსაც სახელმწიფო სთავაზობს ბიზნესს.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: 'ექსპორტის ხელშეწყობა',
    description: 'ანიმაცია ქართული პროდუქციის საექსპორტო პოტენციალის გაზრდის მექანიზმებზე.',
    thumbnail: 'https://images.unsplash.com/photo-1544151462-c55f10adda3c?auto=format&fit=crop&q=80&w=400'
  }
]
</script>
