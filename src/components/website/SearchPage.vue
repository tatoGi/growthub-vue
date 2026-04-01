<template>
  <InnerPageLayout breadcrumb="ძებნა" title="ძებნა" :description="searchDescription">
    <section class="content-section surface-section">
      <div class="container">
        <div class="search-page-shell">
          <form class="search-page-form" @submit.prevent>
            <input v-model="localQuery" type="text" placeholder="მოძებნე პროგრამა, ღონისძიება, გვერდი..." />
            <button type="button" class="submit-btn-premium" @click="applySearch">ძებნა</button>
          </form>

          <div v-if="results.length" class="search-results-list">
            <a v-for="item in results" :key="`${item.type}-${item.slug}`" :href="item.link" class="search-result-card">
              <div class="search-result-meta">
                <span>{{ item.type }}</span>
                <span>{{ item.group }}</span>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </a>
          </div>

          <div v-else class="empty-state-card">
            <h3>შედეგი ვერ მოიძებნა</h3>
            <p>სცადე სხვა საკვანძო სიტყვა ან გადაამოწმე მართლწერა.</p>
          </div>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { programs } from '../../data/programs'
import { videos } from '../../data/videos'
import { partners } from '../../data/partners'
import { teamMembers } from '../../data/team'
import { agencies } from '../../data/agencies'
import { textPages } from '../../data/pages'
import { useEvents } from '../../composables/useEvents'

const props = defineProps({
  query: {
    type: String,
    default: '',
  },
})

const localQuery = ref(props.query)
const { events, loadEvents } = useEvents()

watch(
  () => props.query,
  (value) => {
    localQuery.value = value
  }
)

onMounted(() => {
  loadEvents()
})

const searchableItems = computed(() => [
  ...programs.map((item) => ({
    type: 'პროგრამა',
    group: 'Programs',
    slug: item.slug,
    title: item.title,
    description: item.description,
    link: `#programs/${item.slug}`,
  })),
  ...events.value.map((item) => ({
    type: 'ღონისძიება',
    group: 'Events',
    slug: item.slug,
    title: item.title,
    description: item.description,
    link: `#events/${item.slug}`,
  })),
  ...videos.map((item) => ({
    type: 'ვიდეო',
    group: 'Video Gallery',
    slug: item.slug,
    title: item.title,
    description: item.description,
    link: `#animations/${item.slug}`,
  })),
  ...partners.map((item) => ({
    type: 'პარტნიორი',
    group: 'About',
    slug: item.slug,
    title: item.name,
    description: item.description,
    link: `#about/partners/${item.slug}`,
  })),
  ...teamMembers.map((item) => ({
    type: 'გუნდი',
    group: 'About',
    slug: item.slug,
    title: item.name,
    description: item.bio,
    link: `#about/team/${item.slug}`,
  })),
  ...agencies.map((item) => ({
    type: 'სააგენტო',
    group: 'Agency',
    slug: item.slug,
    title: item.name,
    description: item.description,
    link: `#agency/${item.slug}`,
  })),
  ...textPages.map((item) => ({
    type: 'ტექსტური გვერდი',
    group: 'Pages',
    slug: item.slug,
    title: item.title,
    description: item.summary,
    link: `#page/${item.slug}`,
  })),
])

const normalizedQuery = computed(() => props.query.trim().toLowerCase())

const results = computed(() => {
  if (!normalizedQuery.value) {
    return searchableItems.value.slice(0, 8)
  }

  return searchableItems.value.filter((item) => {
    const haystack = `${item.title} ${item.description} ${item.type} ${item.group}`.toLowerCase()
    return haystack.includes(normalizedQuery.value)
  })
})

const searchDescription = computed(() =>
  props.query
    ? `ძიების შედეგები მოთხოვნისთვის: "${props.query}"`
    : 'Laravel-ის search page-ის თანამედროვე Vue ვერსია, სადაც შედეგები რამდენიმე public სექციიდან ერთიანდება.'
)

const applySearch = () => {
  const encoded = encodeURIComponent(localQuery.value.trim())
  window.location.hash = encoded ? `#search?q=${encoded}` : '#search'
}
</script>
