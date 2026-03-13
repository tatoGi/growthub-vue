<template>
  <InnerPageLayout
    v-if="event"
    :breadcrumb="event.title"
    :title="event.title"
    :description="event.description"
  >
    <section class="content-section">
      <div class="container">
        <div class="event-detail-layout">
          <div class="event-detail-main">
            <img :src="event.image" :alt="event.title" class="event-detail-image" />

            <div class="detail-card">
              <h3>ღონისძიების აღწერა</h3>
              <p>{{ event.fullDescription }}</p>
            </div>

            <div class="detail-card" v-if="event.attachments.length">
              <h3>მიმაგრებული ფაილები</h3>
              <ul class="detail-list">
                <li v-for="file in event.attachments" :key="file">{{ file }}</li>
              </ul>
            </div>
          </div>

          <aside class="event-detail-sidebar">
            <div class="detail-card">
              <h3>ღონისძიების ინფორმაცია</h3>
              <div class="meta-stack">
                <div class="meta-row">
                  <span>ტიპი</span>
                  <strong>{{ event.type }}</strong>
                </div>
                <div class="meta-row">
                  <span>ლოკაცია</span>
                  <strong>{{ event.location }}</strong>
                </div>
                <div class="meta-row">
                  <span>თარიღი</span>
                  <strong>{{ event.dateLabel }}</strong>
                </div>
              </div>
              <a :href="`#events/${event.slug}/register`" class="primary-action-link">რეგისტრაცია</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </InnerPageLayout>

  <InnerPageLayout
    v-else
    breadcrumb="ღონისძიება ვერ მოიძებნა"
    title="ღონისძიება ვერ მოიძებნა"
    description="მითითებული ღონისძიება ამ mock ვერსიაში არ არსებობს."
  >
    <section class="content-section">
      <div class="container narrow-copy">
        <div class="rich-card">
          <h3>დაბრუნდი სიაში</h3>
          <p>აირჩიე ღონისძიება ხელახლა საერთო სიიდან.</p>
          <a href="#events" class="primary-action-link">ღონისძიებების გახსნა</a>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { findEventBySlug } from '../../data/events'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const event = computed(() => findEventBySlug(props.slug))
</script>
