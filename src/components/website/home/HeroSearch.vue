<template>
  <section class="hero-section">
    <div class="hero-bg" :style="hero.bg_image ? { backgroundImage: `url(${hero.bg_image})` } : {}"></div>
    <div class="hero-overlay"></div>

    <div class="container">
      <div class="content fade-in-up">
        <div v-if="hero.badge" class="badge">
          <span class="badge-dot"></span>
          <span class="hero-copy-stack hero-copy-stack--badge">
            <span class="hero-copy-primary">{{ hero.badge }}</span>
          </span>
        </div>

        <h1>
          <span class="hero-copy-primary">{{ hero.title }}</span>
        </h1>
        <p class="description">
          <span class="hero-copy-primary">{{ hero.description }}</span>
        </p>

        <div class="search-container">
          <form class="search-form" action="/" @submit.prevent="submitSearch">
            <div class="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input v-model="query" type="text" name="search" placeholder="რას ეძებთ? მოძებნეთ სერვისები, პროგრამები..." />
            </div>
            <button type="submit" class="search-btn">
              <span>ძებნა</span>
            </button>
          </form>

          <div v-if="hero.quick_tags?.length" class="quick-tags">
            <span class="tag-label">ხშირად ძებნადი:</span>
            <div class="tags-list">
              <a
                v-for="tag in hero.quick_tags"
                :key="tag"
                :href="`#search?q=${encodeURIComponent(tag.replace(/^#/, ''))}`"
              >{{ tag }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useHome } from '../../../composables/useHome'

const { hero } = useHome()
const query = ref('')

const submitSearch = () => {
  const encoded = encodeURIComponent(query.value.trim())
  window.location.hash = encoded ? `#search?q=${encoded}` : '#search'
}
</script>
