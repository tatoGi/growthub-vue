<template>
  <InnerPageLayout
    :breadcrumb="event ? `${event.title} / რეგისტრაცია` : 'რეგისტრაცია'"
    :title="event ? `${event.title} / რეგისტრაცია` : 'რეგისტრაცია ვერ მოიძებნა'"
    :description="event ? 'რეგისტრაციის გვერდი იტვირთება CMS ღონისძიების მონაცემებით.' : 'მითითებული ღონისძიება ამ დროისთვის ხელმისაწვდომი არ არის.'"
  >
    <section class="content-section surface-section">
      <div class="container">
        <div v-if="event && !submitted" class="event-registration-layout">
          <article class="detail-card">
            <span v-if="event.type" class="program-detail-tag">{{ event.type }}</span>
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
            <div class="meta-stack">
              <div v-if="event.location" class="meta-row">
                <span>ლოკაცია</span>
                <strong>{{ event.location }}</strong>
              </div>
              <div v-if="event.dateLabel" class="meta-row">
                <span>თარიღი</span>
                <strong>{{ event.dateLabel }}</strong>
              </div>
              <div v-if="event.type" class="meta-row">
                <span>ფორმატი</span>
                <strong>{{ event.type }}</strong>
              </div>
            </div>
          </article>

          <article class="detail-card">
            <h3>ვინ დაესწრება ღონისძიებას</h3>
            <form class="contact-page-form" @submit.prevent="submitted = true">
              <div class="form-row">
                <div class="form-group">
                  <label>სახელი და გვარი</label>
                  <input v-model="form.fullName" type="text" placeholder="შეიყვანე სახელი და გვარი" />
                </div>
                <div class="form-group">
                  <label>პოზიცია</label>
                  <input v-model="form.position" type="text" placeholder="პოზიცია კომპანიაში" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>პირადი ნომერი</label>
                  <input v-model="form.personalId" type="text" inputmode="numeric" placeholder="11 ციფრი" />
                </div>
                <div class="form-group">
                  <label>ტელეფონი</label>
                  <input v-model="form.phone" type="text" inputmode="numeric" placeholder="+995 გარეშე" />
                </div>
              </div>

              <div class="form-group">
                <label>ელ. ფოსტა</label>
                <input v-model="form.email" type="email" placeholder="example@mail.com" />
              </div>

              <div class="form-group">
                <label>მოტივაცია</label>
                <textarea v-model="form.note" rows="6" placeholder="მოკლედ აღწერე რატომ გსურს მონაწილეობის მიღება"></textarea>
              </div>

              <label class="auth-checkbox">
                <input v-model="form.accepted" type="checkbox" />
                <span>ვეთანხმები მონაწილეობის წესებს და პირობებს</span>
              </label>

              <button type="submit" class="submit-btn-premium">რეგისტრაციის გაგზავნა</button>
            </form>
          </article>
        </div>

        <div v-else-if="event && submitted" class="auth-success-card registration-success-card">
          <span class="eyebrow">Submitted</span>
          <h2>რეგისტრაციის მოთხოვნა მიღებულია</h2>
          <p>
            ეს არის front-end ვიზუალური ვერსია. Laravel-ის რეალურ CRM submit/validation flow-ზე მიბმა შემდეგ ეტაპზე გაკეთდება.
          </p>
          <div class="project-share-actions">
            <a :href="`#events/${event.slug}`" class="back-link">ღონისძიებაზე დაბრუნება</a>
            <a href="#events" class="primary-action-link">სხვა ღონისძიებები</a>
          </div>
        </div>

        <div v-else class="empty-state-card">
          <h3>ღონისძიება ვერ მოიძებნა</h3>
          <p>რეგისტრაციის გვერდი მხოლოდ არსებული ღონისძიებისთვის იხსნება.</p>
        </div>
      </div>
    </section>
  </InnerPageLayout>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import InnerPageLayout from './shared/InnerPageLayout.vue'
import { useEvents } from '../../composables/useEvents'

const props = defineProps({
  slug: {
    type: String,
    default: '',
  },
})

const { eventDetails, loadEvent } = useEvents()

watch(
  () => props.slug,
  (slug) => {
    if (slug) {
      loadEvent(slug)
    }
  },
  { immediate: true },
)

const event = computed(() => eventDetails[props.slug] ?? null)
const submitted = ref(false)

const form = reactive({
  fullName: '',
  position: '',
  personalId: '',
  phone: '',
  email: '',
  note: '',
  accepted: false,
})
</script>
