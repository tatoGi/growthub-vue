<template>
  <InnerPageLayout
    :breadcrumb="member ? member.name : 'გუნდი'"
    :title="member ? member.name : 'თანამშრომელი ვერ მოიძებნა'"
    :description="member ? member.role : 'მითითებული პროფილი ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="member" class="team-detail-layout">
          <article class="detail-card">
            <img v-if="member.photo" class="team-detail-image" :src="member.photo" :alt="member.name" />
          </article>
          <article class="detail-card">
            <div class="team-avatar large">{{ member.initials }}</div>
            <h3>{{ member.name }}</h3>
            <span class="team-detail-role">{{ member.role }}</span>
            <p>{{ member.bio }}</p>
            <p>{{ member.text }}</p>
            <a href="#about/team" class="back-link">გუნდის სია</a>
          </article>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { teamMembers } from '../../data/team'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const member = computed(() => teamMembers.find((item) => item.slug === props.slug))
</script>
