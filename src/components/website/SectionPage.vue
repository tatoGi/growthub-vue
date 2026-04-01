<template>
  <ProgramsPage v-if="page?.kind === 'programs'" :slug="slug" />
  <EventsPage v-else-if="page?.kind === 'events'" :slug="slug" />
  <AnimationsPage v-else-if="page?.kind === 'animations'" :slug="slug" />
  <AgencyPage v-else-if="page?.kind === 'agency'" :slug="slug" />
  <ContactPage v-else-if="page?.kind === 'contact'" :slug="slug" />

  <!-- standard dynamic pages -->
  <InnerPageLayout
    v-else
    :breadcrumb="page?.title || slug"
    :title="page?.title || ''"
    :description="page?.description || ''"
    :cover="page?.cover || ''"
  >
    <!-- Loading -->
    <section v-if="loading" class="content-section">
      <div class="container">
        <p class="page-loading">იტვირთება...</p>
      </div>
    </section>

    <!-- Error -->
    <section v-else-if="error" class="content-section">
      <div class="container">
        <p class="page-error">გვერდი ვერ მოიძებნა.</p>
      </div>
    </section>

    <!-- kind: text_page -->
    <section v-else-if="page?.kind === 'text_page'" class="content-section surface-section">
      <div class="container">
        <div
          v-if="page.body_html"
          class="rich-text"
          v-html="page.body_html"
        />
      </div>
    </section>

    <!-- kind: faq -->
    <section v-else-if="page?.kind === 'faq'" class="content-section">
      <div class="container narrow-copy">
        <div class="faq-list">
          <article
            v-for="item in page.items"
            :key="item.id"
            class="faq-card faq-card-interactive"
          >
            <button type="button" class="faq-toggle" @click="toggle(item.id)">
              <span>{{ item.question }}</span>
              <strong>{{ openId === item.id ? '−' : '+' }}</strong>
            </button>
            <div
              v-if="openId === item.id && item.answer"
              class="faq-answer rich-text"
              v-html="item.answer"
            />
          </article>
        </div>
      </div>
    </section>

    <!-- kind: section (submenu with children) -->
    <section v-else-if="page?.kind === 'section'" class="content-section surface-section">
      <div class="container">
        <div class="feature-grid three-up">
          <article
            v-for="child in page.children"
            :key="child.id"
            class="feature-card"
          >
            <div v-if="child.cover" class="feature-card-image">
              <img :src="child.cover" :alt="child.title" loading="lazy" />
            </div>
            <h3>{{ child.title }}</h3>
            <p>{{ child.description }}</p>
            <a :href="child.link" class="feature-link">გახსნა</a>
          </article>
        </div>
      </div>
    </section>

    <!-- kind: post_list (team, partners, etc.) -->
    <section v-else-if="page?.kind === 'post_list'" class="content-section surface-section">
      <div class="container">
        <div class="members-grid">
          <article
            v-for="item in page.items"
            :key="item.id"
            class="member-card"
          >
            <div class="member-photo">
              <img
                v-if="item.thumb || item.cover"
                :src="item.thumb || item.cover"
                :alt="item.title"
                loading="lazy"
              />
              <div v-else class="member-initials">
                {{ initials(item.title) }}
              </div>
            </div>
            <div class="member-info">
              <h3>{{ item.title }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { usePage } from '../../composables/usePage'
import ProgramsPage from './ProgramsPage.vue'
import EventsPage from './EventsPage.vue'
import AnimationsPage from './AnimationsPage.vue'
import AgencyPage from './AgencyPage.vue'
import ContactPage from './ContactPage.vue'

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
})

const { page, loading, error, load } = usePage()
const openId = ref(null)

onMounted(() => load(props.slug))

watch(() => props.slug, (slug) => {
  openId.value = null
  load(slug)
})

function toggle(id) {
  openId.value = openId.value === id ? null : id
}

function initials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}
</script>

<style scoped>
.page-loading,
.page-error,
.page-placeholder {
  color: var(--text-muted, #94a3b8);
  text-align: center;
  padding: 3rem 0;
}

.rich-text {
  color: var(--text-secondary, #cbd5e1);
  line-height: 1.8;
  max-width: 72ch;
}

.rich-text :deep(p) { margin-bottom: 1rem; }
.rich-text :deep(ul), .rich-text :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.rich-text :deep(li) { margin-bottom: 0.35rem; }
.rich-text :deep(h2), .rich-text :deep(h3) { color: #f1f5f9; margin: 1.5rem 0 0.75rem; }
.rich-text :deep(strong) { color: #f1f5f9; }
.rich-text :deep(a) { color: #38bdf8; }

.faq-answer {
  padding: 1rem 1.25rem 1.25rem;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.member-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 1.25rem;
  overflow: hidden;
  text-align: center;
  padding-bottom: 1.25rem;
}

.member-photo {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #0f172a;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #38bdf8;
  background: linear-gradient(135deg, #0f2744, #0f172a);
}

.member-info {
  padding: 0.875rem 1rem 0;
}

.member-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 0.25rem;
}

.member-info p {
  font-size: 0.78rem;
  color: #64748b;
}

.feature-card-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.feature-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
