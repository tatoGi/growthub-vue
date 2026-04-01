<template>
  <InnerPageLayout
    breadcrumb="სააგენტოები"
    title="სააგენტოები"
    description=""
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="loading" class="page-loading">იტვირთება...</div>
        <div v-else class="agency-list">
          <a
            v-for="agency in agencies"
            :key="agency.slug"
            :href="`#agency/${agency.slug}`"
            class="agency-list-card"
          >
            <img v-if="agency.photo" :src="agency.photo" :alt="agency.name" />
            <div class="agency-list-copy">
              <h3>{{ agency.name }}</h3>
              <p>{{ agency.description }}</p>
              <div class="agency-meta-stack">
                <span v-if="agency.address">{{ agency.address }}</span>
                <span v-if="agency.phone">{{ agency.phone }}</span>
                <span v-if="agency.email">{{ agency.email }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import http from '../../api/http'

const agencies = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await http.get('/website/agencies')
    agencies.value = data?.data ?? []
  } finally {
    loading.value = false
  }
})
</script>
