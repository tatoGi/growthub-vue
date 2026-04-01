<template>
  <div class="site-shell">
    <WebsiteHeader />

    <main class="main-content">
      <div class="breadcrumbs-bar">
        <div class="container">
          <ul class="breadcrumbs">
            <li><a href="#/">მთავარი</a></li>
            <li><span class="separator">/</span></li>
            <li class="active">{{ breadcrumb }}</li>
          </ul>
        </div>
      </div>

      <section class="page-header">
        <div class="container">
          <div class="title-wrapper">
            <div class="line"></div>
            <h1>{{ title }}</h1>
            <div class="line"></div>
          </div>
          <p v-if="description" class="page-description">{{ description }}</p>
        </div>
      </section>

      <section v-if="cover" class="page-cover-section">
        <div class="container">
          <div class="page-cover-frame">
            <img :src="cover" :alt="title" class="page-cover-image" />
          </div>
        </div>
      </section>

      <slot />
    </main>

    <WebsiteFooter />
  </div>
</template>

<script setup>
import WebsiteHeader from '../home/WebsiteHeader.vue'
import WebsiteFooter from '../home/WebsiteFooter.vue'

defineProps({
  breadcrumb: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.page-cover-section {
  padding: 0 0 1.5rem;
}

.page-cover-frame {
  position: relative;
  overflow: hidden;
  border-radius: 2rem;
  min-height: clamp(220px, 38vw, 420px);
  background:
    linear-gradient(135deg, rgba(7, 22, 42, 0.28), rgba(10, 15, 27, 0.62)),
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.22);
}

.page-cover-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(15, 23, 42, 0.14));
  pointer-events: none;
}

.page-cover-image {
  display: block;
  width: 100%;
  height: clamp(220px, 38vw, 420px);
  object-fit: cover;
}
</style>
