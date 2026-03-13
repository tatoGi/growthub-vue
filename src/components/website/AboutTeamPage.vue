<template>
  <InnerPageLayout
    breadcrumb="ჩვენი გუნდი"
    title="ჩვენი გუნდი"
    description="გუნდის გვერდი აჩვენებს ადამიანებს, როლებს და მათ კომპეტენციის ძირითად სფეროებს."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="feature-grid three-up">
          <a v-for="member in teamMembers" :key="member.slug" :href="`#about/team/${member.slug}`" class="team-card feature-card-link">
            <div class="team-avatar">{{ member.initials }}</div>
            <h3>{{ member.name }}</h3>
            <span>{{ member.role }}</span>
            <p>{{ member.text }}</p>
            <span class="feature-link">პროფილი</span>
          </a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { teamMembers } from '../../data/team'
</script>
