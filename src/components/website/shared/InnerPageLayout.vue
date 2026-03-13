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
})
</script>
