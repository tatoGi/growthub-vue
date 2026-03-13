<template>
  <InnerPageLayout
    breadcrumb="პარტნიორი ორგანიზაციები"
    title="პარტნიორი ორგანიზაციები"
    description="ორგანიზაციები, რომელთა მონაწილეობაც ზრდის ეკოსისტემის ინფორმაციულ და პრაქტიკულ შესაძლებლობებს."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="feature-grid three-up">
          <a v-for="partner in partners" :key="partner.slug" :href="`#about/partners/${partner.slug}`" class="feature-card feature-card-link">
            <div class="feature-icon">{{ partner.short }}</div>
            <h3>{{ partner.name }}</h3>
            <p>{{ partner.text }}</p>
            <span class="feature-link">დეტალურად</span>
          </a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { partners } from '../../data/partners'
</script>
