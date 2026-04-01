<template>
  <InnerPageLayout
    :breadcrumb="page.title || 'ღონისძიებები'"
    :title="page.title || 'ღონისძიებები'"
    :description="page.description"
  >
    <section class="events-grid-section">
      <div class="container">
        <div class="events-filter-bar">
          <select v-model="selectedRegion" class="filter-control">
            <option value="">რეგიონი</option>
            <option v-for="region in eventRegions" :key="region" :value="region">{{ region }}</option>
          </select>

          <select v-model="selectedType" class="filter-control">
            <option value="">ღონისძიების ტიპი</option>
            <option v-for="type in eventTypes" :key="type" :value="type">{{ type }}</option>
          </select>

          <input
            v-model.trim="searchTerm"
            class="filter-control filter-search"
            type="text"
            placeholder="მოძებნე ღონისძიება"
          />
        </div>

        <div v-if="filteredEvents.length" class="grid">
          <article v-for="event in filteredEvents" :key="event.id" class="event-card">
            <div v-if="event.image" class="card-image-wrapper">
              <div class="card-image">
                <img :src="event.image" :alt="event.title" loading="lazy" />
                <div class="image-overlay"></div>
              </div>
              <div v-if="event.day || event.month" class="date-badge">
                <span class="day">{{ event.day }}</span>
                <span class="month">{{ event.month }}</span>
              </div>
            </div>
            <div class="card-content">
              <div class="event-meta">
                <span v-if="event.type" class="event-type">{{ event.type }}</span>
                <span v-if="event.location" class="event-location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ event.location }}
                </span>
              </div>
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
              <div class="card-footer">
                <a :href="`#events/${event.slug}`" class="join-btn">დეტალურად ნახვა</a>
              </div>
            </div>
          </article>
        </div>

        <div v-else-if="eventsPending" class="empty-state-card">
          <h3>ღონისძიებები იტვირთება</h3>
          <p>მიმდინარე სია იტვირთება ადმინისტრირებული კონტენტიდან.</p>
        </div>

        <div v-else class="empty-state-card">
          <h3>ღონისძიება ვერ მოიძებნა</h3>
          <p>შეცვალე ფილტრი ან საძიებო სიტყვა და სცადე თავიდან.</p>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { useEvents } from '../../composables/useEvents'

const selectedRegion = ref('')
const selectedType = ref('')
const searchTerm = ref('')
const { page, events, eventsPending, loadEvents } = useEvents()

onMounted(() => {
  loadEvents()
})

const eventRegions = computed(() => page.value.filters?.locations || [])
const eventTypes = computed(() => page.value.filters?.types || [])

const filteredEvents = computed(() =>
  events.value.filter((event) => {
    const matchesRegion = !selectedRegion.value || event.location === selectedRegion.value
    const matchesType = !selectedType.value || event.type === selectedType.value
    const query = searchTerm.value.toLowerCase()
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query)

    return matchesRegion && matchesType && matchesSearch
  })
)
</script>
