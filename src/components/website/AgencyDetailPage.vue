<template>
  <InnerPageLayout
    v-if="loading"
    breadcrumb="სააგენტოები"
    title=""
    description=""
  >
    <section class="content-section">
      <div class="container">
        <p class="page-loading">იტვირთება...</p>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else-if="agency"
    :breadcrumb="agency.name"
    :title="agency.name"
    :description="agency.description || ''"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="agency-detail-layout">
          <article class="detail-card">
            <img v-if="agency.photo || agency.cover" class="agency-detail-image" :src="agency.photo || agency.cover" :alt="agency.name" />
            <h3>{{ agency.name }}</h3>
            <p>{{ agency.text || agency.description }}</p>
          </article>

          <article class="detail-card">
            <h3>საკონტაქტო ინფორმაცია</h3>
            <div class="meta-stack">
              <div v-if="agency.address" class="meta-row"><span>მისამართი</span><strong>{{ agency.address }}</strong></div>
              <div v-if="agency.phone" class="meta-row"><span>ტელეფონი</span><strong>{{ agency.phone }}</strong></div>
              <div v-if="agency.email" class="meta-row"><span>ელ. ფოსტა</span><strong>{{ agency.email }}</strong></div>
              <div v-if="agency.website" class="meta-row"><span>ვებგვერდი</span><strong>{{ agency.website }}</strong></div>
            </div>
            <div v-if="agency.social?.length" class="pill-list">
              <span v-for="item in agency.social" :key="item" class="pill-item">{{ item }}</span>
            </div>
            <a href="#agency" class="back-link">ყველა სააგენტო</a>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else
    breadcrumb="სააგენტო ვერ მოიძებნა"
    title="სააგენტო ვერ მოიძებნა"
    description=""
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="empty-state-card">
          <h3>სააგენტო ვერ მოიძებნა</h3>
          <p>შესაძლოა ბმული შეიცვალა ან სააგენტო ჯერ არ არის დამატებული.</p>
          <a href="#agency" class="back-link">სია</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const agency = ref(null)
const loading = ref(false)

async function loadAgency(slug) {
  if (!slug) return
  loading.value = true
  agency.value = null
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    agency.value = {
      slug: slug,
      name: `Mock Agency ${slug}`,
      description: 'ეს სააგენტო ჩატვირთულია mock რეჟიმში.',
      address: 'თბილისი, საქართველო',
      phone: '+995 555 00 00 00',
      email: 'info@mock.ge'
    }
  } catch {
    agency.value = null
  } finally {
    loading.value = false
  }
}

watch(() => props.slug, loadAgency, { immediate: true })
</script>
