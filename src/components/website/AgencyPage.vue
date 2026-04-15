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

const agencies = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    agencies.value = [
      {
        slug: 'mock-agency-1',
        name: 'Mock სააგენტო',
        description: 'ეს არის დროებითი მონაცემები ლოკალური რეჟიმისთვის.',
        address: 'თბილისი',
        phone: '555 123 456'
      }
    ]
  } finally {
    loading.value = false
  }
})
</script>
