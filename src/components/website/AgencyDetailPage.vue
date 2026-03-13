<template>
  <InnerPageLayout
    :breadcrumb="agency ? agency.name : 'სააგენტო'"
    :title="agency ? agency.name : 'სააგენტო ვერ მოიძებნა'"
    :description="agency ? agency.description : 'მითითებული სააგენტო ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="agency" class="agency-detail-layout">
          <article class="detail-card">
            <img class="agency-detail-image" :src="agency.photo" :alt="agency.name" />
            <h3>{{ agency.name }}</h3>
            <p>{{ agency.text }}</p>
          </article>

          <article class="detail-card">
            <h3>საკონტაქტო ინფორმაცია</h3>
            <div class="meta-stack">
              <div class="meta-row"><span>მისამართი</span><strong>{{ agency.address }}</strong></div>
              <div class="meta-row"><span>ტელეფონი</span><strong>{{ agency.phone }}</strong></div>
              <div class="meta-row"><span>ელ. ფოსტა</span><strong>{{ agency.email }}</strong></div>
              <div class="meta-row"><span>ვებგვერდი</span><strong>{{ agency.website }}</strong></div>
            </div>
            <div class="pill-list">
              <span v-for="item in agency.social" :key="item" class="pill-item">{{ item }}</span>
            </div>
            <a href="#agency" class="back-link">ყველა სააგენტო</a>
          </article>
        </div>

        <div v-else class="empty-state-card">
          <h3>სააგენტო ვერ მოიძებნა</h3>
          <p>შესაძლოა ბმული შეიცვალა ან agency ჯერ არ არის დამატებული.</p>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { agencies } from '../../data/agencies'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const agency = computed(() => agencies.find((item) => item.slug === props.slug))
</script>
