<template>
  <InnerPageLayout
    breadcrumb="სააგენტოები"
    title="სააგენტოები"
    description="Laravel agency list view-ის თანამედროვე Vue ვერსია, სადაც სააგენტოები მოკლე საკონტაქტო ინფორმაციით და detail ბმულით ჩანს."
  >
    <section class="content-section surface-section">
      <div class="container">
        <div class="agency-list">
          <a v-for="agency in agencies" :key="agency.slug" :href="`#agency/${agency.slug}`" class="agency-list-card">
            <img :src="agency.photo" :alt="agency.name" />
            <div class="agency-list-copy">
              <h3>{{ agency.name }}</h3>
              <p>{{ agency.description }}</p>
              <div class="agency-meta-stack">
                <span>{{ agency.address }}</span>
                <span>{{ agency.phone }}</span>
                <span>{{ agency.email }}</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { agencies } from '../../data/agencies'
</script>
